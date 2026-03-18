from flask import Flask, jsonify
from flask_cors import CORS
import mysql.connector
from dotenv import load_dotenv
import os

load_dotenv()  # Load environment variables from .env file

app = Flask(__name__)
CORS(app)  # Allows React to call this API

@app.route('/api/db-status')
def db_status():
    try:
        mydb = mysql.connector.connect(
            host=os.getenv("DB_HOST"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            database=os.getenv("DB_NAME"),
            port=os.getenv("DB_PORT")
        )
        mycursor = mydb.cursor()
        mycursor.execute("select database();")
        myresult = mycursor.fetchall()
        mydb.close()

        return jsonify({ "connected": True, "database": myresult })
    except Exception as e:
        return jsonify({ "connected": False, "error": str(e) }), 500

if __name__ == '__main__':
    app.run(port=5000)