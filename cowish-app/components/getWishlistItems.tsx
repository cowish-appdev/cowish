
export default function getWishlistItems(wishlist_id:string){
    const getWishlistItems = async(wishlist_id:string)=>{
        try {
            const response = await fetch(`http://127.0.0.1:5000/wishlists_items/wishlist/${wishlist_id}`)
            console.log(response.ok)
            if(!response.ok){
                throw new Error('Network responser was not ok');
            }
            const data = await response.json();
            console.log("hey",data)
            const finalData = data.map((item:any) => ({
                  ...item,
                  item_id: String(item.item_id)  // Convert item_id to string
              }));
            return finalData;
        }catch(error){
            console.error('Fetch group failed: ',error);
            return []
        }
    }
    return getWishlistItems(wishlist_id)
}