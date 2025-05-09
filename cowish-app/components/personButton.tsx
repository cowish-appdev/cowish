import React, {useState} from 'react';
import {ThemedView} from '@/components/ThemedView';
import {Pressable, StyleSheet } from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { ThemedText } from './ThemedText';
import { useRouter } from 'expo-router';

interface PersonButtonProps {
    onPress: () => void;
    backgroundColor?: string;
    iconColor?: string;
    size?: number;
  }
export function PersonButton({ onPress, backgroundColor = '#7EC8E3', iconColor = 'white', size = 200 }:PersonButtonProps) {
    const router = useRouter();
    return (
        <ThemedView style = {styles.wrapper}>
            <Pressable
            style={[styles.button, { backgroundColor, width: size, height: size }]}
            onPress={()=> router.push('/individual-wishlists')}
            >
                <Fontisto name="person" size={size * 0.5} color={iconColor} />
            </Pressable>
            <ThemedText style = {styles.label}>Individual Wish Lists</ThemedText>
        </ThemedView>
    );
}
export function PeopleButton({ onPress, backgroundColor = '#7EC8E3', iconColor = 'white', size = 200 }:PersonButtonProps) {
    const router = useRouter();
    return (
        <ThemedView style = {styles.wrapper}>
            <Pressable
            style={[styles.button, { backgroundColor, width: size, height: size }]}
            onPress={()=> router.push('/group-wishlists')}
            >
                <Fontisto name="persons" size={size * 0.5} color={iconColor} />
            </Pressable>
            <ThemedText style = {styles.label}>Group Wish Lists</ThemedText>
        </ThemedView>
    );
  }
  
  const styles = StyleSheet.create({
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 15,
    },
    wrapper:{
      margin:20,
      alignItems: 'center',
    },
    label:{
        alignItems:'center',
        margin:5,
    }
  });