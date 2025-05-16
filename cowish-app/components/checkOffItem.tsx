
export default function checkOffItem(id:string,current_state:boolean){
    const checkOffItem = async (id:string, current_state:boolean) => {
        try {
          const updateFields = {
            completed: !current_state,
          }
            
          const response = await fetch(`http://127.0.0.1:5000/wishlists_items/itemid/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateFields),
          });
      
          const result = await response.json();
          
      
          if (response.ok) {
            console.log('Item updated:', result);
            return(result.updated_item)
          } else {
            console.error('Error updating user:', result);
          }
      
        } catch (error) {
          console.error('Fetch error:', error);
        }
    }
    return checkOffItem(id, current_state)

}