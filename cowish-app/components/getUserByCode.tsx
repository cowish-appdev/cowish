
export default function getUserByCode(code:string,setUser:Function){
    const getUserByCode = async(code:string,setUser:Function)=>{
        try {
            const response = await fetch(`http://127.0.0.1:5000/users/code/${code}`)
            console.log(response.ok)
            if(!response.ok){
                throw new Error('Network responser was not ok');
            }
            const data = await response.json();
            console.log(data)
            setUser(data);
        }catch(error){
            console.error('Fetch user failed: ',error);
            throw error;
        }
    }
    getUserByCode(code,setUser)
}