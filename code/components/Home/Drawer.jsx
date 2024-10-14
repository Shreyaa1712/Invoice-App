import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import AddFile from '../AddFile';

export default function Drawer() {
  return (
    <View style={styles.drawerContainer}>
      <AddFile />
      
      <View style={styles.sheetList}>
        <Text style={styles.sheetListTitle}>List of Sheets</Text>
        {/* TODO: Fetch lists from cloud and Firebase */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sheetList: {
    marginTop: 20,
  },
  sheetListTitle: {
    fontSize: 18,
    fontWeight: '500',
  },
});

// TODO: UI
