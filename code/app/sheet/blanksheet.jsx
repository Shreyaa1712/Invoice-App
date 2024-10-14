import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { firebaseConfig } from '../../firebaseConfig';
import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Modal, Text, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useRouter } from 'expo-router';

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Custom Excel Sheet Component
function ExcelSheet({ data, setData, onSave }) {
  const handleInputChange = (text, rowIndex, colIndex) => {
    const newData = [...data];
    newData[rowIndex][colIndex] = text;
    setData(newData);
  };

  return (
    <View style={styles.sheetContainer}>
      <View style={styles.headerRow}>
        {['Column 1', 'Column 2', 'Column 3'].map((header, index) => (
          <Text key={index} style={styles.headerCell}>{header}</Text>
        ))}
      </View>
      {data.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((cell, colIndex) => (
            <TextInput
              key={colIndex}
              style={styles.cell}
              value={cell}
              onChangeText={(text) => handleInputChange(text, rowIndex, colIndex)}
            />
          ))}
        </View>
      ))}
      <TouchableOpacity style={styles.saveButton} onPress={() => onSave(data)}>
        <Text style={styles.saveButtonText}>Save to Firestore</Text>
      </TouchableOpacity>
    </View>
  );
}

// Main BlankSheet Component
export default function BlankSheet() {
  const router=useRouter();
  const { user } = useUser(); // Fetch the signed-in user's data from Clerk
  const [modalVisible, setModalVisible] = useState(false);
  const [showBlankSheet, setShowBlankSheet] = useState(false);
  const [data, setData] = useState([
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ]);

  const handleAddFile = () => {
    setShowBlankSheet(true);
  };

  const handleSaveToFirestore = async (data) => {
    try {
      // Convert the 2D array into an array of objects
      const convertedData = data.map((row) => {
        return row.reduce((acc, cell, colIndex) => {
          acc[`column${colIndex + 1}`] = cell;
          return acc;
        }, {});
      });

      // Get the user's email and name from Clerk
      const email = user.primaryEmailAddress?.emailAddress || 'unknown@example.com';
      const name = user.fullName || 'Anonymous';

      // Save the data to Firestore
      await setDoc(doc(db, 'sheets', 'sheet1'), {
        email: email,
        name: name,
        data: convertedData
      });

      alert('Data saved successfully!');
    } catch (error) {
      console.error('Error saving document: ', error);
      alert('Failed to save data');
    }
  };

  const handleOptionPress = (option) => {
    switch (option) {
      case 'Save':
        handleSaveToFirestore(data);
        break;
      case 'Save As':
        // Implement Save As functionality
        break;
      case 'Print':
        // Implement Print functionality
        break;
      case 'Email':
        // Implement Email functionality
        break;
      default:
        break;
    }
    setModalVisible(false);
  };

  return (
      
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { router.back() }}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sheet 1</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={handleAddFile}>
            <Ionicons name="add-circle-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { /* handle drawer action */ }}>
            <Ionicons name="folder-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { /* handle cloud save action */ }}>
            <Ionicons name="cloud-upload-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Excel Sheet */}
      {showBlankSheet && (
        <View style={styles.blankSheetContainer}>
          <ExcelSheet data={data} setData={setData} onSave={handleSaveToFirestore} />
        </View>
      )}

      {/* Floating Button */}
      <TouchableOpacity style={styles.floatingButton} onPress={() => setModalVisible(true)}>
        <Ionicons name="menu" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Footer Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalOption} onPress={() => handleOptionPress('Save')}>
              <Text style={styles.modalOptionText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={() => handleOptionPress('Save As')}>
              <Text style={styles.modalOptionText}>Save As</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={() => handleOptionPress('Print')}>
              <Text style={styles.modalOptionText}>Print</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={() => handleOptionPress('Email')}>
              <Text style={styles.modalOptionText}>Email</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>

  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b1b1b',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    backgroundColor: '#2a2a2a',
    padding: 10,
    borderRadius: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sheetContainer: {
    padding: 10,
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#444',
    padding: 8,
    borderRadius: 5,
  },
  headerCell: {
    flex: 1,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    marginVertical: 2,
  },
  cell: {
    borderWidth: 1,
    borderColor: '#444',
    padding: 8,
    flex: 1,
    color: '#fff',
    backgroundColor: '#1b1b1b',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    backgroundColor: '#6200ea',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalOptionText: {
    fontSize: 18,
  },
  cancelButton: {
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: '#f00',
    borderRadius: 10,
    marginTop: 20,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  blankSheetContainer: {
    flex: 1,
    marginTop: 20,
  },
  saveButton: {
    marginTop: 10,
    backgroundColor: '#6200ea',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
