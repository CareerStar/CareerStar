from flask import Flask, jsonify, request, url_for
import os
import psycopg2
import json
import boto3
import base64
import logging
from db import ConnectionPool
from dotenv import load_dotenv, dotenv_values
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta, datetime
import mailchimp_marketing as MailchimpMarketing
from mailchimp_marketing import Client
from mailchimp_marketing.api_client import ApiClientError
import requests
import threading
from flask_mail import Mail, Message
from itsdangerous import URLSafeTimedSerializer
from typing import List, Dict, Any

from pypdf import PdfReader  # modern package name

# first try to load from development
load_dotenv(".env.development")
# override with prod values if they exist
load_dotenv(".env")

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = os.getenv("SECRET_KEY")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=7)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)
app.config["JWT_VERIFY_SUB"] = False
jwt = JWTManager(app)
# CORS(app, origins="*", supports_credentials=True, allow_headers="*")
CORS(app, origins=["http://localhost:3000", "https://app.careerstar.co"])

s3 = boto3.client("s3")
bucket = "cuny-citytech"

db_host = os.getenv("DB_HOST")
db_port = os.getenv("DB_PORT")
db_name = os.getenv("DB_NAME")
db_user = os.getenv("DB_USER")
db_password = os.getenv("DB_PASSWORD")

db_pool = ConnectionPool(
    1,
    20,  # Min and max connections
    host=db_host,
    port=db_port,
    database=db_name,
    user=db_user,
    password=db_password,
)

# Backwards-compatible helpers using the new pool
# Prefer using: `with db_pool.connection() as connection:`
def get_db_connection():
    """Get a connection from the global pool.

    Note: New code should use `with db_pool.connection() as conn:` instead of
    calling this function directly.
    """
    return db_pool.getconn()


def return_db_connection(connection):
    """Return a connection to the pool safely.

    Tolerates already-closed connections to avoid errors in legacy call sites.
    """
    try:
        if connection and getattr(connection, "closed", 0) == 0:
            db_pool.putconn(connection)
    except Exception:
        # Best-effort return; ignore pool/connection state errors
        pass


mailchimp_api_key = os.getenv("MAILCHIMP_API_KEY")
mailchimp_server = os.getenv("MAILCHIMP_SERVER")
mailchimp_audience_id = os.getenv("MAILCHIMP_AUDIENCE_ID")

openrouter_api_key = os.getenv("OPENROUTER_API_KEY")


app.config.from_mapping(dotenv_values(".env"))
mail = Mail(app)


S3_BUCKET = os.getenv("AWS_BUCKET")
S3_KEY = os.getenv("AWS_ACCESS_KEY")
S3_SECRET = os.getenv("AWS_SECRET_KEY")
S3_REGION = os.getenv("AWS_REGION")

s3 = boto3.client(
    "s3",
    aws_access_key_id=S3_KEY,
    aws_secret_access_key=S3_SECRET,
    region_name=S3_REGION,
)
bedrock_region = os.getenv("BEDROCK_REGION", S3_REGION or "us-east-1")
bedrock_model_id = os.getenv(
    "BEDROCK_MODEL_ID", "anthropic.claude-3-sonnet-20240229-v1:0"
)
bedrock = boto3.client("bedrock-runtime", region_name=bedrock_region)


logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[logging.FileHandler("careerstar-backend.log"), logging.StreamHandler()],
)

logger = logging.getLogger()


serializer = URLSafeTimedSerializer(os.getenv("SECRET_KEY"))


def check_user_by_email(email):
    try:
        with db_pool.connection() as connection:
            cursor = connection.cursor()

            email = email.lower()
            query = "SELECT 1 FROM Users WHERE emailID = %s;"
            cursor.execute(query, (email,))
            result = cursor.fetchone()

            return result is not None

    except Exception as error:
        print("Error in get_user_by_email:", error)
        return False


@app.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json()
    email = data.get("email")

    user = check_user_by_email(email)

    if not user:
        return jsonify({"message": "Email not registered"}), 400

    logger.info("Here 101")
    token = serializer.dumps(email, salt="password-reset")

    logger.info(token)
    app_url = "https://app.careerstar.co/"
    reset_url = f"{app_url}reset-password/{token}"

    logger.info("Reset url:", reset_url)

    msg = Message(
        "Password Reset Request", sender="support@careerstar.co", recipients=[email]
    )
    msg.body = f"Click the link to reset your password: {reset_url}"

    logger.info("Message", msg)
    mail.send(msg)

    return jsonify({"message": "Password reset email sent"}), 200


def update_user_password(email, new_password):
    try:
        with db_pool.connection() as connection:
            cursor = connection.cursor()

            hashed_password = generate_password_hash(new_password)

            update_query = """
            UPDATE Users
            SET password = %s
            WHERE emailID = %s;
            """
            cursor.execute(update_query, (hashed_password, email.lower()))
            connection.commit()

            return True

    except Exception as error:
        print("Error updating user password:", error)
        return False


@app.route('/reset-password/<token>', methods=['POST'])
def reset_password(token):
    print("token", token)
    try:
        email = serializer.loads(token, salt="password-reset", max_age=3600)
    except Exception as e:
        logger.error("unable to reset password", err=e)
        return jsonify({"message": "Invalid or expired token"}), 400

    data = request.get_json()
    new_password = data.get("password")

    update_user_password(email, new_password)

    return jsonify({"message": "Password successfully reset"}), 200

def add_contact_to_mailchimp(audience_id, email, firstname, interview_date):
    mailchimp = Client()
    mailchimp.set_config({
        "api_key": mailchimp_api_key,
        "server": mailchimp_server
    })

    try:
        # Add or update a contact in the audience
        response = mailchimp.lists.add_list_member(audience_id, {
            "email_address": email,
            "status": "subscribed",
            "merge_fields": {
                "FNAME": firstname,
                "INTERVIEWD": interview_date
            }
        })

        # Add a tag to the contact
        mailchimp.lists.update_list_member_tags(
            audience_id,
            response["id"],
            {"tags": [{"name": "interview-yes", "status": "active"}]}
        )

        print("Contact added successfully:")
    except ApiClientError as error:
        print("An error occurred:", error.text)

def sign_up_journey_mailchimp(email, firstname):
    mailchimp = Client()
    mailchimp.set_config({
        "api_key": mailchimp_api_key,
        "server": mailchimp_server
    })

    try:
        response = mailchimp.lists.add_list_member(mailchimp_audience_id, {
            "email_address": email,
            "status": "subscribed",
            "merge_fields": {
                "FNAME": firstname,
            }
        })

        mailchimp.lists.update_list_member_tags(
            mailchimp_audience_id,
            response["id"],
            {"tags": [{"name": "sign-up", "status": "active"}]}
        )

        print("Contact added successfully:")
    except ApiClientError as error:
        print("An error occurred:", error.text)

def check_access_code(access_code):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        get_access_code_query = """
        SELECT usage_limit, usage_count, expires_at FROM access_codes WHERE code ILIKE %s;
        """

        cursor.execute(get_access_code_query, (access_code,))
        access_code_details = cursor.fetchone()

        if access_code_details:
            usage_limit = access_code_details[0]
            usage_count = access_code_details[1]
            expires_at = access_code_details[2]
        else:
            return False
        
        if expires_at and expires_at < datetime.now():
            return False
        
        if usage_limit and usage_count >= usage_limit:
            return False

        update_access_code_query = """
        UPDATE access_codes
        SET usage_count = %s
        WHERE code = %s;
        """
        cursor.execute(update_access_code_query, (usage_count + 1, access_code))

        connection.commit()
        
        return True
    
    except Exception as error:
        return False

    finally:
        if connection:
            return_db_connection(connection)
            # cursor.close()
            # connection.close()

@app.route('/users', methods=['POST'])
def add_user():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        user_data = request.json

        firstname = user_data.get('firstname')
        lastname = user_data.get('lastname')
        emailID = user_data.get('emailID')
        emailID = emailID.lower()
        password = user_data.get('password')
        stars = user_data.get('stars')
        access_code = user_data.get('accesscode')

        if access_code:
            is_access_code_valid = check_access_code(access_code.lower())

        if not firstname or not lastname or not emailID or not password or not access_code or not access_code:
            return jsonify({"error": "Missing required fields"}), 400
        
        if not is_access_code_valid:
            return jsonify({"error": "Invalid Access code"}), 401
        
        hashed_password = generate_password_hash(password)

        insert_query = """
        INSERT INTO Users (firstname, lastname, emailID, password, stars)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING userId, created_at;
        """

        cursor.execute(insert_query, (firstname, lastname, emailID, hashed_password, stars))
        user_id = 0
        user_id = cursor.fetchone()[0]

        access_token = create_access_token(identity=user_id, expires_delta=timedelta(days=7))
        refresh_token = create_access_token(identity=user_id, expires_delta=timedelta(days=30))
        connection.commit()

        threading.Thread(target=sign_up_journey_mailchimp, args=(emailID, firstname)).start()

        return jsonify({
                    "message": "User added successfully",
                    "userId": user_id,
                    "firstname": firstname,
                    "access_token": access_token,
                    "refresh_token": refresh_token
                }), 201

    except psycopg2.IntegrityError as e:
        return jsonify({"error": "User already exists."}), 400
    except Exception as error:
        return jsonify({"error": str(error)}), 500
    finally:
        if connection:
            return_db_connection(connection)
            # cursor.close()
            # connection.close()

