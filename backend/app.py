from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
from dotenv import load_dotenv
import os
import uuid
import hashlib

load_dotenv()

app = Flask(__name__)
CORS(app)

def get_db():
    return mysql.connector.connect(
            host=os.getenv("DB_HOST"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            database=os.getenv("DB_NAME"),
            port=int(os.getenv("DB_PORT")),
            ssl_disabled=False 
        )

# ──────────────────────────────────────────────
# DB STATUS
# ──────────────────────────────────────────────

@app.route('/api/db-status')
def db_status():
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT DATABASE();")
        result = cursor.fetchall()
        db.close()
        return jsonify({"connected": True, "database": result})
    except Exception as e:
        return jsonify({"connected": False, "error": str(e)}), 500


# ──────────────────────────────────────────────
# USERS
# ──────────────────────────────────────────────

@app.route('/api/users', methods=['POST'])
def insert_user():
    try:
        data = request.get_json()
        db = get_db()
        cursor = db.cursor()
        new_id = int.from_bytes(os.urandom(5), byteorder='little') % 9999999999  # Generate a short unique ID for the recipe
        cursor.execute(
            "INSERT INTO USER (user_id, username, email, password, role) VALUES (%s, %s, %s, %s, %s)",
            (new_id, data['username'], data['email'], data['password'], data['role'])
        )
        db.commit()
        db.close()
        return jsonify({"success": True, "user_id": new_id})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/update_user/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    try:
        data = request.get_json()
        username = data.get('username')
        role = data.get('role')
        if not username or role not in ('user', 'admin'):
            return jsonify({"success": False, "error": "Invalid data."}), 400
        db = get_db()
        cursor = db.cursor()
        cursor.execute(
            "UPDATE USER SET username = %s, role = %s WHERE user_id = %s",
            (username, role, user_id)
        )
        db.commit()
        db.close()
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/delete_user/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("DELETE FROM USER WHERE user_id = %s", (user_id,))
        db.commit()
        db.close()
        return jsonify({"success": True, "affectedRows": cursor.rowcount})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        username = data.get('username')
        password = hashlib.sha256(data.get('password').encode()).hexdigest()
        db = get_db()
        cursor = db.cursor(dictionary=True)
        cursor.execute(
            "SELECT user_id, role FROM USER WHERE username = %s AND password = %s",
            (username, password)
        )
        user = cursor.fetchone()
        db.close()
        if user:
            return jsonify({"success": True, "user_id": user['user_id'], "role": user['role']})
        else:
            return jsonify({"success": False, "error": "Invalid username or password"}), 401
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        db = get_db()
        cursor = db.cursor()

        cursor.execute("SELECT user_id FROM USER WHERE username = %s", (data.get('username'),))
        if cursor.fetchone():
            db.close()
            return jsonify({"success": False, "error": "Username already exists"}), 400

        new_id = int.from_bytes(os.urandom(5), byteorder='little') % 9999999999  # Generate a short unique ID for the user
        encrypted_password = hashlib.sha256(data.get('password').encode()).hexdigest()
        cursor.execute(
            "INSERT INTO USER (user_id, username, email, password, role) VALUES (%s, %s, %s, %s, %s)",
            (new_id, data.get('username'), data.get('email'), encrypted_password, 'user')
        )
        db.commit()
        db.close()
        return jsonify({"success": True, "user_id": new_id})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/change_password', methods=['POST'])
def change_password():
    try:
        data = request.get_json()
        username = data.get('username')
        new_password = hashlib.sha256(data.get('new_password').encode()).hexdigest()
        db = get_db()
        cursor = db.cursor(dictionary=True)

        cursor.execute("SELECT user_id FROM USER WHERE username = %s", (username,))
        row = cursor.fetchone()
        if not row:
            db.close()
            return jsonify({"success": False, "error": "User not found"}), 404

        user_id = row['user_id']
        cursor.execute(
            "UPDATE USER SET password = %s WHERE user_id = %s",
            (new_password, user_id)
        )
        db.commit()
        db.close()
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/users', methods=['GET'])
def get_users():
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT user_id, username, email, role FROM USER")
        users = cursor.fetchall()
        db.close()
        return jsonify({"success": True, "users": users})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# ──────────────────────────────────────────────
# RECIPES
# ──────────────────────────────────────────────

@app.route('/api/recipes', methods=['POST'])
def insert_recipe():
    try:
        data = request.get_json()
        db = get_db()
        cursor = db.cursor()
        new_id = int.from_bytes(os.urandom(5), byteorder='little') % 9999999999  # Generate a short unique ID for the recipe
        cursor.execute(
            """INSERT INTO RECIPE (recipe_id, user_id, title, description, instructions, prep_time, cook_time, servings)
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s)""",
            (new_id, data['user_id'], data['title'], data.get('description'), data.get('instructions'),
             data.get('prep_time'), data.get('cook_time'), data.get('servings'))
        )
        db.commit()
        db.close()
        return jsonify({"success": True, "recipe_id": new_id})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/recipes/<user_id>', methods=['GET'])
def get_recipe(user_id):
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT * FROM RECIPE WHERE user_id = %s", (user_id,))
        recipes = cursor.fetchall()
        db.close()
        return jsonify({"success": True, "recipes": recipes})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/recipes', methods=['GET'])
def get_all_recipes():
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT * FROM RECIPE")
        recipes = cursor.fetchall()
        db.close()
        return jsonify({"success": True, "recipes": recipes})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    

@app.route('/api/recipes/search', methods=['GET'])
def search_recipes():
    try:
        title = request.args.get('title')

        if not title:
            return jsonify({"success": False, "error": "Title query parameter is required"}), 400

        db = get_db()
        cursor = db.cursor(dictionary=True)

        query = """
            SELECT * 
            FROM RECIPE 
            WHERE LOWER(title) LIKE LOWER(%s)
        """
        cursor.execute(query, (f"%{title}%",))

        recipes = cursor.fetchall()
        return jsonify({"success": True, "recipes": recipes})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally: 
        db.close()



@app.route('/api/recipes/<recipe_id>', methods=['PUT'])
def update_recipe(recipe_id):
    try:
        data = request.get_json()
        db = get_db()
        cursor = db.cursor()
        cursor.execute(
            """UPDATE RECIPE SET title=%s, description=%s, instructions=%s,
            prep_time=%s, cook_time=%s, servings=%s WHERE recipe_id=%s""",
            (data['title'], data.get('description'), data.get('instructions'),
            data.get('prep_time'), data.get('cook_time'), data.get('servings'), recipe_id)
        )
        db.commit()
        db.close()
        return jsonify({"success": True, "affectedRows": cursor.rowcount})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/recipes/<int:recipe_id>', methods=['DELETE'])
def delete_recipe(recipe_id):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("DELETE FROM RECIPE WHERE recipe_id = %s", (recipe_id,))
        db.commit()
        db.close()
        return jsonify({"success": True, "affectedRows": cursor.rowcount})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ──────────────────────────────────────────────
# INGREDIENTS
# ──────────────────────────────────────────────


@app.route('/api/ingredients', methods=['GET'])
def get_ingredient():
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT * FROM INGREDIENT")
        ingredients = cursor.fetchall()
        db.close()
        return jsonify({"success": True, "ingredients": ingredients})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/ingredients', methods=['POST'])
def insert_ingredient():
    try:
        data = request.get_json()
        db = get_db()
        cursor = db.cursor()
        new_id = int.from_bytes(os.urandom(5), byteorder='little') % 9999999999  # Generate a short unique ID for the recipe
        cursor.execute(
            "INSERT INTO INGREDIENT (ingredient_id, name, description) VALUES (%s, %s, %s)",
            (new_id, data['name'], data.get('description'))
        )
        db.commit()
        db.close()
        return jsonify({"success": True, "ingredient_id": new_id})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/ingredients/<int:ingredient_id>', methods=['PUT'])
def update_ingredient(ingredient_id):
    try:
        data = request.get_json()
        allowed = ['name', 'description']
        fields = {k: v for k, v in data.items() if k in allowed and v}
        if not fields:
            return jsonify({"success": False, "error": "No valid fields to update."}), 400
        set_clause = ", ".join(f"{k} = %s" for k in fields)
        values = list(fields.values()) + [ingredient_id]
        db = get_db()
        cursor = db.cursor()
        cursor.execute(f"UPDATE INGREDIENT SET {set_clause} WHERE ingredient_id = %s", values)
        db.commit()
        db.close()
        return jsonify({"success": True, "affectedRows": cursor.rowcount})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/ingredients/<int:ingredient_id>', methods=['DELETE'])
def delete_ingredient(ingredient_id):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("DELETE FROM INGREDIENT WHERE ingredient_id = %s", (ingredient_id,))
        db.commit()
        db.close()
        return jsonify({"success": True, "affectedRows": cursor.rowcount})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ──────────────────────────────────────────────
# REVIEWS
# ──────────────────────────────────────────────

@app.route('/api/reviews', methods=['GET'])
def get_reviews():
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT b.title, c.username, a.comment, a.rating FROM REVIEW a JOIN RECIPE b ON b.recipe_id = a.recipe_id JOIN USER c ON c.user_id = a.user_id")
        reviews = cursor.fetchall()
        db.close()
        return jsonify({"success": True, "reviews": reviews})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    
@app.route('/api/reviews/<int:recipe_id>', methods=['GET'])
def get_recipe_reviews(recipe_id):
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT b.title, c.username, a.comment, a.rating FROM REVIEW a JOIN RECIPE b ON b.recipe_id = a.recipe_id JOIN USER c ON c.user_id = a.user_id WHERE b.recipe_id = %s", (recipe_id,))
        reviews = cursor.fetchall()
        db.close()
        return jsonify({"success": True, "reviews": reviews})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/recipes/<int:recipe_id>/reviews', methods=['POST'])
def insert_review(recipe_id):
    try:
        data = request.get_json()
        db = get_db()
        cursor = db.cursor()
        new_id = int.from_bytes(os.urandom(5), byteorder='little') % 9999999999  # Generate a short unique ID for the recipe
        cursor.execute(
            "INSERT INTO REVIEW (review_id, recipe_id, user_id, comment, rating) VALUES (%s, %s, %s, %s, %s)",
            (new_id, recipe_id, data['user_id'], data.get('comment'), data.get('rating'))
        )
        db.commit()
        db.close()
        return jsonify({"success": True, "review_id": new_id})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/reviews/<int:review_id>', methods=['PUT'])
def update_review(review_id):
    try:
        data = request.get_json()
        allowed = ['comment', 'rating']
        fields = {k: v for k, v in data.items() if k in allowed and v is not None and v != ''}
        if not fields:
            return jsonify({"success": False, "error": "No valid fields to update."}), 400
        set_clause = ", ".join(f"{k} = %s" for k in fields)
        values = list(fields.values()) + [review_id]
        db = get_db()
        cursor = db.cursor()
        cursor.execute(f"UPDATE REVIEW SET {set_clause} WHERE review_id = %s", values)
        db.commit()
        db.close()
        return jsonify({"success": True, "affectedRows": cursor.rowcount})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/reviews/<int:review_id>', methods=['DELETE'])
def delete_review(review_id):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("DELETE FROM REVIEW WHERE review_id = %s", (review_id,))
        db.commit()
        db.close()
        return jsonify({"success": True, "affectedRows": cursor.rowcount})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ──────────────────────────────────────────────
# CATEGORIES
# ──────────────────────────────────────────────

@app.route('/api/categories', methods=['POST'])
def insert_category():
    try:
        data = request.get_json()
        db = get_db()
        cursor = db.cursor()
        new_id = int.from_bytes(os.urandom(5), byteorder='little') % 9999999999  # Generate a short unique ID for the recipe
        cursor.execute(
            "INSERT INTO CATEGORY (category_id, name, description) VALUES (%s, %s, %s)",
            (new_id, data['name'], data.get('description'))
        )
        db.commit()
        db.close()
        return jsonify({"success": True, "category_id": new_id})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/categories/<int:category_id>', methods=['PUT'])
def update_category(category_id):
    try:
        data = request.get_json()
        allowed = ['name', 'description']
        fields = {k: v for k, v in data.items() if k in allowed and v}
        if not fields:
            return jsonify({"success": False, "error": "No valid fields to update."}), 400
        set_clause = ", ".join(f"{k} = %s" for k in fields)
        values = list(fields.values()) + [category_id]
        db = get_db()
        cursor = db.cursor()
        cursor.execute(f"UPDATE CATEGORY SET {set_clause} WHERE category_id = %s", values)
        db.commit()
        db.close()
        return jsonify({"success": True, "affectedRows": cursor.rowcount})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/categories/<int:category_id>', methods=['DELETE'])
def delete_category(category_id):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("DELETE FROM CATEGORY WHERE category_id = %s", (category_id,))
        db.commit()
        db.close()
        return jsonify({"success": True, "affectedRows": cursor.rowcount})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ──────────────────────────────────────────────
# DIETARY FLAGS
# ──────────────────────────────────────────────

@app.route('/api/dietary-flags', methods=['GET'])
def get_dietary_flag():
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT * FROM DIETARY_FLAG")
        dietary_flag = cursor.fetchall()
        db.close()
        return jsonify({"success": True, "dietary-flags": dietary_flag})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/dietary-flags', methods=['POST'])
def insert_dietary_flag():
    try:
        data = request.get_json()
        db = get_db()
        cursor = db.cursor()
        new_id = int.from_bytes(os.urandom(5), byteorder='little') % 9999999999  # Generate a short unique ID for the recipe
        cursor.execute(
            "INSERT INTO DIETARY_FLAG (flag_id, name, description) VALUES (%s, %s, %s)",
            (new_id, data['name'], data.get('description'))
        )
        db.commit()
        db.close()
        return jsonify({"success": True, "flag_id": new_id})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/dietary-flags/<int:flag_id>', methods=['PUT'])
def update_dietary_flag(flag_id):
    try:
        data = request.get_json()
        allowed = ['name', 'description']
        fields = {k: v for k, v in data.items() if k in allowed and v}
        if not fields:
            return jsonify({"success": False, "error": "No valid fields to update."}), 400
        set_clause = ", ".join(f"{k} = %s" for k in fields)
        values = list(fields.values()) + [flag_id]
        db = get_db()
        cursor = db.cursor()
        cursor.execute(f"UPDATE DIETARY_FLAG SET {set_clause} WHERE flag_id = %s", values)
        db.commit()
        db.close()
        return jsonify({"success": True, "affectedRows": cursor.rowcount})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/dietary-flags/<int:flag_id>', methods=['DELETE'])
def delete_dietary_flag(flag_id):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("DELETE FROM DIETARY_FLAG WHERE flag_id = %s", (flag_id,))
        db.commit()
        db.close()
        return jsonify({"success": True, "affectedRows": cursor.rowcount})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ──────────────────────────────────────────────
# CUISINES
# ──────────────────────────────────────────────

@app.route('/api/cuisines', methods=['GET'])
def get_cuisine():
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT * FROM CUISINE")
        cuisines = cursor.fetchall()
        db.close()
        return jsonify({"success": True, "cuisines": cuisines})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/cuisines', methods=['POST'])
def insert_cuisine():
    try:
        data = request.get_json()
        db = get_db()
        cursor = db.cursor()
        new_id = int.from_bytes(os.urandom(5), byteorder='little') % 9999999999  # Generate a short unique ID for the recipe
        cursor.execute(
            "INSERT INTO CUISINE (cuisine_id, name, description) VALUES (%s, %s, %s)",
            (new_id, data['name'], data.get('description'))
        )
        db.commit()
        db.close()
        return jsonify({"success": True, "cuisine_id": new_id})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/cuisines/<int:cuisine_id>', methods=['PUT'])
def update_cuisine(cuisine_id):
    try:
        data = request.get_json()
        allowed = ['name', 'description']
        fields = {k: v for k, v in data.items() if k in allowed and v}
        if not fields:
            return jsonify({"success": False, "error": "No valid fields to update."}), 400
        set_clause = ", ".join(f"{k} = %s" for k in fields)
        values = list(fields.values()) + [cuisine_id]
        db = get_db()
        cursor = db.cursor()
        cursor.execute(f"UPDATE CUISINE SET {set_clause} WHERE cuisine_id = %s", values)
        db.commit()
        db.close()
        return jsonify({"success": True, "affectedRows": cursor.rowcount})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/cuisines/<int:cuisine_id>', methods=['DELETE'])
def delete_cuisine(cuisine_id):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("DELETE FROM CUISINE WHERE cuisine_id = %s", (cuisine_id,))
        db.commit()
        db.close()
        return jsonify({"success": True, "affectedRows": cursor.rowcount})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ──────────────────────────────────────────────
# RECIPE COLLECTIONS
# ──────────────────────────────────────────────

@app.route('/api/collections', methods=['POST'])
def insert_collection():
    try:
        data = request.get_json()
        db = get_db()
        cursor = db.cursor()
        new_id = int.from_bytes(os.urandom(5), byteorder='little') % 9999999999  # Generate a short unique ID for the recipe
        cursor.execute(
            """INSERT INTO RECIPE_COLLECTION (collection_id, user_id, title, description, shared_with, privacy_status)
               VALUES (%s, %s, %s, %s, %s, %s)""",
            (new_id, data['user_id'], data['title'], data.get('description'),
             data.get('shared_with'), data.get('privacy_status', 'private'))
        )
        db.commit()
        db.close()
        return jsonify({"success": True, "collection_id": new_id})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/collections/<int:collection_id>', methods=['PUT'])
def update_collection(collection_id):
    try:
        data = request.get_json()
        allowed = ['title', 'description', 'shared_with', 'privacy_status']
        fields = {k: v for k, v in data.items() if k in allowed and v}
        if not fields:
            return jsonify({"success": False, "error": "No valid fields to update."}), 400
        set_clause = ", ".join(f"{k} = %s" for k in fields)
        values = list(fields.values()) + [collection_id]
        db = get_db()
        cursor = db.cursor()
        cursor.execute(f"UPDATE RECIPE_COLLECTION SET {set_clause} WHERE collection_id = %s", values)
        db.commit()
        db.close()
        return jsonify({"success": True, "affectedRows": cursor.rowcount})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/collections/<int:collection_id>', methods=['DELETE'])
def delete_collection(collection_id):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("DELETE FROM RECIPE_COLLECTION WHERE collection_id = %s", (collection_id,))
        db.commit()
        db.close()
        return jsonify({"success": True, "affectedRows": cursor.rowcount})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    
@app.route('/api/collections', methods=['GET'])
def get_collections():
    try:
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({"success": False, "error": "user_id is required"}), 400
        db = get_db()
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT * FROM RECIPE_COLLECTION WHERE user_id = %s", (user_id,))
        collections = cursor.fetchall()
        return jsonify({"success": True, "collections": collections})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        db.close()

# ──────────────────────────────────────────────
# COLLECTION_RECIPE
# ──────────────────────────────────────────────
@app.route('/api/collection_recipe', methods=['POST'])
def insert_collection_recipe():
    try:
        data = request.get_json()
        db = get_db()
        cursor = db.cursor()
        cursor.execute(
            "INSERT INTO COLLECTION_RECIPE (collection_id, recipe_id, added_at) VALUES (%s, %s, CURDATE())",
            (data['collection_id'], data['recipe_id'])
        )
        db.commit()
        db.close()
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/collection_recipe/<int:collection_id>/<int:recipe_id>', methods=['DELETE'])
def delete_collection_recipe(collection_id, recipe_id):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute(
            "DELETE FROM COLLECTION_RECIPE WHERE collection_id = %s AND recipe_id = %s",
            (collection_id, recipe_id)
        )
        db.commit()
        db.close()
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    

@app.route('/api/collection_recipe/<int:collection_id>/recipes', methods=['GET'])
def get_collection_recipes(collection_id):
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)
        cursor.execute("""
            SELECT r.* FROM RECIPE r
            JOIN COLLECTION_RECIPE cr ON r.recipe_id = cr.recipe_id
            WHERE cr.collection_id = %s
            ORDER BY cr.added_at DESC
        """, (collection_id,))
        recipes = cursor.fetchall()
        db.close()
        return jsonify({"success": True, "recipes": recipes})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    


