export default function getGroupWishlistInfo(group_id: string,setGroupWishlistInfo:Function){
    const getGroupWishlistInfo = async(group_id: string,setGroupWishlistInfo:Function)=>{
        try {
            const response = await fetch(`http://127.0.0.1:5000/${group_id}/details`,{
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                },
            })
            console.log(response.ok)
            if(!response.ok){
                const errorText = await response.text();  // This shows the server error
                console.error("Error response from server:", errorText);
                throw new Error('Network responser was not ok');
            }
            const data = await response.json();
            console.log(data)
            const sortedData = {
                ...data,
                wishlists: (data.wishlists ?? [])
    .           slice()
                .sort((a: any, b: any) => (b.id ?? 0) - (a.id ?? 0))
                .map((wishlist: any) => ({
                ...wishlist,
                id: String(wishlist.id),
                items: (wishlist.items ?? [])
                .slice()
                .sort((a: any, b: any) => (b.id ?? 0) - (a.id ?? 0))
                .map((item:any)=>({
                    ...item,
                    id:String(item.id)
                }))
                })),
            };
            setGroupWishlistInfo(sortedData);
        }catch(error){
            console.error('Fetch user failed: ',error);
            throw error;
        }
    }
    getGroupWishlistInfo(group_id, setGroupWishlistInfo)
}