@app.route('/users', methods=['GET'])
@jwt_required()
def get_all_users():
    """API endpoint to fetch all users"""
    current_user = get_jwt_identity()
    if current_user['role'] != 'admin':
        return jsonify({"error": "Unauthorized"}), 401
    try:
        with db_pool.connection() as connection:
            cursor = connection.cursor()
            query = "SELECT userId, firstname, emailID, stars, cohort FROM Users ORDER BY created_at DESC"
            cursor.execute(query)
            users = cursor.fetchall()

        userlist = []
        for user in users:
            userDict = {
                "userId": user[0],
                "firstname": user[1],
                "emailID": user[2],
                "stars": user[3],
                "cohort": user[4],
            }
            userlist.append(userDict)
        
        return jsonify({"users": userlist})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/user/<int:userId>", methods=["GET"])
def get_user_details(userId):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        get_user_query = """
        SELECT firstname, lastname, emailID, stars FROM Users WHERE userId = %s;
        """
        cursor.execute(get_user_query, (userId,))
        user = cursor.fetchone()

        if user:
            user_dict = {
                "firstname": user[0],
                "lastname": user[1],
                "emailID": user[2],
                "stars": user[3],
            }
            return jsonify(user_dict)

    except Exception as error:
        return jsonify({"error": str(error)}), 500

    finally:
        if connection:
            return_db_connection(connection)
            # cursor.close()
            # connection.close()


@app.route("/users/stats", methods=["GET"])
def get_user_stats():
    try:
        with db_pool.connection() as connection:
            cursor = connection.cursor()

            query_initial = """
                SELECT COUNT(*) FROM Users
                WHERE created_at < CURRENT_DATE - INTERVAL '50 days'
            """
            cursor.execute(query_initial)
            initial_count = cursor.fetchone()[0]

            query_daily = """
                SELECT DATE(created_at) as date, COUNT(*) as count
                FROM Users
                WHERE created_at >= CURRENT_DATE - INTERVAL '50 days'
                GROUP BY DATE(created_at)
                ORDER BY DATE(created_at)
            """
            cursor.execute(query_daily)
            daily_counts = cursor.fetchall()

            counts_by_date = {row[0]: row[1] for row in daily_counts}

            from datetime import date, timedelta

            today = date.today()
            dates = [today - timedelta(days=i) for i in range(50, -1, -1)]

            data = []
            cumulative_count = initial_count

            for d in dates:
                count_today = counts_by_date.get(d, 0)
                cumulative_count += count_today
                data.append(
                    {"date": d.strftime("%Y-%m-%d"), "total_users": cumulative_count}
                )

            goal_count = 1000

        return jsonify({"data": data, "goal_count": goal_count})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/users/<int:user_id>/stars", methods=["PUT"])
