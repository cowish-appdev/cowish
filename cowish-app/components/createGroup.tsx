import joinGroup from "./joinGroup";
export default function createGroup(name:string,picture:string,uuid:string){
    const createGroup = async(name:string,picture:string)=>{
        try {
            const response = await fetch(`http://127.0.0.1:5000/groups`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({
                    name:name,
                    profile_pic:picture
                })
            })
            console.log(response.ok)
            if(!response.ok){
                throw new Error('Network responser was not ok');
            }
            const data = await response.json();
            joinGroup(data.created_groups[0].id,uuid)
            return data
            
        }catch(error){
            console.error('Fetch user failed: ',error);
            throw error;
        }
    }
    return createGroup(name,picture)
}