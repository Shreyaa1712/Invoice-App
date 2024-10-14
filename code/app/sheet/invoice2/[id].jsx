import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Button,
  Alert,
  TouchableOpacity,
} from "react-native";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { useUser } from "@clerk/clerk-expo";
import { firebaseConfig } from "../../../firebaseConfig";

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Invoice() {
  // State for invoice data
  const [invoiceNumber, setInvoiceNumber] = useState("1");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [invoicename, setInvoicename] = useState("New Invoice2");
  const [billTo, setBillTo] = useState({
    name: "",
    address: "",
    cityStateZip: "",
    phone: "",
  });
  const [from, setFrom] = useState({
    name: "",
    address: "",
    cityStateZip: "",
    phone: "",
  });
  const [items, setItems] = useState([
    { description: "", hours: "", rate: "", amount: "" },
  ]);
  const [total, setTotal] = useState("0.00");

  // Function to calculate the total amount
  const calculateTotal = () => {
    const totalAmount = items.reduce((acc, item) => {
      const itemAmount =
        parseFloat(item.hours || 0) * parseFloat(item.rate || 0);
      return acc + itemAmount;
    }, 0);
    setTotal(totalAmount.toFixed(2));
  };

  // Function to update line items
  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    if (field === "hours" || field === "rate") {
      const hours = parseFloat(newItems[index].hours || 0);
      const rate = parseFloat(newItems[index].rate || 0);
      newItems[index].amount = (hours * rate).toFixed(2);
    }

    setItems(newItems);
    calculateTotal();
  };

  // Function to add a new item
  const addItem = () => {
    setItems([...items, { description: "", hours: "", rate: "", amount: "" }]);
  };

  // Function to remove an item
  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    calculateTotal();
  };

  // Function to save data to Firestore
  const { user } = useUser();

  const saveToFirestore = async () => {
    try {
      const emailid =
        user.primaryEmailAddress?.emailAddress || "unknown@example.com";
      const uname = user.fullName || "Anonymous";
      const invoiceData = {
        invoiceNumber,
        invoiceDate,
        invoicename,
        billTo,
        from,
        items,
        total,
      };

      const docRef = doc(db, "invoice2", invoiceNumber); // Use a unique identifier (invoiceNumber) for the document ID
      await setDoc(docRef, {
        email: emailid,
        name: invoicename,
        data: invoiceData,
      });

      Alert.alert("Success", "Invoice data saved successfully!");
    } catch (error) {
      console.error("Error saving data to Firestore: ", error);
      Alert.alert("Error", "Failed to save data.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>INVOICE</Text>

      <View style={styles.row}>
        <Text style={styles.label}>FILE NAME:</Text>
        <TextInput
          style={styles.input}
          value={invoicename}
          onChangeText={setInvoicename}
          placeholder="File Name"
        />
      </View>

      {/* Invoice Header */}
      <View style={styles.row}>
        <Text style={styles.label}>INVOICE # :</Text>
        <TextInput
          style={styles.input}
          value={invoiceNumber}
          onChangeText={setInvoiceNumber}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>INVOICE DATE:</Text>
        <TextInput
          style={styles.input}
          value={invoiceDate}
          onChangeText={setInvoiceDate}
          placeholder="MM/DD/YYYY"
        />
      </View>

      {/* Billing Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>BILL TO:</Text>
        <TextInput
          style={styles.input}
          placeholder="[Name]"
          value={billTo.name}
          onChangeText={(text) => setBillTo({ ...billTo, name: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="[Street Address]"
          value={billTo.address}
          onChangeText={(text) => setBillTo({ ...billTo, address: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="[City, State, Zip]"
          value={billTo.cityStateZip}
          onChangeText={(text) => setBillTo({ ...billTo, cityStateZip: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone:"
          value={billTo.phone}
          onChangeText={(text) => setBillTo({ ...billTo, phone: text })}
        />
      </View>

      {/* Sender Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>FROM:</Text>
        <TextInput
          style={styles.input}
          placeholder="[Name]"
          value={from.name}
          onChangeText={(text) => setFrom({ ...from, name: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="[Street Address]"
          value={from.address}
          onChangeText={(text) => setFrom({ ...from, address: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="[City, State, Zip]"
          value={from.cityStateZip}
          onChangeText={(text) => setFrom({ ...from, cityStateZip: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone:"
          value={from.phone}
          onChangeText={(text) => setFrom({ ...from, phone: text })}
        />
      </View>

      {/* Invoice Items */}
      <View style={styles.itemsHeader}>
        <Text style={styles.itemsHeaderText}>Description</Text>
        <Text style={styles.itemsHeaderText}>Hours</Text>
        <Text style={styles.itemsHeaderText}>Rate</Text>
        <Text style={styles.itemsHeaderText}>Amount</Text>
      </View>

      {items.map((item, index) => (
        <View key={index} style={styles.itemRow}>
          <TextInput
            style={styles.itemInput}
            placeholder="Description"
            value={item.description}
            onChangeText={(text) => updateItem(index, "description", text)}
          />
          <TextInput
            style={styles.itemInput}
            placeholder="Hours"
            value={item.hours}
            keyboardType="numeric"
            onChangeText={(text) => updateItem(index, "hours", text)}
          />
          <TextInput
            style={styles.itemInput}
            placeholder="Rate"
            value={item.rate}
            keyboardType="numeric"
            onChangeText={(text) => updateItem(index, "rate", text)}
          />
          <Text style={styles.itemAmount}>{item.amount}</Text>
          <TouchableOpacity onPress={() => removeItem(index)}>
            <Text style={styles.removeButton}>Remove</Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Add Item Button */}
      <View style={styles.addButtonContainer}>
        <TouchableOpacity onPress={addItem} style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add Item</Text>
        </TouchableOpacity>
      </View>

      {/* Total */}
      <View style={styles.row}>
        <Text style={styles.totalLabel}>TOTAL</Text>
        <Text style={styles.totalValue}>{total}</Text>
      </View>

      {/* Save Button */}
      <View style={styles.row}>
        <Button title="Save to Firestore" onPress={saveToFirestore} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#000",
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  itemsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  itemsHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
    width: "22%", // Adjust width to fit layout
    textAlign: "center",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    alignItems: "center",
  },
  itemInput: {
    borderBottomWidth: 1,
    borderColor: "#000",
    flex: 1,
    marginHorizontal: 5,
    fontSize: 16,
    textAlign: "center",
  },
  itemAmount: {
    width: "20%",
    textAlign: "center",
    fontSize: 16,
    paddingVertical: 10,
  },
  removeButton: {
    color: "red",
    fontSize: 16,
    marginLeft: 10,
  },
  addButton: {
    color: "blue",
    fontSize: 16,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: "blue",
    fontSize: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
});