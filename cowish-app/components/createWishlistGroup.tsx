export default function createWishlistGroup(group_id: string,name:string,description:string|null){
    const createWishlistGroup = async(group_id: string,name:string,description:string|null)=>{
        try {
            const response = await fetch(`http://127.0.0.1:5000/wishlists/group`,
                {
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify({
                        owner_group_id:group_id,
                        title:name,
                        description:description,
                    })
                })
            console.log(response.ok)
            if(!response.ok){
                throw new Error('Network responser was not ok');
            }
            const data = await response.json();
            return data.wishlists[0]
            console.log(data)
        }catch(error){
            console.error('Fetch user failed: ',error);
            throw error;
        }
    }
    return createWishlistGroup(group_id,name,description)
}