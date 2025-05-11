import psycopg2
from flask import Flask, request, jsonify
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
# Database connection parameters
DB_HOST = 'yamabiko.proxy.rlwy.net'
DB_PORT = '11814'
DB_NAME = 'railway'
DB_USER = 'postgres'
DB_PASSWORD = 'ydPuEVyxHqnueTxpTIqgXTRInvobUVBZ'
DATABASE_URL = 'postgresql://postgres:ydPuEVyxHqnueTxpTIqgXTRInvobUVBZ@yamabiko.proxy.rlwy.net:11814/railway'

# Function to connect to the PostgreSQL database
def get_db_connection():
    return psycopg2.connect(DATABASE_URL)
@app.route('/test-db')
def test_db_connection():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT NOW();')
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        return jsonify({'status':'success','time':result[0].isoformat()})
    except Exception as e:
        return jsonify({'status':'error','error':str(e)})

# Get all users
@app.route('/users', methods=['GET'])
def get_all_users():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users;')
    users = cursor.fetchall()
    cursor.close()
    conn.close()

    users_list = [
        {
            'uuid': user[0],
            'username': user[1],
            'email': user[2],
            'code': user[3],
            'create_at': user[4],
            'update_at': user[5],
            'profile_pic': user[6]
        }
        for user in users
    ]
    return jsonify(users_list)


# Get a single user by UUID
@app.route('/users/<string:uuid>', methods=['GET'])
def get_user(uuid):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE uuid = %s;', (uuid,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if user:
        return jsonify({
            'uuid': user[0],
            'username': user[1],
            'email': user[2],
            'code': user[3],
            'create_at': user[4],
            'update_at': user[5],
            'profile_pic': user[6]
        })
    return jsonify({'error': 'User not found'}), 404
# Get a single user by code
@app.route('/users/code/<string:code>', methods=['GET'])
def get_user_by_code(code):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE code = %s;', (code,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if user:
        user_data = {
            'uuid': user[0],
            'username': user[1],
            'email': user[2],
            'code': user[3],
            'create_at': user[4],
            'update_at': user[5],
            'profile_pic': user[6]
        }
        return jsonify(user_data)
    else:
        return jsonify({'error': 'User not found'}), 404
    
import random
import string

def generate_unique_code(length=6):
    """Generate a random 6-character alphanumeric code."""
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))

