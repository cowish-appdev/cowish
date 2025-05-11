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