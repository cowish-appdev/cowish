
export default function getGroupByCode(code:string,setGroup:Function){
    const getGroupByCode = async(code:string,setGroup:Function)=>{
        try {
            const response = await fetch(`http://127.0.0.1:5000/groups/${code}`)
            console.log(response.ok)
            if(!response.ok){
                throw new Error('Network responser was not ok');
            }
            const data = await response.json();
            console.log(data)
            setGroup(data);
        }catch(error){
            console.error('Fetch group failed: ',error);
            throw error;
        }
    }
    getGroupByCode(code,setGroup)
}