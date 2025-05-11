
export default function updateProfile(uuid:string,username?:string|null,profile_pic?:string|null){
    const updateUser = async (uuid: string, username?: string | null, profile_pic?: string | null) => {
        try {
          const updateFields: Record<string, string> = {};
          if (username != null) updateFields.username = username;
          if (profile_pic != null) updateFields.profile_pic = profile_pic;
      
          if (Object.keys(updateFields).length === 0) {
            console.warn('Nothing to update');
            return;
          }
      
          const response = await fetch(`http://127.0.0.1:5000/users/${uuid}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateFields),
          });
      
          const result = await response.json();
          
      
          if (response.ok) {
            console.log('User updated:', result);
            return(result.updated_user)
          } else {
            console.error('Error updating user:', result);
          }
      
        } catch (error) {
          console.error('Fetch error:', error);
        }
    }
    return updateUser(uuid,username,profile_pic)

}