@jwt_required()
def update_user_stars(user_id):
    current_user = get_jwt_identity()
    if current_user["role"] != "admin":
        return jsonify({"error": "Unauthorized"}), 401
    try:
        with db_pool.connection() as connection:
            cursor = connection.cursor()
            data = request.json
            new_stars = data.get("stars")
            if new_stars is None:
                return jsonify({"error": "Stars value is required"}), 400
            update_query = "UPDATE Users SET stars = %s WHERE userId = %s"
            cursor.execute(update_query, (new_stars, user_id))
            connection.commit()

        return jsonify(
            {"success": True, "message": f"Stars updated for user {user_id}"}
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/top-users", methods=["GET"])
def top_users():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        query = """
        SELECT userId, firstname, stars 
        FROM Users 
        ORDER BY stars DESC 
        LIMIT 10;
        """

        cursor.execute(
            query,
        )
        users = cursor.fetchall()

        userlist = []
        for user in users:
            userDict = {"userId": user[0], "firstname": user[1], "stars": user[2]}
            userlist.append(userDict)

        return jsonify(userlist)

    except Exception as e:
        print(f"Database error: {e}")
        return []
    finally:
        if connection:
            return_db_connection(connection)


@app.route("/login", methods=["POST"])
def login():
    with db_pool.connection() as connection:
        try:
            user_data = request.json
            emailID = user_data.get("emailID")
            emailID = emailID.lower()
            password = user_data.get("password")

            if not emailID or not password:
                return jsonify({"error": "Missing email or password"}), 400

            connection = get_db_connection()
            cursor = connection.cursor()

            cursor.execute(
                "SELECT userId, password, firstname FROM Users WHERE emailID = %s;",
                (emailID,),
            )
            user = cursor.fetchone()

            if user:
                user_id, hashed_password, firstname = user

                if check_password_hash(hashed_password, password):
                    access_token = create_access_token(
                        identity=str(user_id), expires_delta=timedelta(days=7)
                    )

                    refresh_token = create_access_token(
                        identity=str(user_id), expires_delta=timedelta(days=30)
                    )

                    return jsonify(
                        {
                            "message": "Login successful",
                            "userId": user_id,
                            "firstname": firstname,
                            "access_token": access_token,
                            "refresh_token": refresh_token,
                        }
                    ), 200
                else:
                    return jsonify({"error": "Invalid email or password"}), 400
            else:
                return jsonify({"error": "Invalid email or password"}), 400
        except Exception as error:
            return jsonify({"error": str(error)}), 500


@app.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    try:
        current_user = get_jwt_identity()
        new_access_token = create_access_token(
            identity=current_user, expires_delta=timedelta(days=7)
        )
        return jsonify({"access_token": new_access_token}), 200
    except Exception as error:
        return jsonify({"error": str(error)}), 500


@app.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    try:
        current_user = get_jwt_identity()
        return jsonify({"user_id": current_user}), 200
    except Exception as error:
        return jsonify({"error": str(error)}), 500


def addActivityToUserActivitiesTable(user_id, activityId):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        update_user_activities_details_query = """
        INSERT INTO user_activities (userId, activityId) VALUES (%s, %s);
        """
        cursor.execute(update_user_activities_details_query, (user_id, activityId))
        connection.commit()

    except Exception as error:
        return jsonify({"error": str(error)}), 500

    finally:
        if connection:
            return_db_connection(connection)


def assignActivitiesToUser(user_id, activitychoices):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        get_activities_details_query = """
        SELECT activityId, tags FROM activities;
        """
        cursor.execute(get_activities_details_query)
        activities = cursor.fetchall()
        activity_list = []
        for activity in activities:
            # print((set(activity[1]) - set(activitychoices)))
            if set(activity[1]) & set(activitychoices):
                addActivityToUserActivitiesTable(user_id, activity[0])
        return True

    except Exception as error:
        return jsonify({"error": str(error)}), 500

    finally:
        if connection:
            return_db_connection(connection)


@app.route("/universities", methods=["GET"])
def get_universities():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        get_universities_query = "SELECT universityId, name FROM universities;"  # Assuming you have university_id and name columns
        cursor.execute(get_universities_query)

        universities = cursor.fetchall()

        university_list = []

        for university in universities:
            university_dict = {
                "universityId": university[0],
                "name": university[1],
            }
            university_list.append(university_dict)

        if universities:
            return jsonify(university_list), 200
        else:
            return jsonify({"message": "No universities found"}), 404

    except Exception as error:
        # Return error message in case of any exception
        return jsonify({"error": str(error)}), 500

    finally:
        # Close the database connection
        if connection:
            return_db_connection(connection)


@app.route("/onboarding", methods=["POST"])
def onboarding():
    try:
        user_data = request.json
        userId = user_data.get("userId")
        describeMe = user_data.get("describeMe")
        currentSituation = user_data.get("currentSituation")
        goal = user_data.get("goal")
        choice = user_data.get("choice")
        summary = user_data.get("summary")
        degree = user_data.get("degree")
        major = user_data.get("major")
        universityId = int(user_data.get("universityId"))
        activitychoices = user_data.get("activityChoices")

        if not userId or not describeMe or not currentSituation or not goal:
            return jsonify({"error": "Missing data"}), 400

        connection = get_db_connection()
        cursor = connection.cursor()

        insert_query = """
        INSERT INTO user_personalization (userId, describeMe, currentSituation, goal, onboarded, choice, summary, degree, major, universityId, activitychoices)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING userId;
        """

        cursor.execute(
            insert_query,
            (
                userId,
                describeMe,
                currentSituation,
                goal,
                True,
                choice,
                summary,
                degree,
                major,
                universityId,
                activitychoices,
            ),
        )
        user_id = 0
        user_id = cursor.fetchone()[0]

        connection.commit()

        assign_activities_successful = assignActivitiesToUser(user_id, activitychoices)
        if assign_activities_successful:
            return jsonify(
                {
                    "message": "Data added successful",
                    "userId": user_id,
                    "onboarded": True,
                }
            ), 200
        else:
            return jsonify({"error": "Issue with data insertion"}), 400
    except Exception as error:
        return jsonify({"error": str(error)}), 500
    finally:
        if connection:
            return_db_connection(connection)
            # cursor.close()
            # connection.close()


@app.route("/onboarding/<int:userId>", methods=["GET"])
def get_user_onboarding_details(userId):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        get_user_onboarding_details_query = """
        SELECT describeMe, currentSituation, choice, onboarded, goal, summary, degree, major FROM user_personalization WHERE userId = %s;
        """
        cursor.execute(get_user_onboarding_details_query, (userId,))
        user = cursor.fetchone()

        if user:
            user_dict = {
                "describeMe": user[0],
                "currentSituation": user[1],
                "choice": user[2],
                "onboarded": user[3],
                "userId": userId,
                "goal": user[4],
                "summary": user[5],
                "degree": user[6],
                "major": user[7],
            }
            return jsonify(user_dict)
        else:
            return jsonify({"error": "User has not onboarded yet"}), 404

    except Exception as error:
        return jsonify({"error": str(error)}), 500

    finally:
        if connection:
            return_db_connection(connection)
            # cursor.close()
            # connection.close()


@app.route("/update_onboarding/<int:userId>", methods=["PUT"])
def update_user_onboarding_details(userId):
    try:
        data = request.get_json()
        current_situation = data.get("currentSituation")
        goal = data.get("goal")

        if not current_situation or not goal:
            return jsonify(
                {"error": "Both 'currentSituation' and 'goal' fields are required"}
            ), 400

        connection = get_db_connection()
        cursor = connection.cursor()

        update_user_onboarding_query = """
        UPDATE user_personalization
        SET currentSituation = %s, goal = %s
        WHERE userId = %s;
        """
        cursor.execute(update_user_onboarding_query, (current_situation, goal, userId))

        connection.commit()

        if cursor.rowcount > 0:
            return jsonify(
                {"message": "User onboarding details updated successfully"}
            ), 200
        else:
            return jsonify({"error": "User not found or no changes made"}), 404

    except Exception as error:
        return jsonify({"error": str(error)}), 500

    finally:
        if connection:
            return_db_connection(connection)
            # cursor.close()
            # connection.close()


@app.route("/profile_picture/<int:userId>", methods=["GET"])
def get_profile_picture(userId):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        get_user_profilepicture_query = """
        SELECT profilepicture FROM user_personalization WHERE userId = %s;
        """
        cursor.execute(get_user_profilepicture_query, (userId,))
        profilepicture = cursor.fetchone()[0]
        print(profilepicture)
        if profilepicture:
            data = {"profilepicture": profilepicture}
            return jsonify(data)

        return jsonify({"error": "User not found"}), 404

    except Exception as error:
        return jsonify({"error": str(error)}), 500

    finally:
        if connection:
            return_db_connection(connection)


@app.route("/profile_picture/<int:userId>", methods=["PUT"])
def update_profile_picture(userId):
    try:
        print("COmes here", userId)
        data = request.get_json()
        print(data)
        profilepicture = data.get("profilepicture")
        print(profilepicture)

        if not profilepicture:
            return jsonify({"error": "Profile picture is required"}), 400

        connection = get_db_connection()
        cursor = connection.cursor()

        update_profilepicture_query = """
        UPDATE user_personalization
        SET profilepicture = %s
        WHERE userId = %s;
        """
        cursor.execute(
            update_profilepicture_query,
            (
                profilepicture,
                userId,
            ),
        )

        connection.commit()

        if cursor.rowcount > 0:
            return jsonify(
                {"message": "User profile picture details updated successfully"}
            ), 200
        else:
            return jsonify({"error": "User not found or no changes made"}), 404

    except Exception as error:
        return jsonify({"error": str(error)}), 500

    finally:
        if connection:
            return_db_connection(connection)
            # cursor.close()
            # connection.close()


@app.route("/interviewschedule/<int:userId>", methods=["PUT"])
def update_interviewschedule(userId):
    try:
        data = request.get_json()
        interviewSchedule = data.get("interviewSchedule")
        newInterviewSchedule = data.get("newInterviewSchedule")
        firstname = data.get("firstname")
        emailID = data.get("emailID")

        interview_date = datetime.strptime(
            newInterviewSchedule.get("date"), "%Y-%m-%dT%H:%M:%S.%fZ"
        ).strftime("%m/%d/%y")

        if interviewSchedule:
            interviewSchedule_json = json.dumps(interviewSchedule)
        else:
            return jsonify({"error": "Interview Schedule details not available"}), 400

        connection = get_db_connection()
        cursor = connection.cursor()

        update_user_interviewschedule_query = """
        UPDATE user_personalization
        SET interviewSchedule = %s
        WHERE userId = %s;
        """
        cursor.execute(
            update_user_interviewschedule_query, (interviewSchedule_json, userId)
        )

        connection.commit()

        add_contact_to_mailchimp(
            mailchimp_audience_id, emailID, firstname, interview_date
        )

        if cursor.rowcount > 0:
            return jsonify(
                {"message": "User interview schedule updated successfully"}
            ), 200
        else:
            return jsonify({"error": "User not found or no changes made"}), 404

    except Exception as error:
        return jsonify({"error": str(error)}), 500

    finally:
        if connection:
            return_db_connection(connection)
            # cursor.close()
            # connection.close()


@app.route("/interviewschedule/<int:userId>", methods=["GET"])
def get_interviewschedule(userId):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        get_user_interviewschedule_query = """
        SELECT interviewSchedule FROM user_personalization
        WHERE userId = %s;
        """
        cursor.execute(get_user_interviewschedule_query, (userId,))
        interviewSchedule = cursor.fetchone()[0]
        if interviewSchedule:
            data = {"interviewSchedule": interviewSchedule}
            return jsonify(data)

        return jsonify({"error": "User not found or no changes made"}), 404

    except Exception as error:
        return jsonify({"error": str(error)}), 500

    finally:
        if connection:
            return_db_connection(connection)
            # cursor.close()
            # connection.close()


@app.route("/update_profile/<int:userId>", methods=["PUT"])
def update_user_profile_details(userId):
    try:
        data = request.get_json()
        summary = data.get("summary")

        if not summary:
            return jsonify({"error": "Summary field is required"}), 400

        connection = get_db_connection()
        cursor = connection.cursor()

        update_user_onboarding_query = """
        UPDATE user_personalization
        SET summary = %s
        WHERE userId = %s;
        """
        cursor.execute(update_user_onboarding_query, (summary, userId))

        connection.commit()

        if cursor.rowcount > 0:
            return jsonify(
                {"message": "User profile details updated successfully"}
            ), 200
        else:
            return jsonify({"error": "User not found or no changes made"}), 404

    except Exception as error:
        return jsonify({"error": str(error)}), 500

    finally:
        if connection:
            return_db_connection(connection)
            # cursor.close()
            # connection.close()


# Below is the archieved version of fetching user events details
# @app.route('/events/<int:userId>', methods=['GET'])
# def get_user_activities_details(userId):
#     try:
#         connection = get_db_connection()
#         cursor = connection.cursor()
#         get_user_activities_details_query = """
#         SELECT a.imageURL, a.videoURL, a.title, a.description, a.tags, a.star, a.activityId, a.eventURL, a.eventDate, a.detailedDescription, u.completed FROM user_activities u JOIN activities a ON a.activityId = u.activityId WHERE u.userId = %s;
#         """
#         cursor.execute(get_user_activities_details_query, (userId,))
#         activities = cursor.fetchall()
#         activity_list = []
#         for activity in activities:
#             activity_dict = {
#                 "imageURL": activity[0],
#                 "videoURL": activity[1],
#                 "title": activity[2],
#                 "description": activity[3],
#                 "tags": activity[4],
#                 "star": activity[5],
#                 "activityId": activity[6],
#                 "eventURL": activity[7],
#                 "eventDate": activity[8],
#                 "detailedDescription": activity[9],
#                 "completed": activity[10],
#             }
#             activity_list.append(activity_dict)
#         return jsonify(activity_list)

#     except Exception as error:
#         return jsonify({"error": str(error)}), 500

#     finally:
#         if connection:
#             return_db_connection(connection)
# cursor.close()
# connection.close()

# Below is the archieved version of get all activities/events details
# @app.route('/events', methods=['GET'])
# @jwt_required()
# def get_all_activities_details():
#     current_user = get_jwt_identity()
#     if current_user['role'] != 'admin':
#         return jsonify({"error": "Unauthorized"}), 401
#     try:
#         connection = get_db_connection()
#         cursor = connection.cursor()
#         get_user_activities_details_query = """
#         SELECT imageURL, title, description, tags, star, activityId, videoURL, eventURL, eventDate, detailedDescription FROM activities;
#         """
#         cursor.execute(get_user_activities_details_query)
#         activities = cursor.fetchall()
#         activity_list = []
#         for activity in activities:
#             activity_dict = {
#                 "imageURL": activity[0],
#                 "title": activity[1],
#                 "description": activity[2],
#                 "tags": activity[3],
#                 "star": activity[4],
#                 "activityId": activity[5],
#                 "videoURL": activity[6],
#                 "eventURL": activity[7],
#                 "eventDate": activity[8],
#                 "detailedDescription": activity[9]
#             }
#             activity_list.append(activity_dict)
#         return jsonify(activity_list)

#     except Exception as error:
#         return jsonify({"error": str(error)}), 500

#     finally:
#         if connection:
#             return_db_connection(connection)
# cursor.close()
# connection.close()


@app.route("/events", methods=["GET"])
def get_all_events_details_new():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        get_user_activities_details_query = """
        SELECT imageURL, title, description, tags, star, activityId, videoURL, eventURL, eventDate, detailedDescription FROM activities WHERE eventDate >= CURRENT_DATE ORDER BY eventdate;
        """
        cursor.execute(get_user_activities_details_query)
        activities = cursor.fetchall()
        activity_list = []
        for activity in activities:
            activity_dict = {
                "imageURL": activity[0],
                "title": activity[1],
                "description": activity[2],
                "tags": activity[3],
                "star": activity[4],
                "activityId": activity[5],
                "videoURL": activity[6],
                "eventURL": activity[7],
                "eventDate": activity[8],
                "detailedDescription": activity[9],
            }
            activity_list.append(activity_dict)
        return jsonify(activity_list)

    except Exception as error:
        return jsonify({"error": str(error)}), 500

    finally:
        if connection:
            return_db_connection(connection)
            # cursor.close()
            # connection.close()


@app.route("/events", methods=["POST"])
@jwt_required()
def add_new_activities():
    current_user = get_jwt_identity()
    if current_user["role"] != "admin":
        return jsonify({"error": "Unauthorized"}), 401
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        data = request.json
        title = data.get("title")
        description = data.get("description")
        detailedDescription = data.get("detailedDescription")
        tags = data.get("tags")
        star = data.get("star")
        imageURL = data.get("imageURL")
        videoURL = data.get("videoURL")
        eventURL = data.get("eventURL")
        eventDate = data.get("eventDate")

        print(title, description, tags, star)

        add_new_activities_query = """
        INSERT INTO activities (imageURL, title, description, tags, star, videoURL, eventURL, eventDate, detailedDescription)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING activityId;
        """

        cursor.execute(
            add_new_activities_query,
            (
                imageURL,
                title,
                description,
                tags,
                star,
                videoURL,
                eventURL,
                eventDate,
                detailedDescription,
            ),
        )
        activity_id = cursor.fetchone()[0]
        connection.commit()

        added_activity = {
            "activityId": activity_id,
            "title": title,
            "description": description,
            "tags": tags,
            "star": star,
            "videoURL": videoURL,
            "eventURL": eventURL,
            "eventDate": eventDate,
            "detailedDescription": detailedDescription,
        }

        return jsonify(
            {"message": "Activity added successfully", "activity": added_activity}
        ), 201

    except Exception as error:
        return jsonify({"error": str(error)}), 500

    finally:
        if connection:
            return_db_connection(connection)
            # cursor.close()
            # connection.close()


@app.route("/events/<int:userId>", methods=["GET"])
def event_get_all(userId):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        get_events_query = """
        SELECT activityId FROM user_activities
        WHERE userId = %s AND completed = True;
        """

        cursor.execute(get_events_query, (userId,))
        events = cursor.fetchall()

        event_dict = {event[0]: True for event in events}

        if event_dict:
            return jsonify(event_dict)
        else:
            return jsonify({"message": "No completed events found"}), 200
    except Exception as error:
        return jsonify({"error": str(error)}), 500
    finally:
        if connection:
            return_db_connection(connection)
            # cursor.close()
            # connection.close()


@app.route("/upload-image", methods=["POST"])
def upload_image():
    user_id = request.form.get("userId")
    activity_id = request.form.get("activityId")
    file = request.files["file"]

    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    try:
        filename = f"{user_id}/{activity_id}/{file.filename}"
        s3.upload_fileobj(
            file, S3_BUCKET, filename, ExtraArgs={"ContentType": file.content_type}
        )

        file_url = f"https://{S3_BUCKET}.s3.{S3_REGION}.amazonaws.com/{filename}"

        return jsonify(
            {"message": "Image uploaded successfully", "imageURL": file_url}
        ), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/roadmapactivity/<int:userid>", methods=["GET"])
def roadmapactivityget_all(userid):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        get_roadmapactivity_query = """
        SELECT roadmapactivityid, completed FROM user_roadmap_activities
        WHERE userid = %s;
        """

        cursor.execute(get_roadmapactivity_query, (userid,))
        roadmap_activities = cursor.fetchall()

        activity_dict = {activity[0]: activity[1] for activity in roadmap_activities}

        if roadmap_activities:
            return jsonify(activity_dict)
        else:
            return jsonify({"error": str(error)}), 404
    except Exception as error:
        return jsonify({"error": str(error)}), 500
    finally:
        if connection:
            return_db_connection(connection)
            # cursor.close()
            # connection.close()


@app.route("/roadmapactivity/<int:userid>/<int:roadmapactivityid>", methods=["GET"])
def roadmapactivityget(userid, roadmapactivityid):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        get_roadmapactivity_query = """
        SELECT answer, completed FROM user_roadmap_activities
        WHERE userid = %s AND roadmapactivityid = %s;
        """

        cursor.execute(get_roadmapactivity_query, (userid, roadmapactivityid))
        answer = cursor.fetchone()

        if answer:
            return jsonify(answer)
        else:
            return jsonify({"error": "Not found"}), 404
    except Exception as error:
        return jsonify({"error": str(error)}), 500
    finally:
        if connection:
            return_db_connection(connection)
            # cursor.close()
            # connection.close()


@app.route("/roadmapactivity/<int:userid>/<int:roadmapactivityid>", methods=["POST"])
def roadmapactivitypost(userid, roadmapactivityid):
    try:
        activity_data = request.json
        answer = activity_data.get("answers")
        completed = activity_data.get("completed")
        stars = activity_data.get("stars")

        if answer:
            answer_json = json.dumps(answer)
        else:
            answer_json = None

        connection = get_db_connection()
        cursor = connection.cursor()

        check_query = """
        SELECT userid, completed FROM user_roadmap_activities
        WHERE userid = %s AND roadmapactivityid = %s;
        """

        cursor.execute(
            check_query,
            (
                userid,
                roadmapactivityid,
            ),
        )
        record = cursor.fetchone()

        print(f"Check existing record: {record}")

        if record:
            record_exists = record[0]
            previously_completed = record[1]
        else:
            record_exists = previously_completed = False

        if not previously_completed and completed:
            update_user_star_query = """
            UPDATE Users
            SET stars = stars + %s
            WHERE userid=%s
            """
            cursor.execute(update_user_star_query, (stars, userid))
            connection.commit()

        if record_exists:
            update_query = """
            UPDATE user_roadmap_activities SET answer = %s, completed = %s
            WHERE userid = %s AND roadmapactivityid = %s;
            """

            cursor.execute(
                update_query,
                (
                    answer_json,
                    completed,
                    userid,
                    roadmapactivityid,
                ),
            )
            connection.commit()

            return jsonify(
                {
                    "message": "Data update successful",
                    "userid": userid,
                    "roadmapactivityid": roadmapactivityid,
                }
            ), 200
        else:
            insert_query = """
            INSERT INTO user_roadmap_activities (userid, roadmapactivityid, completed, answer)
            VALUES (%s, %s, %s, %s);
            """

            cursor.execute(
                insert_query,
                (
                    userid,
                    roadmapactivityid,
                    completed,
                    answer_json,
                ),
            )

            connection.commit()

            return jsonify(
                {
                    "message": "Data added successful",
                    "userid": userid,
                    "roadmapactivityid": roadmapactivityid,
                }
            ), 200
    except Exception as error:
        return jsonify({"error": str(error)}), 500
    finally:
        if connection:
            return_db_connection(connection)
            # cursor.close()
            # connection.close()


@app.route("/roadmapactivity", methods=["GET"])
@jwt_required()
def roadmapactivitiesget():
    current_user = get_jwt_identity()
    if current_user["role"] != "admin":
        return jsonify({"error": "Unauthorized"}), 401
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        get_roadmapactivity_query = """
        SELECT COUNT(*), roadmapactivityid FROM user_roadmap_Activities GROUP BY roadmapactivityid;
        """

        cursor.execute(
            get_roadmapactivity_query,
        )
        activities = cursor.fetchall()

        activityList = []
        for activity in activities:
            activityDict = {"count": activity[0], "activityId": activity[1]}
            activityList.append(activityDict)
        if activities:
            return jsonify(activityList)
        else:
            return jsonify({"error": str(error)}), 404
    except Exception as error:
        return jsonify({"error": str(error)}), 500
    finally:
        if connection:
            return_db_connection(connection)
            # cursor.close()
            # connection.close()


@app.route("/generate-ai-feedback", methods=["POST"])
def generate_ai_feedback():
    try:
        data = request.json
        prompt = data.get("prompt")

        brearerToken = "Bearer " + openrouter_api_key

        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": brearerToken,
                "Content-Type": "application/json",
            },
            json={
                "model": "meta-llama/llama-3.3-8b-instruct:free",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.5,
                "top_p": 1,
            },
        )

        if not response.ok:
            return jsonify(
                {
                    "error": f"OpenRouter error: {response.status_code}",
                    "details": response.text,
                }
            ), 500

        response_json = response.json()

        if "choices" not in response_json:
            return jsonify(
                {"error": "'choices' not found", "full_response": response_json}
            ), 500

        return jsonify({"feedback": response_json["choices"][0]["message"]["content"]})

    except Exception as error:
        return jsonify({"error": str(error)}), 500