# ──────────────────────────────────────────────
# RECIPE_INGREDIENT (composite key)
# ──────────────────────────────────────────────

@app.route('/api/recipe-ingredients', methods=['POST'])
def insert_recipe_ingredient():
    try:
        data = request.get_json()
        db = get_db()
        cursor = db.cursor()
        cursor.execute(
            "INSERT INTO RECIPE_INGREDIENT (recipe_id, ingredient_id, quantity, unit) VALUES (%s, %s, %s, %s)",
            (data['recipe_id'], data['ingredient_id'], data.get('quantity'), data.get('unit'))
        )
        db.commit()
        db.close()
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/recipe-ingredients/<int:recipe_id>/<int:ingredient_id>', methods=['PUT'])
def update_recipe_ingredient(recipe_id, ingredient_id):
    try:
        data = request.get_json()
        allowed = ['quantity', 'unit']
        fields = {k: v for k, v in data.items() if k in allowed and v is not None and v != ''}
        if not fields:
            return jsonify({"success": False, "error": "No valid fields to update."}), 400
        set_clause = ", ".join(f"{k} = %s" for k in fields)
        values = list(fields.values()) + [recipe_id, ingredient_id]
        db = get_db()
        cursor = db.cursor()
        cursor.execute(
            f"UPDATE RECIPE_INGREDIENT SET {set_clause} WHERE recipe_id = %s AND ingredient_id = %s",
            values
        )
        db.commit()
        db.close()
        return jsonify({"success": True, "affectedRows": cursor.rowcount})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/recipe-ingredients/<int:recipe_id>/<int:ingredient_id>', methods=['DELETE'])
def delete_recipe_ingredient(recipe_id, ingredient_id):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute(
            "DELETE FROM RECIPE_INGREDIENT WHERE recipe_id = %s AND ingredient_id = %s",
            (recipe_id, ingredient_id)
        )
        db.commit()
        db.close()
        return jsonify({"success": True, "affectedRows": cursor.rowcount})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ──────────────────────────────────────────────
# LEGACY: raw query endpoint (keep for flexibility)
# ──────────────────────────────────────────────

@app.route('/api/query', methods=['POST'])
def run_query():
    try:
        data = request.get_json()
        query = data.get('query')
        db = get_db()
        cursor = db.cursor()
        cursor.execute(query)
        if query.strip().lower().startswith(("select", "describe", "show")):
            columns = [desc[0] for desc in cursor.description]
            rows = cursor.fetchall()
            db.close()
            return jsonify({"success": True, "columns": columns, "rows": rows})
        else:
            db.commit()
            affected = cursor.rowcount
            db.close()
            return jsonify({"success": True, "affectedRows": affected})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)