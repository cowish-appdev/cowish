import { User } from "@/interface";
export default function createWishlistUser(user:User){
    const createWishlistUser = async(user:User)=>{
        try {
            const response = await fetch(`http://127.0.0.1:5000/wishlists/user`,
                {
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify({
                        owner_user_id:user.uuid,
                        title:`${user.username}'s Wish List`,
                        description:'-',
                    })
                })
            console.log(response.ok)
            if(!response.ok){
                throw new Error('Network responser was not ok');
            }
            const data = await response.json();
            console.log("test",data.wishlists[0])
            return data.wishlists[0];
        }catch(error){
            console.error('Fetch user failed: ',error);
            throw error;
        }
    }
    return createWishlistUser(user)
}