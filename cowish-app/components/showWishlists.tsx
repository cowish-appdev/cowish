import { router } from 'expo-router';
import { FlatList, Pressable} from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';


const sampleWishlists = [
  { id: '1', name: 'Birthday Gifts', owner: 'Alice' },
  { id: '2', name: 'Travel Essentials', owner: 'Bob' },
  { id: '3', name: 'Home Decor', owner: 'Charlie' },
  { id: '4', name: 'what', owner: 'me' },
  { id: '5', name: 'am', owner: 'myself' },
];

export default function WishlistsPage() {
  const renderWishlist = ({ item }: { item: typeof sampleWishlists[0] }) => (
    <Pressable
      onPress={() => router.push(`/wishlist/${item.id}` as any)}
      style={{
        marginBottom: 12,
        padding: 16,
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
        width:'100%',
        marginInlineEnd:30
      }}
    >
      <ThemedText darkColor='black' style={{ fontSize: 18, fontWeight: '600' }}>{item.name}</ThemedText>
      <ThemedText style={{ color: 'gray', marginTop: 4 }}>Owner: {item.owner}</ThemedText>
    </Pressable>
  );

  return (
    <ThemedView style={{ flex: 1, width:'80%'}}>
      <FlatList
        data={sampleWishlists}
        keyExtractor={(item) => item.id}
        renderItem={renderWishlist}
        contentContainerStyle={{paddingRight: 16}}
      />
    </ThemedView>
  );
}
