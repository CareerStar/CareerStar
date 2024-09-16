from flask import Flask, jsonify, request
import os
import psycopg2
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

def get_db_connection():
    connection = psycopg2.connect(
        host=db_host,
        port=db_port,
        database=db_name,
        user=db_user,
        password=db_password
    )
    return connection

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
            cursor.close()
            connection.close()

@app.route('/users', methods=['POST'])
def add_user():
    try:
        user_data = request.json

        firstname = user_data.get('firstname')
        lastname = user_data.get('lastname')
        emailID = user_data.get('emailID')
        password = user_data.get('password')

        if not firstname or not lastname or not emailID or not password:
            return jsonify({"error": "Missing required fields"}), 400
        
        hashed_password = generate_password_hash(password)

        connection = get_db_connection()
        cursor = connection.cursor()

        insert_query = """
        INSERT INTO Users (firstname, lastname, emailID, password)
        VALUES (%s, %s, %s, %s)
        RETURNING userId, created_at;
        """

        cursor.execute(insert_query, (firstname, lastname, emailID, hashed_password))
        user_id = 0
        user_id - cursor.fetchone()[0]

        connection.commit()

        return jsonify({"message": "User added successfully", "userId": user_id}), 201

    except psycopg2.IntegrityError as e:
        return jsonify({"error": "Email already exists"}), 400
    except Exception as error:
        return jsonify({"error": str(error)}), 500
    finally:
        if connection:
            cursor.close()
            connection.close()

@app.route('/login', methods=['POST'])
def login():
    try:
        user_data = request.json
        emailID = user_data.get('emailID')
        password = user_data.get('password')

        if not emailID or not password:
            return jsonify({"error": "Missing email or password"}), 400
        
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute("SELECT userId, password FROM Users WHERE emailID = %s;", (emailID,))
        user = cursor.fetchone()

        if user:
            user_id, hashed_password = user

            if check_password_hash(hashed_password, password):
                return jsonify({"message": "Login successful", "userId": user_id}), 200
            else:
                return jsonify({"error": "Invalid email or password"}), 400
        else:
            return jsonify({"error": "Invalid email or password"}), 400
    except Exception as error:
        return jsonify({"error": str(error)}), 500
    finally:
        if connection:
            cursor.close()
            connection.close()
        
if __name__ == '__main__':
    app.run(debug=True)
