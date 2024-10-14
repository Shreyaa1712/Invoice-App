import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Feather } from "@expo/vector-icons";

import { View, Text, TouchableOpacity, StyleSheet, Modal, Animated } from 'react-native';

export default function AddFile() {
  const [modalVisible, setModalVisible] = useState(false);
  const [scaleValue] = useState(new Animated.Value(0));
  const router = useRouter();

  const handleAddPress = () => {
    setModalVisible(true);
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const handleBlankSheetPress = () => {
    setModalVisible(false);
    router.push('/sheet/blanksheet');
  };

  const handleInvoice1Press = () => {
    setModalVisible(false);
    router.push('/sheet/invoice1');
  };

  const handleInvoice2Press = () => {
    setModalVisible(false);
    router.push('/sheet/invoice2');
  };

  const handleCompany1Press = () => {
    setModalVisible(false);
    router.push('/sheet/company1');
  };

  const handleCompany2Press = () => {
    setModalVisible(false);
    router.push('/sheet/company2');
  };

  const handleCloseModal = () => {
    Animated.spring(scaleValue, {
      toValue: 0,
      friction: 5,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  return (
    <View style={styles.container}>
      {/* <TouchableOpacity style={styles.btn} onPress={handleAddPress}>
        <Text style={styles.btnText}>Add</Text>
      </TouchableOpacity> */}
      <TouchableOpacity
        style={styles.addButtonContainer}
        onPress= {
          handleAddPress
        }
      >
        <Feather name="plus-circle" size={30} color="#00b4d8" />
      </TouchableOpacity>

      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalContent,
              { transform: [{ scale: scaleValue }] },
            ]}
          >
            <Text style={styles.modalText}>Select an option:</Text>

            {/* Options for different routes */}
            <TouchableOpacity
              style={styles.modalBtn}
              onPress={handleBlankSheetPress}
              activeOpacity={0.7}
            >
              <Text style={styles.modalBtnText}>Blank Sheet</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalBtn}
              onPress={handleInvoice1Press}
              activeOpacity={0.7}
            >
              <Text style={styles.modalBtnText}>Invoice 1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalBtn}
              onPress={handleInvoice2Press}
              activeOpacity={0.7}
            >
              <Text style={styles.modalBtnText}>Invoice 2</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalBtn}
              onPress={handleCompany1Press}
              activeOpacity={0.7}
            >
              <Text style={styles.modalBtnText}>Company 1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalBtn}
              onPress={handleCompany2Press}
              activeOpacity={0.7}
            >
              <Text style={styles.modalBtnText}>Company 2</Text>
            </TouchableOpacity>

            {/* Cancel Button */}
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={handleCloseModal}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    backgroundColor: '#007bff', // Purple
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker overlay for contrast
  },
  modalContent: {
    backgroundColor: 'rgba(24, 24, 24, 0.8)', // Light black with transparency
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: 250,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
    color: '#FFFFFF', // White
  },
  modalBtn: {
    backgroundColor: '#8A4FFF', // Purple
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    width: 120,
  },
  cancelBtn: {
    backgroundColor: '#FFFFFF', // White
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    width: 120,
  },
  modalBtnText: {
    color: '#FFFFFF', // White
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelBtnText: {
    color: 'black', // Black
    fontSize: 16,
    fontWeight: 'bold',
  },
});
