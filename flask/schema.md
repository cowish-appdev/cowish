# 📚 Wishlist App Database Schema
 * means Primary Key
## 1. users
uuid     text*  not null (This value will be from firebase)
username text not null (Also from firebase)
email    text not null (Also from firebase)
code     varchar(6) not null (6 characters, unique)
create_at timestamp default now
update_at timestamp default now
profile_pic text (link or path)

## 2. groups

id varchar(7)* not null (7 characters, unique)
name text not null
created_at timestamp default now
profile_pic text 
----id starts with 'g'-----

## 3. group_members

group_id varchar(7) from groups(id) not null
user_id  text       from users(uuid) not null
(group_id, user_id)*

## 4. wishlists

id    serial* not null
title text    not null
description text
owner_user_id text from users(uuid)
owner_group_id varchar(7) from groups(id)

---one of the owners must be null---

## 5. wishlists_items
item_id     serial* not null
wishlist_id serial not null
name        text not null
description text 
url         text 
create_at   timestamp default now()
completed   boolean not null
completed_at    timestamp default now()

## 6. relationship
user_id1    text  from users(uuid) not null
user_id2    text  from users(uuis) not null
tag         text  not null
created_at  timestamp default now()
(user_id1,user_id2)*

# 🛠 Notes

- tag can only be of 4 values['friend','family','coworker', 'significant-other']
- (user_id1,user_id2) != (user_id2,user_id1) 
- `created_at` and `updated_at` are automatically set.
- Backend must ensure only one ownership (user or group) per wishlist.

