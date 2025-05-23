
export default function addRelationship(user1:string,user2:string,tag:string){
    const addRelationship = async(user1:string,user2:string, tag:string)=>{
        try {
            const response = await fetch(`http://127.0.0.1:5000/relationships`,
                {
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify({
                        user_id1:user1,
                        user_id2:user2,
                        tag:tag,
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
    addRelationship(user1,user2,tag)
}