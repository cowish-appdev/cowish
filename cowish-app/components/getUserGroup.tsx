export default function getUserGroup(user_id:string,setGroups:Function){
    const getUserGroup = async(user_id:string,setGroups:Function)=>{
        try {
            const response = await fetch(`http://127.0.0.1:5000/group_members/inputuser_id/${user_id}`)
            console.log(response.ok)

            if(!response.ok){
                throw new Error('Network responser was not ok');
            }
            const data = await response.json();
            console.log(data)
            setGroups(data.groups);
            return data.groups
        }catch(error){
            console.error('Fetch group failed: ',error);
            throw error;
        }
    }
    return getUserGroup(user_id,setGroups)
}