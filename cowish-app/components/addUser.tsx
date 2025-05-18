
export default function addUser(uuid:string,username:string, email:string,profile_pic:string){
    const addUser = async(uuid:string,username:string, email:string,profile_pic:string)=>{
        try {
            const response = await fetch(`http://127.0.0.1:5000/users`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({
                    uuid:uuid,
                    username:username,
                    email:email,
                    profile_pic:profile_pic
                })
            })
            console.log(response.ok)
            if(!response.ok){
                throw new Error('Network responser was not ok');
            }
            const data = await response.json();
            console.log(data)
            console.log("user ",data.users[0])
            return data.users[0];
        }catch(error){
            console.error('Fetch user failed: ',error);
            throw error;
        }
    }
    return addUser(uuid,username,email,profile_pic)
}