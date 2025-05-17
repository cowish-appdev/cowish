import { useEffect, useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import FilterTabs from "@/components/filterButton";
import WishlistsPage from "@/components/showWishlists";
import { useUser } from "./_layout";
import { Friends } from "@/interface";
import getFriends from "@/components/getFriends";

export default function IndividualListPage() {
  const [filter, setFilter] = useState("All");
  const {userAcc, setUserAcc} = useUser();
  const [friends, setFriends] = useState<Friends[]|[]>([])
  const [loading, setLoading] = useState(false)
  useEffect(()=>{
    const fetch = async()=>{
      try{
        setLoading(true)
        await getFriends(userAcc?.uuid??'',setFriends)
        setTimeout(()=>{
          setLoading(false)
        },500)
      }catch(e){
        console.error('Error: ',e)
        setLoading(false)
      }
    }
    if (userAcc?.uuid){
      fetch()
    }
  },[userAcc])
  console.log("load",loading)
  console.log("friends: ", friends)
  if(loading){
    return <ThemedText>Loading...</ThemedText>
  }
  return (
    <ThemedView style={{ flex: 1 }}>
      <ThemedText style={{ fontSize: 24, margin: 30 }}>
        Your Friend's Wish Lists
      </ThemedText>

      <FilterTabs selected={filter} onSelect={setFilter} />

      <WishlistsPage filter={filter} friends = {friends} />
    </ThemedView>
  );
}
