from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
from dotenv import load_dotenv
import os
import uuid

load_dotenv()

app = Flask(__name__)
CORS(app)

def get_db():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"),
        port=os.getenv("DB_PORT")
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
        cursor.execute(
            "INSERT INTO USER (username, email, password, role) VALUES (%s, %s, %s, %s)",
            (data['username'], data['email'], data['password'], data['role'])
        )
        db.commit()
        new_id = cursor.lastrowid
        db.close()
        return jsonify({"success": True, "user_id": new_id})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    try:
        data = request.get_json()
        allowed = ['username', 'email', 'role']
        fields = {k: v for k, v in data.items() if k in allowed and v}
        if not fields:
            return jsonify({"success": False, "error": "No valid fields to update."}), 400
        set_clause = ", ".join(f"{k} = %s" for k in fields)
        values = list(fields.values()) + [user_id]
        db = get_db()
        cursor = db.cursor()
        cursor.execute(f"UPDATE USER SET {set_clause} WHERE user_id = %s", values)
        db.commit()
        db.close()
        return jsonify({"success": True, "affectedRows": cursor.rowcount})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/users/<int:user_id>', methods=['DELETE'])
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


# ──────────────────────────────────────────────
# RECIPES
# ──────────────────────────────────────────────

@app.route('/api/recipes', methods=['POST'])
def insert_recipe():
    try:
        data = request.get_json()
        db = get_db()
        cursor = db.cursor()
        new_id = str(uuid.uuid4())[:8]  # Generate a short unique ID for the recipe
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
        if recipes:
            return jsonify({"success": True, "recipes": recipes})
        else:
            return jsonify({"success": False, "error": "Recipe not found."}), 404
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


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

@app.route('/api/ingredients', methods=['POST'])
def insert_ingredient():
    try:
        data = request.get_json()
        db = get_db()
        cursor = db.cursor()
        cursor.execute(
            "INSERT INTO INGREDIENT (name, description) VALUES (%s, %s)",
            (data['name'], data.get('description'))
        )
        db.commit()
        new_id = cursor.lastrowid
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

@app.route('/api/reviews', methods=['POST'])
def insert_review():
    try:
        data = request.get_json()
        db = get_db()
        cursor = db.cursor()
        cursor.execute(
            "INSERT INTO REVIEW (recipe_id, user_id, comment, rating) VALUES (%s, %s, %s, %s)",
            (data['recipe_id'], data['user_id'], data.get('comment'), data.get('rating'))
        )
        db.commit()
        new_id = cursor.lastrowid
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
        cursor.execute(
            "INSERT INTO CATEGORY (name, description) VALUES (%s, %s)",
            (data['name'], data.get('description'))
        )
        db.commit()
        new_id = cursor.lastrowid
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

@app.route('/api/dietary-flags', methods=['POST'])
def insert_dietary_flag():
    try:
        data = request.get_json()
        db = get_db()
        cursor = db.cursor()
        cursor.execute(
            "INSERT INTO DIETARYFLAG (name, description) VALUES (%s, %s)",
            (data['name'], data.get('description'))
        )
        db.commit()
        new_id = cursor.lastrowid
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
        cursor.execute(f"UPDATE DIETARYFLAG SET {set_clause} WHERE flag_id = %s", values)
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
        cursor.execute("DELETE FROM DIETARYFLAG WHERE flag_id = %s", (flag_id,))
        db.commit()
        db.close()
        return jsonify({"success": True, "affectedRows": cursor.rowcount})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ──────────────────────────────────────────────
# CUISINES
# ──────────────────────────────────────────────

@app.route('/api/cuisines', methods=['POST'])
def insert_cuisine():
    try:
        data = request.get_json()
        db = get_db()
        cursor = db.cursor()
        cursor.execute(
            "INSERT INTO CUISINE (name, description) VALUES (%s, %s)",
            (data['name'], data.get('description'))
        )
        db.commit()
        new_id = cursor.lastrowid
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
        cursor.execute(
            """INSERT INTO RECIPECOLLECTION (user_id, title, description, shared_with, privacy_status)
               VALUES (%s, %s, %s, %s, %s)""",
            (data['user_id'], data['title'], data.get('description'),
             data.get('shared_with'), data.get('privacy_status', 'private'))
        )
        db.commit()
        new_id = cursor.lastrowid
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
        cursor.execute(f"UPDATE RECIPECOLLECTION SET {set_clause} WHERE collection_id = %s", values)
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
        cursor.execute("DELETE FROM RECIPECOLLECTION WHERE collection_id = %s", (collection_id,))
        db.commit()
        db.close()
        return jsonify({"success": True, "affectedRows": cursor.rowcount})
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
    app.run(port=5000, debug=True)