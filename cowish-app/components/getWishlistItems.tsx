
export default function getWishlistItems(wishlist_id:string,setItems:Function){
    const getWishlistItems = async(wishlist_id:string,setItems:Function)=>{
        try {
            const response = await fetch(`http://127.0.0.1:5000/wishlists_items/wishlist/${wishlist_id}`)
            console.log(response.ok)
            if(!response.ok){
                throw new Error('Network responser was not ok');
            }
            const data = await response.json();
            console.log("hey",data)
            setItems(data);
        }catch(error){
            console.error('Fetch group failed: ',error);
            throw error;
        }
    }
    getWishlistItems(wishlist_id,setItems)
}