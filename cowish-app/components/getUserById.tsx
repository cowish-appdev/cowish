
export default function getUserById(id:string){
    const getUserById = async(id:string)=>{
        try {
            const response = await fetch(`http://127.0.0.1:5000/users/${id}`)
            console.log(response.ok)
            if(!response.ok){
                throw new Error('Network responser was not ok');
            }
            const data = await response.json();
            console.log(data.response)
            return data.response
        }catch(error){
            console.error('Fetch user failed: ',error);
            throw error;
        }
    }
    return getUserById(id)
}