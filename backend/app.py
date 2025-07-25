from flask import Flask, jsonify, request, url_for
import os
import psycopg2
import json
import boto3
import base64
import logging
from psycopg2 import pool
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta, datetime
import mailchimp_marketing as MailchimpMarketing
from mailchimp_marketing import Client
from mailchimp_marketing.api_client import ApiClientError
import requests
from google import genai
import threading
from flask_mail import Mail, Message
from itsdangerous import URLSafeTimedSerializer

load_dotenv()

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)
jwt = JWTManager(app)
CORS(app)

db_host = os.getenv('DB_HOST')
db_port = os.getenv('DB_PORT')
db_name = os.getenv('DB_NAME')
db_user = os.getenv('DB_USER')
db_password = os.getenv('DB_PASSWORD')

mailchimp_api_key = os.getenv('MAILCHIMP_API_KEY')
mailchimp_server = os.getenv('MAILCHIMP_SERVER')
mailchimp_audience_id = os.getenv('MAILCHIMP_AUDIENCE_ID')

openrouter_api_key = os.getenv('OPENROUTER_API_KEY')

client = genai.Client(api_key=os.getenv('GEMINI_API_KEY'))

app.config.from_object('mail_config')
mail = Mail(app)

connection_pool = psycopg2.pool.SimpleConnectionPool(
    1, 20,  # Min and max connections
    host=db_host,
    port=db_port,
    database=db_name,
    user=db_user,
    password=db_password
)

S3_BUCKET = os.getenv('AWS_BUCKET')
S3_KEY = os.getenv('AWS_ACCESS_KEY')
S3_SECRET = os.getenv('AWS_SECRET_KEY')
S3_REGION = os.getenv('AWS_REGION')

s3 = boto3.client('s3', aws_access_key_id=S3_KEY, aws_secret_access_key=S3_SECRET, region_name=S3_REGION)


logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('careerstar-backend.log'), 
        logging.StreamHandler() 
    ]
)

logger = logging.getLogger()

def get_db_connection():
    # connection = psycopg2.connect(
    #     host=db_host,
    #     port=db_port,
    #     database=db_name,
    #     user=db_user,
    #     password=db_password
    # )
    # return connection
    return connection_pool.getconn()

def return_db_connection(conn):
    connection_pool.putconn(conn)

serializer = URLSafeTimedSerializer(os.getenv('SECRET_KEY'))

def check_user_by_email(email):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        email = email.lower()
        query = "SELECT 1 FROM Users WHERE emailID = %s;"
        cursor.execute(query, (email,))
        result = cursor.fetchone()

        return result is not None

    except Exception as error:
        print("Error in get_user_by_email:", error)
        return False
    finally:
        if connection:
            return_db_connection(connection)


@app.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')

    user = check_user_by_email(email)

    if not user:
        return jsonify({"message": "Email not registered"}), 400

    logger.info("Here 101")
    token = serializer.dumps(email, salt="password-reset")

    logger.info(token)
    app_url = 'https://app.careerstar.co/'
    reset_url = f"{app_url}reset-password/{token}"

    logger.info("Reset url:", reset_url)

    msg = Message("Password Reset Request", sender="support@careerstar.co", recipients=[email])
    msg.body = f"Click the link to reset your password: {reset_url}"

    logger.info("Message", msg)
    mail.send(msg)

    return jsonify({"message": "Password reset email sent"}), 200

def update_user_password(email, new_password):
    try:
        connection = get_db_connection()
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

    finally:
        if connection:
            return_db_connection(connection)

