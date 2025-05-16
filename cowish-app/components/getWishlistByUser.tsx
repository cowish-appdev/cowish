export default function getWishlistByUser(user_id:string,setWishlist:Function){
    const getWishlistByUser = async(user_id:string,setWishlist:Function)=>{
        try {
            const response = await fetch(`http://127.0.0.1:5000/wishlists/user/${user_id}`)
            console.log(response.ok)

            if(!response.ok){
                setWishlist(null)
                throw new Error('Network responser was not ok');
            }
            const data = await response.json();
            console.log(data)
            setWishlist(data?? null);
        }catch(error){
            console.error('Fetch group failed: ',error);
            throw error;
        }
    }
    getWishlistByUser(user_id,setWishlist)
}