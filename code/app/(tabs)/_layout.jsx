import { View, Text } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#000', // Set background to black
        },
        tabBarActiveTintColor: '#8A4FFF', // Active color
        tabBarInactiveTintColor: '#fff', // Inactive color
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="page"
        options={{
          tabBarLabel: "Currency Convertor",
          tabBarIcon: ({ color }) => <Ionicons name="cash-outline" size={24} color={color} />,
        }} />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
        }}
       />
       
    </Tabs>
  );
}