@app.route('/reset-password/<token>', methods=['POST'])
def reset_password(token):
    print("token", token)
    try:
        email = serializer.loads(token, salt="password-reset", max_age=3600)
    except:
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
        connection = get_db_connection()
        cursor = connection.cursor()
        
        query = "SELECT userId, firstname, emailID, stars FROM Users ORDER BY created_at DESC"
        cursor.execute(query)
        users = cursor.fetchall()
        
        cursor.close()
        connection.close()

        userlist = []
        for user in users:
            userDict = {
                "userId": user[0],
                "firstname": user[1],
                "emailID": user[2],
                "stars": user[3]
            }
            userlist.append(userDict)
        
        return jsonify({"users": userlist})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if connection:
            return_db_connection(connection)

@app.route('/user/<int:userId>', methods=['GET'])
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
                "stars": user[3]
            }
            return jsonify(user_dict)

    except Exception as error:
        return jsonify({"error": str(error)}), 500

    finally:
        if connection:
            return_db_connection(connection)
            # cursor.close()
            # connection.close()

@app.route('/users/stats', methods=['GET'])
def get_user_stats():
    try:
        connection = get_db_connection()
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
            data.append({
                "date": d.strftime('%Y-%m-%d'),
                "total_users": cumulative_count
            })

        goal_count = 1000

        cursor.close()
        connection.close()

        return jsonify({
            "data": data,
            "goal_count": goal_count
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if connection:
            return_db_connection(connection)


@app.route('/users/<int:user_id>/stars', methods=['PUT'])
@jwt_required()
def update_user_stars(user_id):
    current_user = get_jwt_identity()
    if current_user['role'] != 'admin':
        return jsonify({"error": "Unauthorized"}), 401
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        
        data = request.json
        new_stars = data.get('stars')
        
        if new_stars is None:
            return jsonify({"error": "Stars value is required"}), 400
        
        update_query = "UPDATE Users SET stars = %s WHERE userId = %s"
        cursor.execute(update_query, (new_stars, user_id))
        connection.commit()
        
        cursor.close()
        connection.close()
        
        return jsonify({"success": True, "message": f"Stars updated for user {user_id}"})
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
        
        cursor.execute(query, )
        users = cursor.fetchall()

        userlist = []
        for user in users:
            userDict = {
                "userId": user[0],
                "firstname": user[1],
                "stars": user[2]
            }
            userlist.append(userDict)
        
        return jsonify(userlist)
    
    except Exception as e:
        print(f"Database error: {e}")
        return []
    finally:
        if connection:
            return_db_connection(connection)

@app.route('/login', methods=['POST'])
def login():
    try:
        user_data = request.json
        emailID = user_data.get('emailID')
        emailID = emailID.lower()
        password = user_data.get('password')

        if not emailID or not password:
            return jsonify({"error": "Missing email or password"}), 400
        
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute("SELECT userId, password, firstname FROM Users WHERE emailID = %s;", (emailID,))
        user = cursor.fetchone()

        if user:
            user_id, hashed_password, firstname = user

            if check_password_hash(hashed_password, password):
                access_token = create_access_token(identity=user_id, expires_delta=timedelta(days=7))
                
                refresh_token = create_access_token(identity=user_id, expires_delta=timedelta(days=30))

                return jsonify({
                    "message": "Login successful",
                    "userId": user_id,
                    "firstname": firstname,
                    "access_token": access_token,
                    "refresh_token": refresh_token
                }), 200
            else:
                return jsonify({"error": "Invalid email or password"}), 400
        else:
            return jsonify({"error": "Invalid email or password"}), 400
    except Exception as error:
        return jsonify({"error": str(error)}), 500
    finally:
        if connection:
            return_db_connection(connection)
            # cursor.close()
            # connection.close()

@app.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    try:
        current_user = get_jwt_identity()
        new_access_token = create_access_token(identity=current_user, expires_delta=timedelta(days=7))
        return jsonify({"access_token": new_access_token}), 200
    except Exception as error:
        return jsonify({"error": str(error)}), 500

@app.route('/protected', methods=['GET'])
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
            if (set(activity[1]) & set(activitychoices)):
                addActivityToUserActivitiesTable(user_id, activity[0])
        return True

    except Exception as error:
        return jsonify({"error": str(error)}), 500

    finally:
        if connection:
            return_db_connection(connection)

@app.route('/universities', methods=['GET'])
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


@app.route('/onboarding', methods=['POST'])
def onboarding():
    try:
        user_data = request.json
        userId = user_data.get('userId')
        describeMe = user_data.get('describeMe')
        currentSituation = user_data.get('currentSituation')
        goal = user_data.get('goal')
        choice = user_data.get('choice')
        summary = user_data.get('summary')
        degree = user_data.get('degree')
        major = user_data.get('major')
        universityId = int(user_data.get('universityId'))
        activitychoices = user_data.get('activityChoices')

        if not userId or not describeMe or not currentSituation or not goal:
            return jsonify({"error": "Missing data"}), 400
        
        connection = get_db_connection()
        cursor = connection.cursor()

        insert_query = """
        INSERT INTO user_personalization (userId, describeMe, currentSituation, goal, onboarded, choice, summary, degree, major, universityId, activitychoices)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING userId;
        """

        cursor.execute(insert_query, (userId, describeMe, currentSituation, goal, True, choice, summary, degree, major, universityId, activitychoices))
        user_id = 0
        user_id = cursor.fetchone()[0]

        connection.commit()

        assign_activities_successful = assignActivitiesToUser(user_id, activitychoices)
        if assign_activities_successful:
            return jsonify({"message": "Data added successful", "userId": user_id, "onboarded": True}), 200
        else:
            return jsonify({"error": "Issue with data insertion"}), 400
    except Exception as error:
        return jsonify({"error": str(error)}), 500
    finally:
        if connection:
            return_db_connection(connection)
            # cursor.close()
            # connection.close()

@app.route('/onboarding/<int:userId>', methods=['GET'])
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

@app.route('/update_onboarding/<int:userId>', methods=['PUT'])
def update_user_onboarding_details(userId):
    try:
        data = request.get_json()
        current_situation = data.get('currentSituation')
        goal = data.get('goal')

        if not current_situation or not goal:
            return jsonify({"error": "Both 'currentSituation' and 'goal' fields are required"}), 400

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
            return jsonify({"message": "User onboarding details updated successfully"}), 200
        else:
            return jsonify({"error": "User not found or no changes made"}), 404

    except Exception as error:
        return jsonify({"error": str(error)}), 500

    finally:
        if connection:
            return_db_connection(connection)
            # cursor.close()
            # connection.close()

@app.route('/profile_picture/<int:userId>', methods=['GET'])
def get_profile_picture(userId):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        get_user_profilepicture_query = """
        SELECT profilepicture FROM user_personalization WHERE userId = %s;
        """
        cursor.execute(get_user_profilepicture_query, (userId, ))
        profilepicture = cursor.fetchone()[0]
        print(profilepicture)
        if profilepicture:
            data = {
                "profilepicture": profilepicture
            }
            return jsonify(data)

        return jsonify({"error": "User not found"}), 404

    except Exception as error:
        return jsonify({"error": str(error)}), 500

    finally:
        if connection:
            return_db_connection(connection)

@app.route('/profile_picture/<int:userId>', methods=['PUT'])
def update_profile_picture(userId):
    try:
        print("COmes here", userId)
        data = request.get_json()
        print(data)
        profilepicture = data.get('profilepicture')
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
        cursor.execute(update_profilepicture_query, (profilepicture, userId, ))

        connection.commit()

        if cursor.rowcount > 0:
            return jsonify({"message": "User profile picture details updated successfully"}), 200
        else:
            return jsonify({"error": "User not found or no changes made"}), 404

    except Exception as error:
        return jsonify({"error": str(error)}), 500

    finally:
        if connection:
            return_db_connection(connection)
            # cursor.close()
            # connection.close()

@app.route('/interviewschedule/<int:userId>', methods=['PUT'])
def update_interviewschedule(userId):
    try:
        data = request.get_json()
        interviewSchedule = data.get('interviewSchedule')
        newInterviewSchedule = data.get('newInterviewSchedule')
        firstname = data.get('firstname')
        emailID = data.get('emailID')

        interview_date = datetime.strptime(newInterviewSchedule.get('date'), "%Y-%m-%dT%H:%M:%S.%fZ").strftime("%m/%d/%y")

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
        cursor.execute(update_user_interviewschedule_query, (interviewSchedule_json, userId))

        connection.commit()

        add_contact_to_mailchimp(mailchimp_audience_id, emailID, firstname, interview_date)

        if cursor.rowcount > 0:
            return jsonify({"message": "User interview schedule updated successfully"}), 200
        else:
            return jsonify({"error": "User not found or no changes made"}), 404

    except Exception as error:
        return jsonify({"error": str(error)}), 500

    finally:
        if connection:
            return_db_connection(connection)
            # cursor.close()
            # connection.close()

@app.route('/interviewschedule/<int:userId>', methods=['GET'])
def get_interviewschedule(userId):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        get_user_interviewschedule_query = """
        SELECT interviewSchedule FROM user_personalization
        WHERE userId = %s;
        """
        cursor.execute(get_user_interviewschedule_query, (userId, ))
        interviewSchedule = cursor.fetchone()[0]
        if interviewSchedule:
            data = {
                "interviewSchedule": interviewSchedule
            }
            return jsonify(data)

        return jsonify({"error": "User not found or no changes made"}), 404

    except Exception as error:
        return jsonify({"error": str(error)}), 500

    finally:
        if connection:
            return_db_connection(connection)
            # cursor.close()
            # connection.close()

@app.route('/update_profile/<int:userId>', methods=['PUT'])
def update_user_profile_details(userId):
    try:
        data = request.get_json()
        summary = data.get('summary')

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
            return jsonify({"message": "User profile details updated successfully"}), 200
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

@app.route('/events', methods=['GET'])
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
                "detailedDescription": activity[9]
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

@app.route('/events', methods=['POST'])
@jwt_required()
def add_new_activities():
    current_user = get_jwt_identity()
    if current_user['role'] != 'admin':
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

        cursor.execute(add_new_activities_query, (imageURL, title, description, tags, star, videoURL, eventURL, eventDate, detailedDescription))
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
            "detailedDescription": detailedDescription
        }

        return jsonify({"message": "Activity added successfully", "activity": added_activity}), 201

    except Exception as error:
        return jsonify({"error": str(error)}), 500

    finally:
        if connection:
            return_db_connection(connection)
            # cursor.close()
            # connection.close()

@app.route('/events/<int:userId>', methods=['GET'])
def event_get_all(userId):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        get_events_query="""
        SELECT activityId FROM user_activities
        WHERE userId = %s AND completed = True;
        """

        cursor.execute(get_events_query, (userId, ))
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

@app.route('/upload-image', methods=['POST'])
def upload_image():
    user_id = request.form.get('userId')
    activity_id = request.form.get('activityId')
    file = request.files['file']

    if not file:
        return jsonify({'error': 'No file uploaded'}), 400

    try:
        filename = f"{user_id}/{activity_id}/{file.filename}"
        s3.upload_fileobj(file, S3_BUCKET, filename, ExtraArgs={'ContentType': file.content_type})

        file_url = f"https://{S3_BUCKET}.s3.{S3_REGION}.amazonaws.com/{filename}"

        return jsonify({'message': 'Image uploaded successfully', 'imageURL': file_url}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/roadmapactivity/<int:userId>', methods=['GET'])
def roadmapactivityget_all(userId):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        get_roadmapactivity_query="""
        SELECT roadmapactivityid, completed FROM user_roadmap_activities
        WHERE userId = %s;
        """

        cursor.execute(get_roadmapactivity_query, (userId, ))
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

@app.route('/roadmapactivity/<int:userId>/<int:roadmapActivityId>', methods=['GET'])
def roadmapactivityget(userId, roadmapActivityId):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        get_roadmapactivity_query="""
        SELECT answer, completed FROM user_roadmap_activities
        WHERE userId = %s AND roadmapActivityId = %s;
        """

        cursor.execute(get_roadmapactivity_query, (userId, roadmapActivityId))
        answer = cursor.fetchone()

        if answer:
            return jsonify(answer)
        else:
            return jsonify({"error": str(error)}), 404
    except Exception as error:
        return jsonify({"error": str(error)}), 500
    finally:
        if connection:
            return_db_connection(connection)
            # cursor.close()
            # connection.close()

@app.route('/roadmapactivity/<int:userId>/<int:roadmapActivityId>', methods=['POST'])
def roadmapactivitypost(userId, roadmapActivityId):
    try:
        activity_data = request.json
        answer = activity_data.get('answers')
        completed = activity_data.get('completed')
        stars = activity_data.get('stars')

        if answer:
            answer_json = json.dumps(answer)
        else:
            answer_json = None
        
        connection = get_db_connection()
        cursor = connection.cursor()

        check_query = """
        SELECT userId, completed FROM user_roadmap_activities
        WHERE userId = %s AND roadmapActivityId = %s;
        """

        cursor.execute(check_query, (userId, roadmapActivityId,))
        record = cursor.fetchone()
        
        if record:
            record_exists = record[0]
            previously_completed = record[1]
        else:
            record_exists = previously_completed = False

        if not previously_completed and completed:
            update_user_star_query = """
            UPDATE Users
            SET stars = stars + %s
            WHERE userId=%s
            """
            cursor.execute(update_user_star_query, (stars, userId))
            connection.commit()

        if record_exists:
            update_query = """
            UPDATE user_roadmap_activities SET answer = %s, completed = %s
            WHERE userId = %s AND roadmapActivityId = %s;
            """

            cursor.execute(update_query, (answer_json, completed, userId, roadmapActivityId,))
            connection.commit()

            return jsonify({"message": "Data update successful", "userId": userId, "roadmapActivityId": roadmapActivityId}), 200
        else:
            insert_query = """
            INSERT INTO user_roadmap_activities (userId, roadmapActivityId, completed, answer)
            VALUES (%s, %s, %s, %s);
            """

            cursor.execute(insert_query, (userId, roadmapActivityId, completed, answer_json, ))

            connection.commit()

            return jsonify({"message": "Data added successful", "userId": userId, "roadmapActivityId": roadmapActivityId}), 200
    except Exception as error:
        return jsonify({"error": str(error)}), 500
    finally:
        if connection:
            return_db_connection(connection)
            # cursor.close()
            # connection.close()

@app.route('/roadmapactivity', methods=['GET'])
@jwt_required()
def roadmapactivitiesget():
    current_user = get_jwt_identity()
    if current_user['role'] != 'admin':
        return jsonify({"error": "Unauthorized"}), 401
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        get_roadmapactivity_query="""
        SELECT COUNT(*), roadmapactivityid FROM user_roadmap_Activities GROUP BY roadmapactivityid;
        """

        cursor.execute(get_roadmapactivity_query, )
        activities = cursor.fetchall()

        activityList = []
        for activity in activities:
            activityDict = {
                "count": activity[0],
                "activityId": activity[1]
            }
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

@app.route('/generate-ai-feedback', methods=['POST'])
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
                "messages": [
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                "temperature": 0.5,
                "top_p": 1,
            }
        )

        if not response.ok:
            return jsonify({"error": f"OpenRouter error: {response.status_code}", "details": response.text}), 500

        response_json = response.json()

        if "choices" not in response_json:
            return jsonify({"error": "'choices' not found", "full_response": response_json}), 500

        return jsonify({"feedback": response_json["choices"][0]["message"]["content"]})

    except Exception as error:
        return jsonify({"error": str(error)}), 500

@app.route('/resumefeedback', methods=['POST'])
def upload_resume():
    try:
        if 'resume' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['resume']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

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
                    "data": base64.b64encode(file_data).decode('utf-8'),
                    "mimeType": "application/pdf"
                }
            }
        except Exception as encoding_error:
            return jsonify({'error': 'Failed to encode PDF'}), 500

        try:
            result = client.models.generate_content(
                model="gemini-2.0-flash",
                contents=[pdf, prompt])
                
        except Exception as model_error:
            return jsonify({'error': 'Failed to generate content'}), 500

        feedback = result.text if result.text else 'No feedback'

        return jsonify({'feedback': feedback})

    except Exception as e:
        return jsonify({'error': 'Failed to process resume'}), 500

