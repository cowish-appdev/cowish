export interface User {
    uuid: string;
    username: string;
    email: string;
    code: string;
    created_at: Date;
    update_at:Date;
    profile_pic: string|null;
}
export interface Groups{
    id: string;
    name: string;
    created_at: Date;
    profile_pic: string;
}
export interface Friends{
    friend_id: string;
    tag: string;
    created_at : Date
}
export interface friend_wishlist_info{
    friend_id: string;
    tag: string;
    username: string;
    profile_pic: string;
    wishlist_id:string;
    item_count: number;
}
export interface WishlistItems{
    item_id: string;
    wishlist_id: string;
    name: string;
    description: string;
    url: string;
    created_at: Date;
    completed: boolean;
    completed_at: Date;
}
export interface Wishlist{
    id: string;
    title: string;
    description:string;
    owner_user_id: string|null;
    owner_group_id: string|null;
}