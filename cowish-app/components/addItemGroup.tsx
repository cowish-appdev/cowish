
export default function addItemGroup(wishlist_id:string,name:string,description:string|null){
    const editSelfWishlist = async (wishlist_id:string,name:string,description:string|null) => {
        try {
          const updateFields = {
            wishlist_id: wishlist_id,
            name:name,
            description:description,
            completed: false,
          }
            
          const response = await fetch(`http://127.0.0.1:5000/wishlists_items`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateFields),
          });
      
          const result = await response.json();
          console.log("hello",result)
      
          if (response.ok) {
            return(result.inserted_items)
          } else {
            console.error('Error updating user:', result);
          }
      
        } catch (error) {
          console.error('Fetch error:', error);
        }
    }
    return editSelfWishlist(wishlist_id,name,description)

}