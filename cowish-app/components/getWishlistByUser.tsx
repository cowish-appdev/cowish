export default function getWishlistByUser(user_id:string){
    const getWishlistByUser = async(user_id:string)=>{
        try {
            const response = await fetch(`http://127.0.0.1:5000/wishlists/user/${user_id}`)
            console.log(response.ok)

            if(!response.ok){
                throw new Error('Network responser was not ok');
            }
            const data = await response.json();
            console.log(data.result)
            return data.result
        }catch(error){
            console.error('Fetch group failed: ',error);
            throw error;
        }
    }
    return getWishlistByUser(user_id)
}