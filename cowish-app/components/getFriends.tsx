
export default function getFriends(user_uuid:string,setFriends:Function){
    const getFriends = async(user_uuid:string,setFriends:Function)=>{
        try {
            const response = await fetch(`http://127.0.0.1:5000/relationships/user/${user_uuid}`)
            console.log(response.ok)
            if(!response.ok){
                return [];
            }
            const data = await response.json();
            console.log(data)
            setFriends(data);
            return data;
        }catch(error){
            console.error('Fetch group failed: ',error);
            throw error;
        }
    }
    return getFriends(user_uuid,setFriends)
}