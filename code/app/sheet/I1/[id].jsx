import React, { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { firebaseConfig } from "../../../firebaseConfig";
import { initializeApp } from "firebase/app";
import {
  collection,
  query,
  where,
  getDocs,
  getFirestore,
  getDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useUser } from "@clerk/clerk-expo";

export default function Page() {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const { id } = useLocalSearchParams();
  console.log("yeh hai id", id);

  const [data, setData] = useState(null);

  // State for invoice data
  const [invoiceNumber, setInvoiceNumber] = useState("1");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [invoicename, setInvoicename] = useState("New Invoice1");
  const type = "i1";
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
  const [items, setItems] = useState([{ description: "", amount: "" }]);
  const [total, setTotal] = useState("0.00");

  const fetchData = async () => {
    if (id) {
      console.log("Getting data for ID:", id);
      const docRef = doc(db, "invoice1", id.toString());

      try {
        const document = await getDoc(docRef); // Fetch from server and cache

        if (document.exists()) {
          console.log("Document data:", document.data());
          const fetchedData = document.data().data;

          // Populate the state with the fetched data
          setInvoiceNumber(fetchedData.invoiceNumber);
          setInvoiceDate(fetchedData.invoiceDate);
          setInvoicename(fetchedData.invoicename);
          setBillTo(fetchedData.billTo);
          setItems(fetchedData.items);
          setFrom(fetchedData.from);
          setTotal(fetchedData.total);
        } else {
          console.log("No such document exists.");
        }
      } catch (e) {
        console.log("Error getting document:", e);
      }
    } else {
      console.log("Invalid ID");
    }
  };

  useEffect(() => {
    fetchData(); // Call fetchData when the component mounts
  }, [id]); // Add id as a dependency to refetch if id changes

  // Function to calculate total
  const calculateTotal = () => {
    const totalAmount = items.reduce((acc, item) => {
      const amount = parseFloat(item.amount) || 0;
      return acc + amount;
    }, 0);
    setTotal(totalAmount.toFixed(2));
  };

  // Function to update items
  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
    calculateTotal();
  };

  // Function to add new item
  const addItem = () => {
    setItems([...items, { description: "", amount: "" }]);
  };

  // Function to remove item
  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    calculateTotal();
  };

  const { user } = useUser();
  const timestamp = Date.now();
  const TimeRef = timestamp.toString();

  // Function to save data to Firestore
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

      await setDoc(doc(db, "invoice1", id), {
        email: emailid,
        name: invoicename,
        data: invoiceData,
        id: id,
        type: "i1",
      });

      Alert.alert("Success", "Invoice saved to Firestore!");
    } catch (error) {
      console.error("Error saving invoice to Firestore: ", error);
      Alert.alert("Error", "Failed to save invoice");
    }
  };

  // Function to add new item
 

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>File Name:</Text>
        <TextInput
          style={styles.input}
          value={invoicename}
          onChangeText={setInvoicename}
          placeholder="File name"
        />
      </View>
      <Text style={styles.title}>INVOICE</Text>

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
            placeholder="Amount"
            value={item.amount}
            keyboardType="numeric"
            onChangeText={(text) => updateItem(index, "amount", text)}
          />
          <Text style={styles.removeButton} onPress={() => removeItem(index)}>
            Remove
          </Text>
        </View>
      ))}

      <Text style={styles.addButton} onPress={addItem}>
        Add Item
      </Text>

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
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  itemInput: {
    borderBottomWidth: 1,
    borderColor: "#000",
    flex: 1,
    marginHorizontal: 5,
    fontSize: 16,
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
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
