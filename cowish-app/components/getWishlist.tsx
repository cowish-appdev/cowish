export default function getWishlist(wishlist_id:string,setWishlist:Function){
    const getWishlist = async(wishlist_id:string,setWishlist:Function)=>{
        try {
            const response = await fetch(`http://127.0.0.1:5000/wishlists/wishlist/${wishlist_id}`)
            console.log(response.ok)

            if(!response.ok){
                throw new Error('Network responser was not ok');
            }
            const data = await response.json();
            console.log(data)
            setWishlist(data);
        }catch(error){
            console.error('Fetch group failed: ',error);
            throw error;
        }
    }
    getWishlist(wishlist_id,setWishlist)
}