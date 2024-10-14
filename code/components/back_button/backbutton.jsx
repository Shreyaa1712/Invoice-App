import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Make sure this is installed

// Make sure to import the navigation hook if you are using React Navigation
import { useNavigation } from '@react-navigation/native';

export default function BackButton() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute', // Position the button absolutely to the top left
    top: 10,
    left: 10,
    zIndex: 1, // Make sure the button is on top of other components
  },
  button: {
    backgroundColor: 'transparent', // Transparent background
    padding: 10,
  },
});
