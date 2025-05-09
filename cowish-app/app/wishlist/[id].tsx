// app/wishlist/[id].tsx
import { useLocalSearchParams } from 'expo-router';
import { TextInput,FlatList, StyleSheet,Pressable } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useState} from 'react';
import Checkbox from 'expo-checkbox';

const sampleWishlists = [
  { id: '1', name: 'Birthday Gifts', owner: 'Alice', items: ['Watch', 'Book', 'Perfume','Ipad','Phone','WaterBottle','headphones','t-shirt']},
  { id: '2', name: 'Travel Essentials', owner: 'Bob', items: ['Suitcase', 'Neck Pillow', 'Camera'] },
  { id: '3', name: 'Home Decor', owner: 'Charlie', items: ['Vase', 'Lamp', 'Wall Art'] },
  { id: '4', name: 'what', owner: 'me',items:['1','2','3','4']},
  { id: '5', name: 'am', owner: 'myself' ,items:['5','6','7','8']},
];

export default function WishlistDetailsPage() {
    const { id } = useLocalSearchParams();
  
    // Find the wishlist by ID
    const wishlist = sampleWishlists.find((w) => w.id === id);
  
    if (!wishlist) {
      return (
        <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ThemedText>Wishlist not found.</ThemedText>
        </ThemedView>
      );
    }
  
    const initialItems = wishlist.items.map((item, index) => ({
      id: String(index),
      name: item,
      checked: false,
      isEditing: false,
    }));
  
    const [items, setItems] = useState(initialItems);
  
    const toggleCheckbox = (id: string) => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, checked: !item.checked } : item
        )
      );
    };
  
    const toggleEdit = (id: string) => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, isEditing: true } : item
        )
      );
    };
  
    const handleChange = (id: string, newName: string) => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, name: newName } : item
        )
      );
    };
  
    const finishEditing = (id: string) => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, isEditing: false } : item
        )
      );
    };
  
    const renderItem = ({ item }: { item: typeof items[0] }) => (
      <ThemedView style={styles.itemContainer}>
        <Checkbox
          value={item.checked}
          onValueChange={() => toggleCheckbox(item.id)}
          style = {styles.checkbox}
        />
        {item.isEditing ? (
          <TextInput
            style={[styles.input, { flex: 1, marginLeft: 12 }]}
            value={item.name}
            autoFocus
            onChangeText={(text) => handleChange(item.id, text)}
            onBlur={() => finishEditing(item.id)}
          />
        ) : (
          <Pressable
            style={{ flex: 1, marginLeft:12}}
            onPress={() => toggleEdit(item.id)}
          >
            <ThemedText style={[styles.itemText, item.checked && { textDecorationLine: 'line-through', color: 'gray' }]}>
              {item.name}
            </ThemedText>
          </Pressable>
        )}
      </ThemedView>
    );
  
    return (
      <ThemedView style={{ flex: 1, padding: 16,width:'100%' }}>
        <ThemedText style={styles.title}>{wishlist.name}</ThemedText>
        <ThemedText style={styles.owner}>Owner: {wishlist.owner}</ThemedText>
  
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 16,width:'100%'}}
        />
      </ThemedView>
    );
  }
  
  const styles = StyleSheet.create({
    title: {
      fontSize: 24,
      fontWeight: '700',
      marginBottom: 8,
    },
    owner: {
      color: 'gray',
      marginBottom: 16,
    },
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F5F5F5',
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
      width:'80%',
      alignSelf:'center',
    },
    input: {
      fontSize: 16,
      padding: 8,
      backgroundColor: 'white',
      borderRadius: 6,
      borderColor: '#ddd',
      borderWidth: 0,
      flex:1
    },
    itemText: {
      fontSize: 16,
    },
    checkbox:{
        
    },
  });