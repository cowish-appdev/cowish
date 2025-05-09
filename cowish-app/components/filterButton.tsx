import { useState } from 'react';
import { View, Pressable, Text } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';

const filters = ['All', 'Friends', 'Family', 'Coworkers', 'Significant Other'];

export default function FilterTabs() {
  const [selected, setSelected] = useState('All');

  return (
    <ThemedView style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 16, padding:5}}>
      {filters.map((filter) => (
        <Pressable
          key={filter}
          onPress={() => setSelected(filter)}
          style={{
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
            backgroundColor: selected === filter ? '#4F46E5' : '#E5E7EB',
            marginHorizontal: 4,
          }}
        >
          <ThemedText style={{ color: selected === filter ? 'white' : 'black', fontWeight: '500' }}>
            {filter}
          </ThemedText>
        </Pressable>
      ))}
    </ThemedView>
  );
}
