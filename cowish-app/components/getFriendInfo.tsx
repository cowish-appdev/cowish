import { Friends } from "@/interface";
export default function getFriendInfo(friends: Friends[]|[],setFriendsInfo:Function){
    const getFriendInfo = async(friends: Friends[]|[],setFriendsInfo:Function)=>{
        console.log("Sending:", JSON.stringify(friends,null,2))
        try {
            const response = await fetch(`http://127.0.0.1:5000/get-users-wishlist-info`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify(
                    friends
                )
            })
            console.log(response.ok)
            if(!response.ok){
                const errorText = await response.text();  // This shows the server error
                console.error("Error response from server:", errorText);
                throw new Error('Network responser was not ok');
            }
            const data = await response.json();
            setFriendsInfo(data);
        }catch(error){
            console.error('Fetch user failed: ',error);
            throw error;
        }
    }
    getFriendInfo(friends, setFriendsInfo)
}