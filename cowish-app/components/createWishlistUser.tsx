import { User } from "@/interface";
export default function createWishlistUser(user:User,setWishlist:Function){
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
            setWishlist(data.wishlists)
            console.log(data)
        }catch(error){
            console.error('Fetch user failed: ',error);
            throw error;
        }
    }
    createWishlistUser(user)
}