import { useEffect, useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import FilterTabs from "@/components/filterButton";
import WishlistsPage from "@/components/showWishlists";
import { useUser } from "./_layout";
import { Friends, friend_wishlist_info } from "@/interface";
import getFriends from "@/components/getFriends";
import getFriendInfo from "@/components/getFriendInfo";

export default function IndividualListPage() {
  const [filter, setFilter] = useState("All");
  const {userAcc, setUserAcc} = useUser();
  const [friends, setFriends] = useState<Friends[]|[]>([])
  const [loading, setLoading] = useState(false)
  const [friends_info,setFriendsInfo] = useState<friend_wishlist_info[]|[]>([])
  
  useEffect(()=>{
    const fetch = async()=>{
      try{
        setLoading(true)
        const friend_list = await getFriends(userAcc?.uuid??'',setFriends)
        if(friend_list){
          await getFriendInfo(friend_list, setFriendsInfo)
        }
      }catch(e){
        console.error('Error: ',e)
      }finally{
        setLoading(false)
      }
    }
    if (userAcc?.uuid){
      fetch()
    }
  },[userAcc])
  console.log("fetched?",friends_info)
  if(loading){
    return <ThemedText>Loading...</ThemedText>
  }
  return (
    <ThemedView style={{ flex: 1 }}>
      <ThemedText style={{ fontSize: 24, margin: 30 }}>
        Your Friend's Wish Lists
      </ThemedText>

      <FilterTabs selected={filter} onSelect={setFilter} />

      <WishlistsPage filter={filter} friends = {friends_info} />
    </ThemedView>
  );
}