@app.route('/users', methods=['POST'])
def create_users():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request body must not be empty"}), 400

    users = [data] if isinstance(data, dict) else data if isinstance(data, list) else None
    if users is None:
        return jsonify({"error": "Invalid input format"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    inserted_users = []
    existing_users = []

    for user in users:
        uuid = user.get('uuid')
        username = user.get('username')
        email = user.get('email')
        profile_pic = user.get('profile_pic')

        if not uuid or not username or not email:
            return jsonify({"error": "uuid, username, and email are required"}), 400

        # Check if user exists
        cursor.execute("SELECT uuid, username, email, code, create_at, update_at, profile_pic FROM users WHERE uuid = %s", (uuid,))
        existing_user = cursor.fetchone()

        if existing_user:
            user_data = {
                "uuid": existing_user[0],
                "username": existing_user[1],
                "email": existing_user[2],
                "code": existing_user[3],
                "create_at": existing_user[4],
                "update_at": existing_user[5],
                "profile_pic": existing_user[6],
            }

            if isinstance(data, dict):  # single user request
                cursor.close()
                conn.close()
                return jsonify({"message": "User already exists", "user": user_data}), 200
            else:
                existing_users.append(user_data)
                continue

        # Generate unique 6-character code
        while True:
            code = generate_unique_code()
            cursor.execute("SELECT 1 FROM users WHERE code = %s", (code,))
            if not cursor.fetchone():
                break

        cursor.execute(
            '''
            INSERT INTO users (uuid, username, email, code, profile_pic)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING uuid;
            ''',
            (uuid, username, email, code, profile_pic)
        )
        inserted_users.append(cursor.fetchone()[0])

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({
        "inserted_users": inserted_users,
        "existing_users": existing_users if existing_users else None
    }), 201


# Update user
@app.route('/users/<string:uuid>', methods=['PUT'])
def update_user(uuid):
    data = request.get_json()

    # Only allow updates for 'username' and 'profile_pic'
    allowed_keys = {'username', 'profile_pic'}
    invalid_keys = set(data.keys()) - allowed_keys

    if invalid_keys:
        return jsonify({
            'error': 'Only username and profile_pic can be updated',
            'invalid_fields': list(invalid_keys)
        }), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE uuid = %s;', (uuid,))
    user = cursor.fetchone()

    if not user:
        cursor.close()
        conn.close()
        return jsonify({'error': 'User not found'}), 404

    username = data.get('username', user[1])
    profile_pic = data.get('profile_pic', user[5])

    cursor.execute(
        '''
        UPDATE users
        SET username = %s, profile_pic = %s, update_at = NOW()
        WHERE uuid = %s;
        ''',
        (username, profile_pic, uuid)
    )
    conn.commit()

    # Fetch updated user
    cursor.execute('SELECT uuid, username, email, code, profile_pic, create_at, update_at FROM users WHERE uuid = %s;', (uuid,))
    updated_user = cursor.fetchone()

    cursor.close()
    conn.close()

    return jsonify({
        'message': 'User updated successfully',
        'updated_user': {
            'uuid': updated_user[0],
            'username': updated_user[1],
            'email': updated_user[2],
            'code': updated_user[3],
            'profile_pic': updated_user[4],
            'create_at': updated_user[5],
            'update_at': updated_user[6],
        }
    }), 200


# Delete a user
@app.route('/users/<string:uuid>', methods=['DELETE'])
def delete_user(uuid):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM users WHERE uuid = %s;', (uuid,))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({'message': 'User deleted successfully'})
#Delete all users
@app.route('/users', methods=['DELETE'])
def delete_all_users():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM users;')
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'All users have been deleted'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Get all groups
@app.route('/groups', methods=['GET'])
def get_groups():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM groups;')
    groups = cursor.fetchall()
    cursor.close()
    conn.close()

    group_list = [
        {
            'id': g[0],
            'name': g[1],
            'created_at': g[2],
            'profile_pic': g[3]
        } for g in groups
    ]
    return jsonify(group_list)

# get a single group by ID
@app.route('/groups/<string:group_id>', methods=['GET'])
def get_group(group_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM groups WHERE id = %s;', (group_id,))
    group = cursor.fetchone()
    cursor.close()
    conn.close()

    if group:
        return jsonify({
            'id': group[0],
            'name': group[1],
            'created_at': group[2],
            'profile_pic': group[3]
        })
    return jsonify({'error': 'Group not found'}), 404

# Create a new group
import random
import string
def generate_group_id():
    return 'g' + ''.join(random.choices(string.ascii_letters + string.digits, k=6))
@app.route('/groups', methods=['POST'])
def create_groups():
    data = request.get_json()

    # Ensure the data is a list of groups
    if not isinstance(data, list):
        return jsonify({"error": "Request body must be a list of groups"}), 400

    # Check if each group has a name (profile_pic is optional)
    for group in data:
        if 'name' not in group:
            return jsonify({"error": "Group name is required for all groups"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    created_groups = []

    # Try generating a unique ID and inserting each group
    for group in data:
        name = group['name']
        profile_pic = group.get('profile_pic', None)

        # Generate a unique ID for each group
        for _ in range(10):  # limit attempts to avoid infinite loop
            group_id = generate_group_id()
            cursor.execute('SELECT 1 FROM groups WHERE id = %s;', (group_id,))
            if not cursor.fetchone():
                break
        else:
            cursor.close()
            conn.close()
            return jsonify({"error": "Failed to generate unique group ID"}), 500

        try:
            # Insert the group into the database
            cursor.execute(
                '''
                INSERT INTO groups (id, name, profile_pic)
                VALUES (%s, %s, %s);
                ''',
                (group_id, name, profile_pic)
            )
            created_groups.append({
                'id': group_id,
                'name': name,
                'profile_pic': profile_pic
            })
        except psycopg2.Error as e:
            conn.rollback()
            return jsonify({'error': str(e)}), 500

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({'message': 'Groups created successfully', 'created_groups': created_groups}), 201

# Update a group
@app.route('/groups/<string:id>', methods=['PUT'])
def update_group(id):
    data = request.get_json()

    # Only allow updates for 'name' and 'profile_pic'
    allowed_keys = ['name', 'profile_pic']
    
    # Check if any other keys are in the request data
    invalid_keys = [key for key in data.keys() if key not in allowed_keys]
    
    if invalid_keys:
        return jsonify({'error': f"Invalid keys: {', '.join(invalid_keys)}. Only 'name' and 'profile_pic' can be updated."}), 400

    name = data.get('name')
    profile_pic = data.get('profile_pic')

    # Connect to the database
    conn = get_db_connection()
    cursor = conn.cursor()

    # Check if group exists
    cursor.execute('SELECT * FROM groups WHERE id = %s;', (id,))
    group = cursor.fetchone()

    if not group:
        return jsonify({'error': 'Group not found'}), 404

    # Update the group details
    cursor.execute(
        '''
        UPDATE groups
        SET name = %s, profile_pic = %s, created_at = NOW()
        WHERE id = %s;
        ''',
        (name, profile_pic, id)
    )

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({'message': 'Group updated successfully'})

# Delete a group
@app.route('/groups', methods=['DELETE'])
def delete_all_groups():
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('DELETE FROM groups;')
        conn.commit()
        return jsonify({'message': 'All groups deleted successfully'})
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

#Create group_members
@app.route('/group_members', methods=['POST'])
def add_users_to_group():
    data = request.get_json()

    # If it's a single object
    if isinstance(data, dict):
        data = [data]  # Convert single entry to a list for uniform processing

    if not all('group_id' in entry and 'user_id' in entry for entry in data):
        return jsonify({"error": "Each entry must have 'group_id' and 'user_id'"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    # Prepare for batch insertions
    insert_values = []
    for entry in data:
        group_id = entry.get('group_id')
        user_id = entry.get('user_id')

        # Check if the group exists
        cursor.execute('SELECT * FROM groups WHERE id = %s;', (group_id,))
        group = cursor.fetchone()
        if not group:
            cursor.close()
            conn.close()
            return jsonify({"error": f"Group {group_id} not found"}), 404

        # Check if the user exists
        cursor.execute('SELECT * FROM users WHERE uuid = %s;', (user_id,))
        user = cursor.fetchone()
        if not user:
            cursor.close()
            conn.close()
            return jsonify({"error": f"User {user_id} not found"}), 404

        # Prepare data for insertion
        insert_values.append((group_id, user_id))

    # Insert data into group_members table
    try:
        cursor.executemany('''
            INSERT INTO group_members (group_id, user_id)
            VALUES (%s, %s);
        ''', insert_values)
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "Users added to the group(s) successfully"}), 201
    except Exception as e:
        cursor.close()
        conn.close()
        return jsonify({"error": str(e)}), 500

# input group_id and get all users in that group
@app.route('/group_members/inputgroup_id/<string:group_id>', methods=['GET'])
def get_users_in_group(group_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Query to get all user_ids for the given group_id
    cursor.execute('''
        SELECT user_id 
        FROM group_members 
        WHERE group_id = %s;
    ''', (group_id,))
    
    users = cursor.fetchall()
    
    cursor.close()
    conn.close()

    if not users:
        return jsonify({'error': 'No users found for the given group_id'}), 404

    # Extracting the user_ids from the result
    user_ids = [user[0] for user in users]

    return jsonify({'group_id': group_id, 'user_ids': user_ids})

# input user_id and get all groups that user is in
@app.route('/group_members/inputuser_id/<string:user_id>', methods=['GET'])
def get_groups_for_user(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT group_id FROM group_members WHERE user_id = %s;', (user_id,))
    groups = cursor.fetchall()
    cursor.close()
    conn.close()

    if groups:
        return jsonify({'user_id': user_id, 'groups': [group[0] for group in groups]})
    else:
        return jsonify({'error': 'No groups found for this user ID'}), 404


# Create User-owned wishlists
@app.route('/wishlists/user', methods=['POST'])
def create_user_wishlists():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    is_list = isinstance(data, list)
    wishlists = data if is_list else [data]

    for item in wishlists:
        if not item.get('title') or not item.get('owner_user_id'):
            return jsonify({"error": "Each wishlist must include title and owner_user_id"}), 400
        if item.get('owner_group_id'):
            return jsonify({"error": "owner_group_id must be null for user-owned wishlists"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    inserted_ids = []

    for item in wishlists:
        cursor.execute(
            '''
            INSERT INTO wishlists (title, description, owner_user_id)
            VALUES (%s, %s, %s) RETURNING id;
            ''',
            (
                item.get('title'),
                item.get('description'),
                item.get('owner_user_id')
            )
        )
        inserted_ids.append(cursor.fetchone()[0])

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({
        "message": "User-owned wishlist(s) created successfully",
        "wishlist_ids": inserted_ids
    }), 201

# Create Group-owned wishlists
@app.route('/wishlists/group', methods=['POST'])
def create_group_wishlists():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    is_list = isinstance(data, list)
    wishlists = data if is_list else [data]

    for item in wishlists:
        if not item.get('title') or not item.get('owner_group_id'):
            return jsonify({"error": "Each wishlist must include title and owner_group_id"}), 400
        if item.get('owner_user_id'):
            return jsonify({"error": "owner_user_id must be null for group-owned wishlists"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    inserted_ids = []

    for item in wishlists:
        cursor.execute(
            '''
            INSERT INTO wishlists (title, description, owner_group_id)
            VALUES (%s, %s, %s) RETURNING id;
            ''',
            (
                item.get('title'),
                item.get('description'),
                item.get('owner_group_id')
            )
        )
        inserted_ids.append(cursor.fetchone()[0])

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({
        "message": "Group-owned wishlist(s) created successfully",
        "wishlist_ids": inserted_ids
    }), 201

# Get all wishlists

@app.route('/wishlists', methods=['GET'])
def get_all_wishlists():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM wishlists;')  # Query to fetch all wishlists
    wishlists = cursor.fetchall()
    cursor.close()
    conn.close()

    if not wishlists:
        return jsonify({'error': 'No wishlists found'}), 404

    wishlists_list = [
        {
            'id': wishlist[0],
            'title': wishlist[1],
            'description': wishlist[2],
            'owner_user_id': wishlist[3],
            'owner_group_id': wishlist[4],
            
        }
        for wishlist in wishlists
    ]
    
    return jsonify(wishlists_list)

# Get wishlist by owner_user_id
@app.route('/wishlists/user/<string:user_id>', methods=['GET'])
def get_user_wishlists(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        '''
        SELECT * FROM wishlists WHERE owner_user_id = %s;
        ''',
        (user_id,)
    )
    wishlists = cursor.fetchall()
    cursor.close()
    conn.close()

    if wishlists:
        return jsonify([
            {
                'id': wishlist[0],
                'title': wishlist[1],
                'description': wishlist[2],
                'owner_user_id': wishlist[3],
                'owner_group_id': wishlist[4],
        
            }
            for wishlist in wishlists
        ])
    else:
        return jsonify({"error": "No wishlists found for this user"}), 404


# Get wishlist owner_group_id


@app.route('/wishlists/group/<string:group_id>', methods=['GET'])
def get_group_wishlists(group_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        '''
        SELECT * FROM wishlists WHERE owner_group_id = %s;
        ''',
        (group_id,)
    )
    wishlists = cursor.fetchall()
    cursor.close()
    conn.close()

    if wishlists:
        return jsonify([
            {
                'id': wishlist[0],
                'title': wishlist[1],
                'description': wishlist[2],
                'owner_user_id': wishlist[3],
                'owner_group_id': wishlist[4],
            
            }
            for wishlist in wishlists
        ])
    else:
        return jsonify({"error": "No wishlists found for this group"}), 404



#create wishlist_items
@app.route("/wishlists_items", methods=["POST"])
def create_wishlists_items():
    data = request.get_json()

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # Ensure it's a list for unified processing
        items = data if isinstance(data, list) else [data]

        for item in items:
            wishlist_id = item.get("wishlist_id")
            name = item.get("name")
            description = item.get("description", None)
            url = item.get("url", None)
            completed = item.get("completed")

            if not all([wishlist_id, name, completed is not None]):
                return jsonify({"error": "Missing required fields"}), 400

            cur.execute(
                """
                INSERT INTO wishlists_items (wishlist_id, name, description, url, completed)
                VALUES (%s, %s, %s, %s, %s)
                """,
                (wishlist_id, name, description, url, completed)
            )

        conn.commit()
        cur.close()
        conn.close()

        return jsonify({"message": f"{len(items)} item(s) added to wishlists_items"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

#get all wishlists_items
@app.route("/wishlists_items", methods=["GET"])
def get_all_wishlists_items():
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("SELECT * FROM wishlists_items")
        items = cur.fetchall()

        columns = [desc[0] for desc in cur.description]
        results = [dict(zip(columns, row)) for row in items]

        cur.close()
        conn.close()

        return jsonify(results), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get a single wishlist item by ID
@app.route("/wishlists_items/item/<int:item_id>", methods=["GET"])
def get_wishlist_item_by_id(item_id):
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("SELECT * FROM wishlists_items WHERE item_id = %s", (item_id,))
        row = cur.fetchone()

        if row is None:
            return jsonify({"error": "Item not found"}), 404

        columns = [desc[0] for desc in cur.description]
        result = dict(zip(columns, row))

        cur.close()
        conn.close()

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

#get wishlists_items by wishlist_id
@app.route("/wishlists_items/wishlist/<int:wishlist_id>", methods=["GET"])
def get_items_by_wishlist_id(wishlist_id):
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("SELECT * FROM wishlists_items WHERE wishlist_id = %s", (wishlist_id,))
        items = cur.fetchall()

        columns = [desc[0] for desc in cur.description]
        results = [dict(zip(columns, row)) for row in items]

        cur.close()
        conn.close()

        return jsonify(results), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


#updated name and description of wishlist_items based on item_id
@app.route("/wishlists_items/<int:item_id>", methods=["PUT"])
def update_wishlist_item(item_id):
    data = request.get_json()

    name = data.get("name")
    description = data.get("description")

    if name is None and description is None:
        return jsonify({"error": "At least one of 'name' or 'description' must be provided"}), 400

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        update_fields = []
        update_values = []

        if name is not None:
            update_fields.append("name = %s")
            update_values.append(name)
        if description is not None:
            update_fields.append("description = %s")
            update_values.append(description)

        update_values.append(item_id)

        query = f"""
            UPDATE wishlists_items
            SET {', '.join(update_fields)}
            WHERE item_id = %s
            RETURNING *;
        """

        cur.execute(query, update_values)
        updated_item = cur.fetchone()

        if updated_item is None:
            return jsonify({"error": "Item not found"}), 404

        columns = [desc[0] for desc in cur.description]
        result = dict(zip(columns, updated_item))

        conn.commit()
        cur.close()
        conn.close()

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

#Delete wishlists_items based on item_id
@app.route("/wishlists_items/<int:item_id>", methods=["DELETE"])
def delete_wishlist_item(item_id):
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # Check if the item exists
        cur.execute("SELECT * FROM wishlists_items WHERE item_id = %s;", (item_id,))
        item = cur.fetchone()

        if item is None:
            return jsonify({"error": "Item not found"}), 404

        # Delete the item
        cur.execute("DELETE FROM wishlists_items WHERE item_id = %s;", (item_id,))
        conn.commit()

        cur.close()
        conn.close()

        return jsonify({"message": f"Item with item_id {item_id} has been deleted."}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


#Create relationships
@app.route('/relationships', methods=['POST'])
def create_relationships():
    data = request.get_json()

    if isinstance(data, dict):
        data = [data]

    valid_tags = ['friend', 'family', 'coworker', 'significant-other']
    inserted = []

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        for entry in data:
            user_id1 = entry.get('user_id1')
            user_id2 = entry.get('user_id2')
            tag = entry.get('tag')

            if not user_id1 or not user_id2 or not tag:
                return jsonify({'error': 'user_id1, user_id2, and tag are required'}), 400

            if tag not in valid_tags:
                return jsonify({'error': f"Invalid tag. Must be one of {valid_tags}"}), 400

            if user_id1 == user_id2:
                return jsonify({'error': 'user_id1 and user_id2 must be different'}), 400

            cur.execute("""
                INSERT INTO relationship (user_id1, user_id2, tag)
                VALUES (%s, %s, %s)
                ON CONFLICT DO NOTHING
                RETURNING user_id1, user_id2, tag, created_at;
            """, (user_id1, user_id2, tag))

            result = cur.fetchone()
            if result:
                inserted.append({
                    'user_id1': result[0],
                    'user_id2': result[1],
                    'tag': result[2],
                    'created_at': result[3]
                })

        conn.commit()
        return jsonify({'inserted': inserted}), 201

    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500

    finally:
        cur.close()
        conn.close()

# Get relationships by user_id1
@app.route('/relationships/user/<user_id1>', methods=['GET'])
def get_relationships_by_user_id1(user_id1):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT user_id2, tag, created_at
            FROM relationship
            WHERE user_id1 = %s
        """, (user_id1,))
        rows = cur.fetchall()
        cur.close()
        conn.close()

        relationships = []
        for row in rows:
            relationships.append({
                "user_id2": row[0],
                "tag": row[1],
                "created_at": row[2]
            })

        return jsonify(relationships), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run the app
if __name__ == '__main__':
    app.run(debug=True)

