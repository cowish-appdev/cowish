import psycopg2
import psycopg2.extras
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
app = Flask(__name__)
CORS(app)
# Database connection parameters
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")


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
        return jsonify({'response':{
            'uuid': user[0],
            'username': user[1],
            'email': user[2],
            'code': user[3],
            'create_at': user[4],
            'update_at': user[5],
            'profile_pic': user[6]
        }})
    return jsonify({'error': 'User not found','response':None}), 200
@app.route('/get-users-wishlist-info',methods=["POST"])
def users_wishlist_info():
    data = request.get_json()
    print(data)
    print(len(data))
    print(isinstance(data,list))
    if not isinstance(data, list) or len(data)==0:
        return jsonify({"message":"No UUIDs provided", "result":[]}),200
    uuid_tag_map = {entry["friend_id"]: entry["tag"] for entry in data if "friend_id" in entry and "tag" in entry}
    uuid_list = list(uuid_tag_map.keys())
    if len(uuid_list)==0:
        return jsonify({"error":"Invalid input format"}),400
    conn = get_db_connection()
    with conn.cursor(cursor_factory = psycopg2.extras.DictCursor) as cursor:
        sql = """SELECT
    u.uuid AS friend_id,
    u.username,
    u.profile_pic,
    w.id AS wishlist_id,
    (
        SELECT COUNT(*)
        FROM wishlists_items wi
        WHERE wi.wishlist_id = w.id
    ) AS item_count
    FROM users u
    JOIN(
        SELECT DISTINCT ON (owner_user_id) *
        FROM wishlists
        ORDER BY owner_user_id, id ASC
    ) w ON w.owner_user_id = u.uuid
    WHERE u.uuid = ANY(%s)"""
        cursor.execute(sql, (uuid_list,))
        rows = cursor.fetchall()
        conn.commit()
        cursor.close()
        conn.close()
        results = []
        for row in rows:
            tag = uuid_tag_map.get(row["friend_id"],"")
            results.append({
            "friend_id": row["friend_id"],
            "username":row["username"],
            "profile_pic":row["profile_pic"],
            "wishlist_id": row["wishlist_id"],
            "item_count":row["item_count"],
            "tag":tag
            })
        if len(results) > 0:
            return jsonify({"result": results}),200
        else:
            return jsonify({"message":"No matching users found",
                        "result":[]},200)


    
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
#Create users  
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
    all_users=[]

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

            all_users.append(user_data)
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
            RETURNING uuid,username, email, code, create_at, update_at, profile_pic;
            ''',
            (uuid, username, email, code, profile_pic)
        )
        new_user = cursor.fetchone()
        user_data = {
            "uuid": new_user[0],
            "username": new_user[1],
            "email": new_user[2],
            "code": new_user[3],
            "create_at": new_user[4],
            "update_at": new_user[5],
            "profile_pic": new_user[6],
        }

        all_users.append(user_data)
    

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({
        "users": all_users,
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
#get groups by multiple IDS
@app.route('/groups/multiple',methods=['POST'])
def get_multiple_groups():
    data = request.get_json()
    if not data or not isinstance(data, list):
            return jsonify({'error': 'Expected a JSON array of group IDs'}), 400
    placeholders = ','.join(['%s'] * len(data))
    query = f"""
        SELECT g.id, g.name, g.created_at, g.profile_pic, COUNT(gm.user_id) as member_count
        FROM groups g
        LEFT JOIN group_members gm ON g.id = gm.group_id
        WHERE g.id IN ({placeholders})
        GROUP BY g.id
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(query, tuple(data))
    groups = cursor.fetchall()
    cursor.close()
    conn.close()

    result = [{
        'id': group[0],
        'name': group[1],
        'created_at': group[2],
        'profile_pic': group[3],
        'member_count':group[4]
    } for group in groups]
    return jsonify(result)

# get group info

@app.route('/<string:group_id>/details', methods=['GET'])
def get_group_details(group_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    # Fetch the group
    cursor.execute("""
        SELECT g.id, g.name, g.profile_pic, g.created_at,
            (SELECT COUNT(*) FROM group_members gm WHERE gm.group_id = g.id) AS member_count
        FROM groups g
        WHERE g.id = %s
    """, (group_id,))
    group = cursor.fetchone()

    if not group:
        cursor.close()
        conn.close()
        return jsonify({'error': 'Group not found'}), 404

    # Fetch all wishlists for the group
    cursor.execute("""
        SELECT id, title, description
        FROM wishlists
        WHERE owner_group_id = %s
    """, (group_id,))
    wishlists_raw = cursor.fetchall()

    wishlists = []
    for wl in wishlists_raw:
        wishlist_id = wl[0]

        # Fetch all items for this wishlist
        cursor.execute("""
            SELECT item_id, name, description, completed
            FROM wishlists_items
            WHERE wishlist_id = %s
        """, (wishlist_id,))
        items = [
            {"id": i[0], "name": i[1], "description": i[2],"completed":i[3]}
            for i in cursor.fetchall()
        ]

        wishlists.append({
            "id": wl[0],
            "title": wl[1],
            "description": wl[2],
            "items": items
        })

    cursor.close()
    conn.close()

    return jsonify({
        "id": group[0],
        "name": group[1],
        "profile_pic": group[2],
        "description": group[3],
        "memberCount": group[4],
        "wishlists": wishlists
    })



# Create a new group
import random
import string

def generate_group_id():
    return 'g' + ''.join(random.choices(string.ascii_letters + string.digits, k=6))

@app.route('/groups', methods=['POST'])
def create_groups():
    data = request.get_json()

    # Accept both single object and list
    if isinstance(data, dict):
        data = [data]
    elif not isinstance(data, list):
        return jsonify({"error": "Invalid request body format"}), 400

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
    invalid_keys = [key for key in data.keys() if key not in allowed_keys]

    if invalid_keys:
        return jsonify({
            'error': f"Invalid keys: {', '.join(invalid_keys)}. Only 'name' and 'profile_pic' can be updated."
        }), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    # Check if group exists
    cursor.execute('SELECT * FROM groups WHERE id = %s;', (id,))
    group = cursor.fetchone()

    if not group:
        cursor.close()
        conn.close()
        return jsonify({'error': 'Group not found'}), 404

    # Use existing values if not provided
    name = data.get('name', group[1])
    profile_pic = data.get('profile_pic', group[2])

    # Update group
    cursor.execute(
        '''
        UPDATE groups
        SET name = %s, profile_pic = %s, created_at = NOW()
        WHERE id = %s;
        ''',
        (name, profile_pic, id)
    )

    conn.commit()

    # Fetch updated group
    cursor.execute('SELECT * FROM groups WHERE id = %s;', (id,))
    updated_group = cursor.fetchone()

    cursor.close()
    conn.close()

    return jsonify({
        'message': 'Group updated successfully',
        'updated_group': {
            'id': updated_group[0],
            'name': updated_group[1],
            'profile_pic': updated_group[2],
            'created_at': updated_group[3]
        }
    })


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

    # Normalize to list
    if isinstance(data, dict):
        data = [data]

    # Validate input
    if not all('group_id' in entry and 'user_id' in entry for entry in data):
        return jsonify({"error": "Each entry must have 'group_id' and 'user_id'"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    insert_values = []
    inserted = []
    skipped = []

    for entry in data:
        group_id = entry['group_id']
        user_id = entry['user_id']

        # Check group exists
        cursor.execute('SELECT 1 FROM groups WHERE id = %s;', (group_id,))
        if not cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({"error": f"Group {group_id} not found"}), 404

        # Check user exists
        cursor.execute('SELECT 1 FROM users WHERE uuid = %s;', (user_id,))
        if not cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({"error": f"User {user_id} not found"}), 404

        # Check for existing entry
        cursor.execute('''
            SELECT 1 FROM group_members WHERE group_id = %s AND user_id = %s;
        ''', (group_id, user_id))
        if cursor.fetchone():
            skipped.append({"group_id": group_id, "user_id": user_id, "status": "already exists"})
        else:
            insert_values.append((group_id, user_id))
            inserted.append({"group_id": group_id, "user_id": user_id})

    try:
        if insert_values:
            cursor.executemany('''
                INSERT INTO group_members (group_id, user_id)
                VALUES (%s, %s);
            ''', insert_values)
            conn.commit()

        cursor.close()
        conn.close()

        return jsonify({
            "inserted": inserted,
            "skipped": skipped,
            "message": "Group members processed successfully"
        }), 201

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
    user_id = data.get("owner_user_id")
    is_list = isinstance(data, list)
    wishlists = data if is_list else [data]

    for item in wishlists:
        if not item.get('title') or not item.get('owner_user_id'):
            return jsonify({"error": "Each wishlist must include title and owner_user_id"}), 400
        if item.get('owner_group_id'):
            return jsonify({"error": "owner_group_id must be null for user-owned wishlists"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute('SELECT id FROM wishlists WHERE owner_user_id = %s',(user_id,))
    existing = cursor.fetchone()

    if existing:
        return jsonify({"wishlists": existing})
    
    inserted_data = []

    for item in wishlists:
        cursor.execute(
            '''
            INSERT INTO wishlists (title, description, owner_user_id)
            VALUES (%s, %s, %s)
            RETURNING id, title, description, owner_user_id, owner_group_id;
            ''',
            (
                item.get('title'),
                item.get('description'),
                item.get('owner_user_id')
            )
        )
        inserted_data.append(cursor.fetchone())

    conn.commit()
    cursor.close()
    conn.close()
    wishlist_json = [
    {
        "id": row[0],
        "title": row[1],
        "description": row[2],
        "owner_user_id": row[3],
        "owner_group_id": row[4]
    }
    for row in inserted_data
    ]
    return jsonify({
        "message": "User-owned wishlist(s) created successfully",
        "wishlists": wishlist_json
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
    inserted = []

    for item in wishlists:
        cursor.execute(
            '''
            INSERT INTO wishlists (title, description, owner_group_id)
            VALUES (%s, %s, %s)
            RETURNING id, title, description, owner_user_id, owner_group_id;
            ''',
            (
                item.get('title'),
                item.get('description'),
                item.get('owner_group_id')
            )
        )
        inserted.append(cursor.fetchone())

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({
        "message": "Group-owned wishlist(s) created successfully",
        "wishlists": [
            {
                "id": row[0],
                "title": row[1],
                "description": row[2],
                "owner_user_id": row[3],
                "owner_group_id": row[4]
            } for row in inserted
        ]
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
    wishlist = cursor.fetchone()
    cursor.close()
    conn.close()

    if wishlist:
        return jsonify(
            {'result': {
                'id': wishlist[0],
                'title': wishlist[1],
                'description': wishlist[2],
                'owner_user_id': wishlist[3],
                'owner_group_id': wishlist[4],
        
            }}
        ),200
    else:
        return jsonify({'result':None}), 200


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

# get wishlist by id
@app.route('/wishlists/wishlist/<string:wishlist_id>', methods=['GET'])
def get_wishlist_by_id(wishlist_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        '''
        SELECT * FROM wishlists WHERE id = %s;
        ''',
        (wishlist_id,)
    )
    wishlist = cursor.fetchone()
    cursor.close()
    conn.close()

    if wishlist:
        return jsonify(
            {
                'id': wishlist[0],
                'title': wishlist[1],
                'description': wishlist[2],
                'owner_user_id': wishlist[3],
                'owner_group_id': wishlist[4],
        
            }
        )
    else:
        return jsonify({"error": "No wishlists found for this user"}), 404
# Create wishlist_items
@app.route("/wishlists_items", methods=["POST"])
def create_wishlists_items():
    data = request.get_json()

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # Ensure it's a list for unified processing
        items = data if isinstance(data, list) else [data]

        inserted_items = []

        for item in items:
            wishlist_id = item.get("wishlist_id")
            name = item.get("name")
            description = item.get("description")
            url = item.get("url")
            completed = item.get("completed")

            if not wishlist_id or not name or completed is None:
                return jsonify({"error": "Each item must have 'wishlist_id', 'name', and 'completed'"}), 400

            cur.execute(
                """
                INSERT INTO wishlists_items (wishlist_id, name, description, url, completed)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING item_id;
                """,
                (wishlist_id, name, description, url, completed)
            )

            inserted_id = cur.fetchone()[0]
            inserted_items.append({
                "item_id": inserted_id,
                "wishlist_id": wishlist_id,
                "name": name,
                "description": description,
                "url": url,
                "completed": completed
            })

        conn.commit()
        cur.close()
        conn.close()

        return jsonify({
            "message": f"{len(inserted_items)} item(s) added to wishlists_items",
            "items": inserted_items
        }), 201

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

@app.route("/wishlists_items/itemid/<int:item_id>", methods=["PUT"])
def update_wishlist_item(item_id):
    data = request.get_json()

    name = data.get("name")
    description = data.get("description")
    completed = data.get("completed")

    if name is None and description is None and completed is None:
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
        if completed is not None:
            update_fields.append("completed = %s")
            update_values.append(completed)

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
            SELECT user_id2 AS friend_id, tag, created_at
            FROM relationship
            WHERE user_id1 = %s
        """, (user_id1,))
        rows = cur.fetchall()
        cur.close()
        conn.close()

        relationships = []
        for row in rows:
            relationships.append({
                "friend_id": row[0],
                "tag": row[1],
                "created_at": row[2]
            })

        return jsonify(relationships), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# delete relationship by user_id1
@app.route('/relationships/<user_id1>/<user_id2>', methods=['DELETE'])
def delete_relationships_by_user_id1(user_id1,user_id2):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT user_id2 AS friend_id, tag, created_at
            FROM relationship
            WHERE user_id1 = %s AND user_id2 = %s
        """, (user_id1,user_id2))
        rows = cur.fetchall()
        if not rows:
            cur.close()
            conn.close()
            return jsonify({"message":"relationship not found"}),200
        cur.execute("""DELETE FROM relationship WHERE user_id1 = %s AND user_id2 = %s""",(user_id1,user_id2))
        conn.commit()
        cur.close()
        conn.close()

        relationships = []
        for row in rows:
            relationships.append({
                "friend_id": row[0],
                "tag": row[1],
                "created_at": row[2]
            })

        return jsonify(relationships), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run the app
if __name__ == '__main__':
    app.run(debug=True)

