export default function getGroupByIds(ids:string[]|[],setGroups:Function){
    const getGroupByIds = async(ids:string[]|[],setGroups:Function)=>{
        try {
            const response = await fetch(`http://127.0.0.1:5000/groups/multiple`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify(
                    ids
                )
            })
            console.log(response.ok)

            if(!response.ok){
                throw new Error('Network responser was not ok');
            }
            const data = await response.json();
            console.log(data)
            setGroups(data);
            return data
        }catch(error){
            console.error('Fetch group failed: ',error);
            throw error;
        }
    }
    return getGroupByIds(ids,setGroups)
}