
export default function joinGroup(group_id:string,user_id:string){
    const addRelationship = async(group_id:string,user_id:string)=>{
        try {
            const response = await fetch(`http://127.0.0.1:5000/group_members`,
                {
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify({
                        group_id:group_id,
                        user_id:user_id,
                    })
                })
            console.log(response.ok)
            if(!response.ok){
                throw new Error('Network responser was not ok');
            }
            const data = await response.json();
            console.log(data)
        }catch(error){
            console.error('Fetch user failed: ',error);
            throw error;
        }
    }
    addRelationship(group_id,user_id)
}