@app.route("/resumefeedback", methods=["POST"])
def upload_resume():
    try:
        if "resume" not in request.files:
            return jsonify({"error": "No file provided"}), 400

        file = request.files["resume"]

        if file.filename == "":
            return jsonify({"error": "No file selected"}), 400

        file_data = file.read()

        prompt = """Please analyze this resume and provide detailed feedback on each section of the resume:
            1. Summary
            2. Education
            3. Experience
            4. Projects
            5. Skills
            6. Areas for improvement
            Please be specific and provide actionable suggestions. Focus on actionable suggestions, not on strength."""

        try:
            pdf = {
                "inlineData": {
                    "data": base64.b64encode(file_data).decode("utf-8"),
                    "mimeType": "application/pdf",
                }
            }
        except Exception as encoding_error:
            return jsonify({"error": "Failed to encode PDF"}), 500

        try:
            result = client.models.generate_content(
                model="gemini-2.0-flash", contents=[pdf, prompt]
            )

        except Exception as model_error:
            return jsonify({"error": "Failed to generate content"}), 500

        feedback = result.text if result.text else "No feedback"

        return jsonify({"feedback": feedback})

    except Exception as e:
        return jsonify({"error": "Failed to process resume"}), 500


def extract_text_from_pdf_bytes(pdf_bytes: bytes) -> str:
    if not PdfReader:
        return ""
    try:
        import io

        reader = PdfReader(io.BytesIO(pdf_bytes))
        texts: List[str] = []
        for page in getattr(reader, "pages", []):
            try:
                texts.append(page.extract_text() or "")
            except Exception:
                continue
        return "\n\n".join([t for t in texts if t])
    except Exception:
        return ""


