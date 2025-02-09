from flask import Flask, jsonify, request
import os
import psycopg2
import json
import boto3
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

@app.route('/users', methods=['POST'])
def add_user():
    try:
        user_data = request.json

        firstname = user_data.get('firstname')
        lastname = user_data.get('lastname')
        emailID = user_data.get('emailID')
        emailID = emailID.lower()
        password = user_data.get('password')
        stars = user_data.get('stars')

        if not firstname or not lastname or not emailID or not password:
            return jsonify({"error": "Missing required fields"}), 400
        
        hashed_password = generate_password_hash(password)

        connection = get_db_connection()
        cursor = connection.cursor()

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

        return jsonify({
                    "message": "User added successfully",
                    "userId": user_id,
                    "firstname": firstname,
                    "access_token": access_token,
                    "refresh_token": refresh_token
                }), 201

    except psycopg2.IntegrityError as e:
        return jsonify({"error": "Email already exists"}), 400
    except Exception as error:
        return jsonify({"error": str(error)}), 500
    finally:
        if connection:
            return_db_connection(connection)
            # cursor.close()
            # connection.close()


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
        activitychoices = user_data.get('activityChoices')

        if not userId or not describeMe or not currentSituation or not goal:
            return jsonify({"error": "Missing data"}), 400
        
        connection = get_db_connection()
        cursor = connection.cursor()

        insert_query = """
        INSERT INTO user_personalization (userId, describeMe, currentSituation, goal, onboarded, choice, summary, degree, major, activitychoices)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING userId;
        """

        cursor.execute(insert_query, (userId, describeMe, currentSituation, goal, True, choice, summary, degree, major, activitychoices))
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

@app.route('/events/<int:userId>', methods=['GET'])
def get_user_activities_details(userId):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        get_user_activities_details_query = """
        SELECT a.imageURL, a.videoURL, a.title, a.description, a.tags, a.star, a.activityId, a.eventURL, a.eventDate, a.detailedDescription, u.completed FROM user_activities u JOIN activities a ON a.activityId = u.activityId WHERE u.userId = %s;
        """
        cursor.execute(get_user_activities_details_query, (userId,))
        activities = cursor.fetchall()
        activity_list = []
        for activity in activities:
            activity_dict = {
                "imageURL": activity[0],
                "videoURL": activity[1],
                "title": activity[2],
                "description": activity[3],
                "tags": activity[4],
                "star": activity[5],
                "activityId": activity[6],
                "eventURL": activity[7],
                "eventDate": activity[8], 
                "detailedDescription": activity[9],
                "completed": activity[10],
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

@app.route('/events', methods=['GET'])
@jwt_required()
def get_all_activities_details():
    current_user = get_jwt_identity()
    if current_user['role'] != 'admin':
        return jsonify({"error": "Unauthorized"}), 401
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        get_user_activities_details_query = """
        SELECT imageURL, title, description, tags, star, activityId, videoURL, eventURL, eventDate, detailedDescription FROM activities;
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
                "model": "google/gemini-2.0-flash-thinking-exp:free",
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

        response_json = response.json()
        return jsonify({"feedback": response_json["choices"][0]["message"]["content"]})

    except Exception as error:
        return jsonify({"error": str(error)}), 500

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

@app.route('/events/<int:userId>/<int:activityId>', methods=['PUT'])
def update_user_activity(userId, activityId):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        data = request.json
        completed = data.get("completed")
        stars = data.get('stars')

        update_user_activity_query = """
        UPDATE user_activities 
        SET completed = %s 
        WHERE userId=%s AND activityId = %s;
        """
        cursor.execute(update_user_activity_query, (completed, userId, activityId))
        connection.commit()

        update_user_star_query = """
        UPDATE Users
        SET stars = stars + %s
        WHERE userId=%s
        """
        cursor.execute(update_user_star_query, (stars, userId))
        connection.commit()

        return jsonify({"message": "User activity table updated successfully"}), 200

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