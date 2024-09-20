from flask import Flask, jsonify, request
import os
import psycopg2
from psycopg2 import pool
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app)

db_host = os.getenv('DB_HOST')
db_port = os.getenv('DB_PORT')
db_name = os.getenv('DB_NAME')
db_user = os.getenv('DB_USER')
db_password = os.getenv('DB_PASSWORD')

connection_pool = psycopg2.pool.SimpleConnectionPool(
    1, 20,  # Min and max connections
    host=db_host,
    port=db_port,
    database=db_name,
    user=db_user,
    password=db_password
)

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

@app.route('/users', methods=['GET'])
def get_users():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT userId, firstname, lastname, emailID, created_at FROM Users;")

        users = cursor.fetchall()

        user_list = []
        for user in users:
            user_dict = {
                "userId": user[0],
                "firstname": user[1],
                "lastname": user[2],
                "emailID": user[3],
                "created_at": user[4].isoformat()
            }
            user_list.append(user_dict)

        return jsonify(user_list)

    except Exception as error:
        return jsonify({"error": str(error)}), 500

    finally:
        if connection:
            return_db_connection(connection)
            # cursor.close()
            # connection.close()

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

        connection.commit()

        return jsonify({"message": "User added successfully", "userId": user_id}), 201

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
                return jsonify({"message": "Login successful", "userId": user_id, "firstname": firstname}), 200
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

@app.route('/onboarding', methods=['POST'])
def onboarding():
    try:
        user_data = request.json
        print(user_data)
        userId = user_data.get('userId')
        describeMe = user_data.get('describeMe')
        currentSituation = user_data.get('currentSituation')
        goal = user_data.get('goal')
        choice = user_data.get('choice')

        if not userId or not describeMe or not currentSituation or not goal:
            return jsonify({"error": "Missing data"}), 400
        
        connection = get_db_connection()
        cursor = connection.cursor()

        insert_query = """
        INSERT INTO user_personalization (userId, describeMe, currentSituation, goal, onboarded, choice)
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING userId;
        """

        cursor.execute(insert_query, (userId, describeMe, currentSituation, goal, True, choice))
        user_id = 0
        user_id = cursor.fetchone()[0]

        connection.commit()
        if userId:
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
        SELECT describeMe, currentSituation, choice, onboarded, goal FROM user_personalization WHERE userId = %s;
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
                "goal": user[4]
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

if __name__ == '__main__':
    app.run(debug=True)