def build_ai_prompt_from_report_text(report_text: str) -> str:
    # Prompt aligned to required DB columns
    prompt = (
        "You are an expert internship program analyst. Analyze the following weekly report text and return STRICT JSON with these exact top-level fields: \n"
        "top_technologies_used (array of objects with name and optional count), \n"
        "sentiment_risk_management (object with overall_sentiment and risk_flags array), \n"
        "performance_metrics (object with any useful numeric KPIs you infer), \n"
        "action_items (array of actionable bullet strings), \n"
        "overall_summary (concise paragraph).\n\n"
        "Return ONLY valid minified JSON with those keys.\n\n"
        "Report Text:\n" + report_text[:100000]
    )
    return prompt


def call_bedrock_claude(prompt: str) -> Dict[str, Any]:
    # Anthropics Claude 3 schema
    body = json.dumps(
        {
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 2048,
            "temperature": 0.2,
            "messages": [
                {"role": "user", "content": [{"type": "text", "text": prompt}]}
            ],
        }
    )
    resp = bedrock.invoke_model(modelId=bedrock_model_id, body=body)
    payload = json.loads(resp.get("body").read())
    # Extract text from the first content block
    text = ""
    for block in payload.get("content", []):
        if isinstance(block, dict) and block.get("type") == "text":
            text += block.get("text", "")
    if not text and isinstance(payload.get("output_text"), str):
        text = payload.get("output_text")
    # Parse JSON from text
    try:
        return json.loads(text)
    except Exception:
        # try to locate JSON block
        import re

        m = re.search(r"\{[\s\S]*\}$", text.strip())
        if m:
            try:
                return json.loads(m.group(0))
            except Exception:
                return {"raw": text}
        return {"raw": text}


def list_pdfs(prefix: str, max_files: int = 50) -> List[str]:
    paginator = s3.get_paginator("list_objects_v2")
    keys: List[str] = []
    for page in paginator.paginate(Bucket=bucket, Prefix=prefix):
        for obj in page.get("Contents", []):
            key = obj["Key"]
            if key.lower().endswith(".pdf"):
                keys.append(key)
                if len(keys) >= max_files:
                    return keys
    return keys


@app.route("/admin/ai/process-reports", methods=["POST"])
def process_reports_with_bedrock():
    try:
        payload = request.get_json(force=True) or {}
        prefix = payload.get("prefix") or "users/321/"
        max_files = int(payload.get("max_files") or 20)
        prompt_version = payload.get("prompt_version") or "v1"

        connection = get_db_connection()
        cursor = connection.cursor()

        keys = list_pdfs(prefix, max_files=max_files)
        results = []
        for key in keys:
            try:
                obj = s3.get_object(Bucket=bucket, Key=key)
                pdf_bytes = obj["Body"].read()
                text = extract_text_from_pdf_bytes(pdf_bytes)
                if not text:
                    continue
                prompt = build_ai_prompt_from_report_text(text)
                ai_output = call_bedrock_claude(prompt)
                # Best-effort to map user/report id from key
                user_id = None
                report_id = None
                import re

                m = re.search(r"/(\d+)/appdata/", key)
                if m:
                    try:
                        user_id = int(m.group(1))
                    except Exception:
                        user_id = None
                m2 = re.search(r"_id(\d+)\.pdf$", key)
                if m2:
                    try:
                        report_id = int(m2.group(1))
                    except Exception:
                        report_id = None

                top_tech = ai_output.get("top_technologies_used")
                sent_risk = ai_output.get("sentiment_risk_management")
                perf = ai_output.get("performance_metrics")
                actions = ai_output.get("action_items")
                overall = (
                    ai_output.get("overall_summary")
                    or ai_output.get("summary")
                    or ai_output.get("highlights_summary")
                    or json.dumps(ai_output)
                )

                cursor.execute(
                    """
                    INSERT INTO report_ai_summaries (
                        user_id, report_id, s3_key, model_id, prompt_version,
                        top_technologies_used, sentiment_risk_management, performance_metrics, action_items, overall_summary
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING id, created_time;
                    """,
                    (
                        user_id,
                        report_id,
                        key,
                        bedrock_model_id,
                        prompt_version,
                        json.dumps(top_tech)
                        if top_tech is not None
                        else json.dumps([]),
                        json.dumps(sent_risk)
                        if sent_risk is not None
                        else json.dumps({}),
                        json.dumps(perf) if perf is not None else json.dumps({}),
                        json.dumps(actions) if actions is not None else json.dumps([]),
                        overall,
                    ),
                )
                row = cursor.fetchone()
                connection.commit()
                results.append(
                    {
                        "id": row[0],
                        "created_time": row[1],
                        "user_id": user_id,
                        "report_id": report_id,
                        "s3_key": key,
                        "output": ai_output,
                    }
                )
            except Exception as inner_err:
                results.append({"s3_key": key, "error": str(inner_err)})

        return jsonify({"processed": len(results), "results": results}), 200
    except Exception as error:
        return jsonify({"error": str(error)}), 500
    finally:
        try:
            if connection:
                return_db_connection(connection)
        except Exception:
            pass


@app.route("/events/<int:activityId>", methods=["PUT"])
def update_activity(activityId):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        data = request.json
        title = data.get("title")
        description = data.get("description")
        detailedDescription = data.get("detailedDescription")
        tags = data.get("tags")
        star = data.get("star")
        imageURL = data.get("imageURL")
        videoURL = data.get("videoURL")
        eventURL = data.get("eventURL")
        eventDate = data.get("eventDate")
        detailedDescription = data.get("detailedDescription")

        update_activity_query = """
        UPDATE activities 
        SET title = %s, description = %s, tags = %s, star = %s, imageURL = %s, videoURL = %s, eventURL = %s, eventDate = %s, detailedDescription = %s
        WHERE activityId = %s;
        """
        cursor.execute(
            update_activity_query,
            (
                title,
                description,
                tags,
                star,
                imageURL,
                videoURL,
                eventURL,
                eventDate,
                detailedDescription,
                activityId,
            ),
        )
        connection.commit()

        return jsonify({"message": "Activity updated successfully"}), 200

    except Exception as error:
        return jsonify({"error": str(error)}), 500

    finally:
        if connection:
            return_db_connection(connection)


from flask_mail import Message


