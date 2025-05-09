import WishlistsPage from "@/components/showWishlists";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { router } from 'expo-router';
import FilterTabs from '@/components/filterButton';

export default function individualListPage(){
    return(
        <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ThemedText style={{ fontSize: 24 ,margin:30}}>Your Friend's Wish Lists</ThemedText>
            <FilterTabs/>
            <WishlistsPage/>
        </ThemedView>
    )
}