@app.route('/events/<int:activityId>', methods=['PUT'])
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
        cursor.execute(update_activity_query, (title, description, tags, star, imageURL, videoURL, eventURL, eventDate, detailedDescription, activityId))
        connection.commit()

        return jsonify({"message": "Activity updated successfully"}), 200

    except Exception as error:
        return jsonify({"error": str(error)}), 500

    finally:
        if connection:
            return_db_connection(connection)

@app.route('/events/<int:activityId>', methods=['DELETE'])
@jwt_required()
def delete_activity(activityId):
    current_user = get_jwt_identity()
    if current_user['role'] != 'admin':
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

@app.route('/events/<int:userId>/<int:activityId>', methods=['PUT'])
def update_user_activity(userId, activityId):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        data = request.json
        completed = data.get("completed")
        stars = data.get('stars')

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

@app.route('/linkedin', methods=['GET'])
@jwt_required()
def get_users_linkedin_details():
    current_user = get_jwt_identity()
    if current_user['role'] != 'admin':
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
                    "emailId": user[3]
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

@app.route('/linkedin/<int:userId>', methods=['PUT'])
@jwt_required()
def post_users_linkedin_details(userId):
    current_user = get_jwt_identity()
    if current_user['role'] != 'admin':
        return jsonify({"error": "Unauthorized"}), 401
    try:
        data = request.json
        linkedInData = data.get('LinkedIn')
        linkedInData = json.dumps(linkedInData)
        connection = get_db_connection()
        cursor = connection.cursor()
        put_users_linkedin_details_query = """
        UPDATE user_personalization 
        SET LinkedIn = %s 
        WHERE userId = %s;
        """
        cursor.execute(put_users_linkedin_details_query, (linkedInData, userId,))
        connection.commit()
        return jsonify({"message": "Data update successful", "userId": userId}), 200
    except Exception as error:
        return jsonify({"error": str(error)}), 500

    finally:
        if connection:
            return_db_connection(connection)
            # cursor.close()
            # connection.close()

@app.route('/adminlogin', methods=['POST'])
def admin_login():
    username = request.json.get("username")
    password = request.json.get("password")
    if username == os.getenv('ADMIN_USERNAME') and password == os.getenv('ADMIN_PASSWORD'):
        access_token = create_access_token(identity={"username":username, "role":"admin"}, expires_delta=timedelta(days=7))
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401

@app.route('/verifyAdminToken', methods=['GET'])
@jwt_required()
def verifyAdminToken():
    try:
        current_user = get_jwt_identity()
        if current_user.get('role') != 'admin':
            return jsonify({"error": "Unauthorized"}), 401
        
        return jsonify({"message": "Token is valid", "user": current_user}), 200
    
    except Exception as e:
        return jsonify({"error": "An error occurred", "details": str(e)}), 500

@app.route('/', methods=['GET'])
def home():
    return 'Hello world'
    

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, ssl_context=('cert.pem', 'key.pem'))
    # app.run(host='0.0.0.0', port=5000)