@app.route("/send-report-email", methods=["POST"])
def send_report_email():
    try:
        data = request.json
        manager_email = data.get("managerEmail")
        manager_name = data.get("managerName")
        student_name = data.get("studentName")
        report_date = data.get("reportDate")
        pdf_content = data.get("pdfContent")
        report_preview = data.get("reportPreview")
        user_id = data.get("userId")
        user_answers = data.get("userAnswers")

        # Save to database
        connection = get_db_connection()
        cursor = connection.cursor()
        insert_query = """
        INSERT INTO reports (user_id, student_name, manager_name, manager_email, answers, report_date)
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING id;
        """
        cursor.execute(
            insert_query,
            (
                user_id,
                student_name,
                manager_name,
                manager_email,
                json.dumps(user_answers),  # Save as JSON
                report_date,
            ),
        )
        report_id = cursor.fetchone()[0]
        connection.commit()
        if connection:
            return_db_connection(connection)

        msg = Message(
            subject=f"New Report for {student_name} from {manager_name}",
            recipients=[manager_email],
        )
        msg.body = f"Dear {manager_name},\n\nA new report has been submitted for {student_name} on {report_date}.\n\nPreview:\n(See HTML version below)\n\nBest regards,\nCareerStar Team"
        msg.html = f"""
            <p>Dear {manager_name},</p>
            <p>A new report has been submitted for <b>{student_name}</b> on <b>{report_date}</b>.</p>
            <p><b>Preview:</b></p>
            {report_preview}
            <br>
            <p>Best regards,<br>CareerStar Team</p>
        """
        if pdf_content:
            pdf_bytes = base64.b64decode(pdf_content)
            # Fetch cohort for the student
            connection2 = get_db_connection()
            cursor2 = connection2.cursor()
            cursor2.execute("SELECT cohort FROM Users WHERE userId = %s", (user_id,))
            cohort = cursor2.fetchone()[0] or "unknown"
            if connection2:
                return_db_connection(connection2)
            # Clean up the student name for the filename
            safe_name = "".join(
                c for c in student_name if c.isalnum() or c in (" ", "_", "-")
            ).rstrip()
            # Derive date components from report_date for folder structure
            try:
                parsed_dt = None
                if isinstance(report_date, str):
                    rd = report_date
                    # Handle ISO strings that end with 'Z'
                    if rd.endswith("Z"):
                        try:
                            parsed_dt = datetime.fromisoformat(
                                rd.replace("Z", "+00:00")
                            )
                        except Exception:
                            parsed_dt = None
                    if parsed_dt is None:
                        for fmt in (
                            "%Y-%m-%d",
                            "%m/%d/%Y",
                            "%Y/%m/%d",
                            "%Y-%m-%dT%H:%M:%S.%f%z",
                            "%Y-%m-%dT%H:%M:%S.%f",
                            "%Y-%m-%dT%H:%M:%S",
                            "%Y-%m-%d %H:%M:%S",
                        ):
                            try:
                                parsed_dt = datetime.strptime(rd, fmt)
                                break
                            except Exception:
                                continue
                if parsed_dt is None:
                    parsed_dt = datetime.utcnow()
                year_str = parsed_dt.strftime("%Y")
                month_str = parsed_dt.strftime("%m")
                day_str = parsed_dt.strftime("%d")
            except Exception:
                # Fallback to current UTC date if parsing fails
                year_str = datetime.utcnow().strftime("%Y")
                month_str = datetime.utcnow().strftime("%m")
                day_str = datetime.utcnow().strftime("%d")

            # Save PDF to S3
            s3_key_pdf = (
                f"users/"
                f"{user_id}/appdata/{year_str}/{month_str}/{day_str}/"
                f"{safe_name}_{report_date}_id{report_id}.pdf"
            )
            s3.put_object(
                Bucket=bucket,
                Key=s3_key_pdf,
                Body=pdf_bytes,
                ContentType="application/pdf",
                Metadata={"cohort": str(cohort)},
            )
            # Save JSON to S3 alongside PDF
            try:
                report_json = json.dumps(
                    {
                        "user_id": user_id,
                        "student_name": student_name,
                        "manager_name": manager_name,
                        "manager_email": manager_email,
                        "report_date": report_date,
                        "answers": user_answers,
                    },
                    ensure_ascii=False,
                ).encode("utf-8")
                s3_key_json = (
                    f"users/"
                    f"{user_id}/appdata/{year_str}/{month_str}/{day_str}/"
                    f"{safe_name}_{report_date}_id{report_id}.json"
                )
                s3.put_object(
                    Bucket=bucket,
                    Key=s3_key_json,
                    Body=report_json,
                    ContentType="application/json",
                    Metadata={"cohort": str(cohort)},
                )
            except Exception as s3_json_err:
                # Log JSON save issues but do not fail the endpoint
                logger.error(f"Failed to save report JSON to S3: {s3_json_err}")

            # Attach PDF to email
            msg.attach(
                filename=f"{student_name}_report_{report_date}.pdf",
                content_type="application/pdf",
                data=pdf_bytes,
            )
        mail.send(msg)
        return jsonify(
            {
                "message": "Report processed and saved successfully",
                "report_id": report_id,
            }
        ), 200
    except Exception as error:
        return jsonify({"error": str(error)}), 500


@app.route("/events/<int:activityId>", methods=["DELETE"])
@jwt_required()
def delete_activity(activityId):
    current_user = get_jwt_identity()
    if current_user["role"] != "admin":
        return jsonify({"error": "Unauthorized"}), 401
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        delete_activity_query = """
        DELETE FROM activities 
        WHERE activityId = %s;
        """
        cursor.execute(delete_activity_query, (activityId,))
        connection.commit()

        return jsonify({"message": "Activity deleted successfully"}), 200

    except Exception as error:
        return jsonify({"error": str(error)}), 500

    finally:
        if connection:
            return_db_connection(connection)


# Below is archeieved version of update user activities
# @app.route('/events/<int:userId>/<int:activityId>', methods=['PUT'])
# def update_user_activity(userId, activityId):
#     try:
#         connection = get_db_connection()
#         cursor = connection.cursor()

#         data = request.json
#         completed = data.get("completed")
#         stars = data.get('stars')

#         update_user_activity_query = """
#         UPDATE user_activities
#         SET completed = %s
#         WHERE userId=%s AND activityId = %s;
#         """
#         cursor.execute(update_user_activity_query, (completed, userId, activityId))
#         connection.commit()

#         update_user_star_query = """
#         UPDATE Users
#         SET stars = stars + %s
#         WHERE userId=%s
#         """
#         cursor.execute(update_user_star_query, (stars, userId))
#         connection.commit()

#         return jsonify({"message": "User activity table updated successfully"}), 200

#     except Exception as error:
#         return jsonify({"error": str(error)}), 500

#     finally:
#         if connection:
#             return_db_connection(connection)


@app.route("/events/<int:userId>/<int:activityId>", methods=["PUT"])
def update_user_activity(userId, activityId):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        data = request.json
        completed = data.get("completed")
        stars = data.get("stars")

        check_query = """
        SELECT 1 FROM user_activities WHERE userId = %s AND activityId = %s;
        """
        cursor.execute(check_query, (userId, activityId))
        existing_record = cursor.fetchone()

        if existing_record:
            update_user_activity_query = """
            UPDATE user_activities 
            SET completed = %s 
            WHERE userId=%s AND activityId = %s;
            """
            cursor.execute(update_user_activity_query, (completed, userId, activityId))
        else:
            insert_user_activity_query = """
            INSERT INTO user_activities (userId, activityId, completed)
            VALUES (%s, %s, %s);
            """
            cursor.execute(insert_user_activity_query, (userId, activityId, completed))

        update_user_star_query = """
        UPDATE Users
        SET stars = stars + %s
        WHERE userId=%s
        """
        cursor.execute(update_user_star_query, (stars, userId))

        connection.commit()

        return jsonify({"message": "User activity updated successfully"}), 200

    except Exception as error:
        return jsonify({"error": str(error)}), 500

    finally:
        if connection:
            return_db_connection(connection)


@app.route("/linkedin", methods=["GET"])
@jwt_required()
def get_users_linkedin_details():
    current_user = get_jwt_identity()
    if current_user["role"] != "admin":
        return jsonify({"error": "Unauthorized"}), 401
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        get_users_linkedin_details_query = """
        SELECT p.userId, p.LinkedIn, u.firstname, u.emailId FROM Users u JOIN user_personalization p ON u.userId = p.userId;
        """
        cursor.execute(get_users_linkedin_details_query, ())
        users = cursor.fetchall()
        user_linkedIn_list = []
        if users:
            for user in users:
                user_dict = {
                    "userId": user[0],
                    "LinkedIn": user[1],
                    "firstname": user[2],
                    "emailId": user[3],
                }
                user_linkedIn_list.append(user_dict)
            return jsonify(user_linkedIn_list)
        else:
            return jsonify({"error": "User has not onboarded yet"}), 404

    except Exception as error:
        return jsonify({"error": str(error)}), 500

    finally:
        if connection:
            return_db_connection(connection)
            # cursor.close()
            # connection.close()


@app.route("/linkedin/<int:userId>", methods=["PUT"])
@jwt_required()
def post_users_linkedin_details(userId):
    current_user = get_jwt_identity()
    if current_user["role"] != "admin":
        return jsonify({"error": "Unauthorized"}), 401
    try:
        data = request.json
        linkedInData = data.get("LinkedIn")
        linkedInData = json.dumps(linkedInData)
        connection = get_db_connection()
        cursor = connection.cursor()
        put_users_linkedin_details_query = """
        UPDATE user_personalization 
        SET LinkedIn = %s 
        WHERE userId = %s;
        """
        cursor.execute(
            put_users_linkedin_details_query,
            (
                linkedInData,
                userId,
            ),
        )
        connection.commit()
        return jsonify({"message": "Data update successful", "userId": userId}), 200
    except Exception as error:
        return jsonify({"error": str(error)}), 500

    finally:
        if connection:
            return_db_connection(connection)
            # cursor.close()
            # connection.close()


@app.route("/adminlogin", methods=["POST"])
def admin_login():
    username = request.json.get("username")
    password = request.json.get("password")
    if username == os.getenv("ADMIN_USERNAME") and password == os.getenv(
        "ADMIN_PASSWORD"
    ):
        access_token = create_access_token(
            identity={"username": username, "role": "admin"},
            expires_delta=timedelta(days=7),
        )
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401


