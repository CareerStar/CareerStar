from flask import Flask, jsonify
import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

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

if __name__ == '__main__':
    app.run(debug=True)