@app.route("/verifyAdminToken", methods=["GET"])
@jwt_required()
def verifyAdminToken():
    try:
        current_user = get_jwt_identity()
        if current_user.get("role") != "admin":
            return jsonify({"error": "Unauthorized"}), 401

        return jsonify({"message": "Token is valid", "user": current_user}), 200

    except Exception as e:
        return jsonify({"error": "An error occurred", "details": str(e)}), 500


@app.route("/", methods=["GET"])
def home():
    return "Hello world"


@app.route("/admin/reports/users", methods=["GET"])
def get_report_users():
    with db_pool.connection() as connection:
        cursor = connection.cursor()
        query = """
            SELECT
                u.userid,
                u.firstname,
                r.report_date,
                r.created_time
                FROM users u
                JOIN LATERAL (
                SELECT report_date, created_time
                FROM reports
                WHERE user_id = u.userid
                ORDER BY created_time DESC
                LIMIT 1
                ) r ON TRUE
                ORDER BY r.created_time DESC;
        """
        cursor.execute(query)
        users = cursor.fetchall()
    # Return as list of dicts
    return jsonify(
        [
            {
                "userid": row[0],
                "firstname": row[1],
                "lastReport": row[3].isoformat() if row[3] else None,
            }
            for row in users
        ]
    )


@app.route("/admin/reports/user/<int:userid>", methods=["GET"])
def get_user_reports(userid):
    with db_pool.connection() as connection:
        cursor = connection.cursor()
        query = """
            SELECT 
                id,
                user_id,
                student_name,
                manager_name,
                manager_email,
                report_date,
                created_time,
                answers
            FROM reports
            WHERE user_id = %s
            ORDER BY id ASC;
        """
        cursor.execute(query, (userid,))
        reports = cursor.fetchall()
    return jsonify(
        [
            {
                "id": row[0],
                "user_id": row[1],
                "student_name": row[2],
                "manager_name": row[3],
                "manager_email": row[4],
                "report_date": row[5].isoformat() if row[5] else None,
                "created_time": row[6].isoformat() if row[6] else None,
                "answers": row[7],
            }
            for row in reports
        ]
    )


@app.route("/admin/api/reports", methods=["GET"])
def get_filtered_reports():
    try:
        student_name = request.args.get("student_name")
        cohort = request.args.get("cohort")
        start_date = request.args.get("start_date")
        end_date = request.args.get("end_date")

        connection = get_db_connection()
        cursor = connection.cursor()
        query = """
            SELECT r.id, r.user_id, r.student_name, r.manager_name, r.manager_email, r.report_date, r.created_time, r.answers, u.cohort
            FROM reports r
            JOIN Users u ON r.user_id = u.userId
            WHERE (%(student_name)s IS NULL OR r.student_name ILIKE %(student_name)s)
              AND (%(cohort)s IS NULL OR u.cohort = %(cohort)s)
              AND (%(start_date)s IS NULL OR r.report_date >= %(start_date)s)
              AND (%(end_date)s IS NULL OR r.report_date <= %(end_date)s)
            ORDER BY r.created_time DESC
        """
        params = {
            "student_name": f"%{student_name}%" if student_name else None,
            "cohort": cohort,
            "start_date": start_date,
            "end_date": end_date,
        }
        cursor.execute(query, params)
        reports = cursor.fetchall()
        columns = [desc[0] for desc in cursor.description]
        result = [dict(zip(columns, row)) for row in reports]
        if connection:
            return_db_connection(connection)
        return jsonify(result), 200
    except Exception as error:
        return jsonify({"error": str(error)}), 500


@app.route("/user-internship-info", methods=["POST"])
def save_user_internship_info():
    data = request.json
    user_id = data.get("user_id")
    user_name = data.get("user_name") or data.get("userName")
    term = data.get("term")
    year = data.get("year")
    role_title = data.get("roleTitle")
    manager_name = data.get("managerName")
    team_size = data.get("teamSize")
    if team_size == "" or team_size is None:
        team_size = None
    else:
        team_size = int(team_size)
    division = data.get("division")
    technologies = data.get("technologies")
    feedback_frequency = data.get("feedbackFrequency")
    astro_sign = data.get("astroSign")
    help_text = data.get("help")

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO user_internship_info
            (user_id, user_name, term, year, role_title, manager_name, team_size, division, technologies, feedback_frequency, astro_sign, help)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (
                user_id,
                user_name,
                term,
                year,
                role_title,
                manager_name,
                team_size,
                division,
                technologies,
                feedback_frequency,
                astro_sign,
                help_text,
            ),
        )
        conn.commit()
        cursor.close()
        return jsonify({"message": "Info saved successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            return_db_connection(conn)


@app.route("/activity101/feedback", methods=["POST", "OPTIONS"])
def submit_activity101_feedback():
    if request.method == "OPTIONS":
        return jsonify({"message": "OK"}), 200
    try:
        data = request.json
        user_id = data.get("user_id")
        conditional_help = data.get("conditional_help")
        video_useful = data.get("video_useful")
        feedback_text = data.get("feedback_text")
        rating = data.get("rating")

        if not user_id:
            return jsonify({"error": "user_id is required"}), 400

        connection = get_db_connection()
        cursor = connection.cursor()

        insert_query = """
        INSERT INTO activity_101_feedback (user_id, conditional_help, video_useful, feedback_text, rating)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING id, created_time;
        """
        cursor.execute(
            insert_query,
            (user_id, conditional_help, video_useful, feedback_text, rating),
        )
        feedback_id, created_time = cursor.fetchone()
        connection.commit()

        return jsonify(
            {
                "message": "Feedback submitted successfully",
                "feedback_id": feedback_id,
                "created_time": created_time,
            }
        ), 201

    except Exception as error:
        return jsonify({"error": str(error)}), 500
    finally:
        if connection:
            return_db_connection(connection)


@app.route("/users/<int:user_id>/cohort", methods=["PUT"])
def update_user_cohort(user_id):
    data = request.get_json()
    cohort = data.get("cohort")
    if not cohort:
        return jsonify({"error": "Cohort is required"}), 400
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute(
            "UPDATE Users SET cohort = %s WHERE userId = %s", (cohort, user_id)
        )
        connection.commit()
        return jsonify({"success": True, "message": "Cohort updated"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if connection:
            return_db_connection(connection)


@app.route("/admin/ai/summary", methods=["GET"])
def get_ai_summary():
    try:
        limit = int(request.args.get("limit", 200))
        cohort = request.args.get("cohort")

        connection = get_db_connection()
        cursor = connection.cursor()

        base_query = """
            SELECT ras.user_id, u.firstname, u.cohort, ras.top_technologies_used, ras.sentiment_risk_management,
                   ras.performance_metrics, ras.action_items, ras.overall_summary, ras.created_time
            FROM report_ai_summaries ras
            LEFT JOIN Users u ON u.userId = ras.user_id
            {where}
            ORDER BY ras.created_time DESC
            LIMIT %s
            """
        where_clause = ""
        params = []
        if cohort:
            where_clause = "WHERE u.cohort = %s"
            params.append(cohort)
        params.append(limit)

        cursor.execute(base_query.format(where=where_clause), params)
        rows = cursor.fetchall()

        # Aggregations
        from collections import Counter

        tech_counter = Counter()
        sentiment_counter = Counter()
        risk_counter = Counter()
        action_items_set = []
        overall_summaries = []
        metrics_latest = None

        for r in rows:
            (
                user_id,
                firstname,
                cohort_val,
                top_tech,
                sent_risk,
                perf,
                actions,
                overall,
                created_time,
            ) = r
            # tech
            try:
                if isinstance(top_tech, str):
                    top_tech_json = json.loads(top_tech)
                else:
                    top_tech_json = top_tech
                if isinstance(top_tech_json, list):
                    for item in top_tech_json:
                        if isinstance(item, dict):
                            name = item.get("name") or item.get("technology") or ""
                            count = item.get("count") or 1
                            if name:
                                tech_counter[name.strip()] += (
                                    int(count) if isinstance(count, int) else 1
                                )
                        elif isinstance(item, str):
                            tech_counter[item.strip()] += 1
            except Exception:
                pass

            # sentiment and risks
            try:
                if isinstance(sent_risk, str):
                    sent_risk_json = json.loads(sent_risk)
                else:
                    sent_risk_json = sent_risk
                if isinstance(sent_risk_json, dict):
                    overall_sent = (
                        (sent_risk_json.get("overall_sentiment") or "").strip().lower()
                    )
                    if overall_sent:
                        sentiment_counter[overall_sent] += 1
                    for rf in sent_risk_json.get("risk_flags", []) or []:
                        if isinstance(rf, str) and rf.strip():
                            risk_counter[rf.strip()] += 1
            except Exception:
                pass

            # actions
            try:
                if isinstance(actions, str):
                    actions_json = json.loads(actions)
                else:
                    actions_json = actions
                if isinstance(actions_json, list):
                    for a in actions_json:
                        if isinstance(a, str) and a.strip():
                            action_items_set.append(a.strip())
            except Exception:
                pass

            # overall summaries (latest few)
            if overall:
                overall_summaries.append(
                    {
                        "user_id": user_id,
                        "firstname": firstname,
                        "cohort": cohort_val,
                        "summary": overall,
                        "created_time": created_time,
                    }
                )

            # track latest metrics
            if metrics_latest is None and perf is not None:
                try:
                    metrics_latest = json.loads(perf) if isinstance(perf, str) else perf
                except Exception:
                    metrics_latest = None

        tech = [{"name": k, "count": v} for k, v in tech_counter.most_common(20)]
        risk_flags = [{"text": k, "count": v} for k, v in risk_counter.most_common(20)]
        action_items = []
        seen_ai = set()
        for a in action_items_set:
            if a not in seen_ai:
                action_items.append(a)
                seen_ai.add(a)

        result = {
            "tech": tech,
            "sentiment": dict(sentiment_counter),
            "risk_flags": risk_flags,
            "action_items": action_items[:30],
            "overall_summaries": overall_summaries[:10],
            "metrics_latest": metrics_latest,
            "raw_count": len(rows),
        }
        return jsonify(result), 200
    except Exception as error:
        return jsonify({"error": str(error)}), 500
    finally:
        try:
            if connection:
                return_db_connection(connection)
        except Exception:
            pass


@app.route("/admin/reports/backfill-s3", methods=["POST"])
def backfill_reports_to_s3():
    try:
        payload = request.get_json(force=True) or {}
        target_user_id = payload.get("user_id")
        start_date = payload.get("start_date")  # ISO or YYYY-MM-DD
        end_date = payload.get("end_date")  # ISO or YYYY-MM-DD
        limit = int(payload.get("limit") or 1000)
        overwrite = bool(payload.get("overwrite") or False)
        dry_run = bool(payload.get("dry_run") or False)
        # Path base: 'users' -> users/{userId}/appdata/..., or 'users/321' -> users/321/{userId}/appdata/...
        prefix_base = payload.get("prefix_base") or "users"

        def parse_any_date(dt_val):
            if not dt_val:
                return None
            if isinstance(dt_val, (datetime,)):
                return dt_val
            if isinstance(dt_val, str):
                rd = dt_val
                try:
                    if rd.endswith("Z"):
                        return datetime.fromisoformat(rd.replace("Z", "+00:00"))
                except Exception:
                    pass
                for fmt in (
                    "%Y-%m-%d",
                    "%m/%d/%Y",
                    "%Y/%m/%d",
                    "%Y-%m-%dT%H:%M:%S.%f%z",
                    "%Y-%m-%dT%H:%M:%S.%f",
                    "%Y-%m-%dT%H:%M:%S",
                    "%Y-%m-%d %H:%M:%S",
                ):
                    try:
                        return datetime.strptime(rd, fmt)
                    except Exception:
                        continue
            return None

        # Build WHERE clause dynamically
        where = []
        params = []
        if target_user_id:
            where.append("user_id = %s")
            params.append(int(target_user_id))
        if start_date:
            where.append("report_date >= %s")
            params.append(parse_any_date(start_date))
        if end_date:
            where.append("report_date <= %s")
            params.append(parse_any_date(end_date))
        where_sql = (" WHERE " + " AND ".join(where)) if where else ""

        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute(
            f"""
            SELECT id, user_id, student_name, manager_name, manager_email, report_date, created_time, answers
            FROM reports
            {where_sql}
            ORDER BY id ASC
            LIMIT %s
            """,
            params + [limit],
        )
        rows = cursor.fetchall()

        processed = 0
        skipped = 0
        results = []

        for row in rows:
            (
                r_id,
                r_user_id,
                student_name,
                manager_name,
                manager_email,
                report_date,
                created_time,
                answers,
            ) = row
            # Date components: prefer report_date, fallback to created_time, else today
            dt = parse_any_date(report_date) or created_time or datetime.utcnow()
            year_str = dt.strftime("%Y")
            month_str = dt.strftime("%m")
            day_str = dt.strftime("%d")
            safe_name = "".join(
                c
                for c in (student_name or "report")
                if c.isalnum() or c in (" ", "_", "-")
            ).rstrip()
            # Build S3 key for JSON
            key_prefix = (
                f"{prefix_base}/{r_user_id}/appdata/{year_str}/{month_str}/{day_str}/"
            )
            s3_key_json = (
                f"{key_prefix}{safe_name}_{dt.date().isoformat()}_id{r_id}.json"
            )

            # Skip if exists and not overwriting
            exists = False
            try:
                s3.head_object(Bucket=bucket, Key=s3_key_json)
                exists = True
            except Exception:
                exists = False
            if exists and not overwrite:
                skipped += 1
                results.append(
                    {
                        "id": r_id,
                        "user_id": r_user_id,
                        "s3_key": s3_key_json,
                        "status": "exists",
                    }
                )
                continue

            payload_json = json.dumps(
                {
                    "user_id": r_user_id,
                    "student_name": student_name,
                    "manager_name": manager_name,
                    "manager_email": manager_email,
                    "report_date": dt.date().isoformat(),
                    "answers": answers,
                },
                ensure_ascii=False,
            ).encode("utf-8")

            if not dry_run:
                s3.put_object(
                    Bucket=bucket,
                    Key=s3_key_json,
                    Body=payload_json,
                    ContentType="application/json",
                )
            processed += 1
            results.append(
                {
                    "id": r_id,
                    "user_id": r_user_id,
                    "s3_key": s3_key_json,
                    "status": "written" if not dry_run else "dry_run",
                }
            )

        return jsonify(
            {
                "matched": len(rows),
                "processed": processed,
                "skipped": skipped,
                "dry_run": dry_run,
                "prefix_base": prefix_base,
                "results": results[:200],  # trim response
            }
        ), 200
    except Exception as error:
        return jsonify({"error": str(error)}), 500
    finally:
        try:
            if connection:
                return_db_connection(connection)
        except Exception:
            pass


@app.route("/api/daily-feedback", methods=["POST", "OPTIONS"])
def submit_daily_feedback():
    if request.method == "OPTIONS":
        return jsonify({"message": "OK"}), 200
    try:
        data = request.get_json(force=True) or {}
        user_id = data.get("userId") or data.get("user_id")
        student_name = data.get("studentName") or data.get("student_name")
        rating = data.get("rating")
        follow_up = data.get("followUp")  # Yes/No when rating is 1
        feedback = data.get("feedback")  # text when rating is 2

        if rating is None:
            return jsonify({"error": "rating is required"}), 400

        star1_yes_no = None
        star2_text = None
        if str(rating) == "1":
            if isinstance(follow_up, str):
                star1_yes_no = True if follow_up.strip().lower() == "yes" else False
            elif isinstance(follow_up, bool):
                star1_yes_no = bool(follow_up)
        elif str(rating) == "2":
            star2_text = feedback or None

        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            """
            INSERT INTO daily_popup (user_id, student_name, rating, star1_yes_no, star2_text)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id, created_time
            """,
            (
                user_id,
                student_name,
                int(rating) if rating is not None else None,
                star1_yes_no,
                star2_text,
            ),
        )
        row = cur.fetchone()
        conn.commit()
        return jsonify(
            {"message": "Daily feedback saved", "id": row[0], "created_time": row[1]}
        ), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        try:
            if conn:
                return_db_connection(conn)
        except Exception:
            pass


@app.route("/internship-summary/<int:user_id>", methods=["GET"])
def get_internship_summary(user_id):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        query = """
            SELECT user_id, user_name, manager_name, manager_email, stars, reports_count, highlights, technologies, created_at, updated_at
            FROM internship_summaries
            WHERE user_id = %s
        """
        cursor.execute(query, (user_id,))
        row = cursor.fetchone()
        if not row:
            return jsonify({"error": "Internship summary not found"}), 404
        result = {
            "user_id": row[0],
            "user_name": row[1],
            "manager_name": row[2],
            "manager_email": row[3],
            "stars": row[4],
            "reports_count": row[5],
            "highlights": row[6] or [],
            "technologies": row[7] or [],
            "created_at": row[8].isoformat() if row[8] else None,
            "updated_at": row[9].isoformat() if row[9] else None,
        }
        return jsonify(result), 200
    except Exception as error:
        return jsonify({"error": str(error)}), 500
    finally:
        try:
            cursor.close()
        except Exception:
            pass
        if connection:
            return_db_connection(connection)


@app.route("/internship-summaries", methods=["GET"])
def list_internship_summaries():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        query = """
            SELECT user_id, user_name, manager_name, manager_email, stars, reports_count, highlights, technologies, created_at, updated_at
            FROM internship_summaries
            ORDER BY stars DESC, user_name ASC
        """
        cursor.execute(query)
        rows = cursor.fetchall()
        results = []
        for row in rows:
            results.append(
                {
                    "user_id": row[0],
                    "user_name": row[1],
                    "manager_name": row[2],
                    "manager_email": row[3],
                    "stars": row[4],
                    "reports_count": row[5],
                    "highlights": row[6] or [],
                    "technologies": row[7] or [],
                    "created_at": row[8].isoformat() if row[8] else None,
                    "updated_at": row[9].isoformat() if row[9] else None,
                }
            )
        return jsonify(results), 200
    except Exception as error:
        return jsonify({"error": str(error)}), 500
    finally:
        try:
            cursor.close()
        except Exception:
            pass
        if connection:
            return_db_connection(connection)

if __name__ == '__main__':
    # app.run(host='0.0.0.0', port=5000, ssl_context=('cert.pem', 'key.pem'))
    app.run(host="0.0.0.0", port=5000)
