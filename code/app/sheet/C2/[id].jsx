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
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [invoicename, setInvoicename] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [companyInfo, setCompanyInfo] = useState({
    name: "",
    slogan: "",
    address: "",
    cityStateZip: "",
    phone: "",
    email: "",
  });
  const [clientInfo, setclientInfo] = useState({
    name: "",
    companyName: "",
    address: "",
    cityStateZip: "",
    phone: "",
  });
  const fetchData = async () => {
    if (id) {
      console.log("Getting data for ID:", id);
      const docRef = doc(db, "CompanyInvoice2", id.toString());

      try {
        const document = await getDoc(docRef); // Fetch from server and cache

        if (document.exists()) {
          console.log("Document data:", document.data());
          const fetchedData = document.data().data;

          // Populate the state with the fetched data
          setInvoiceNumber(fetchedData.invoiceNumber);
          setInvoiceDate(fetchedData.invoiceDate);
          setInvoicename(fetchedData.invoicename);
          setCompanyInfo(fetchedData.companyInfo);
          setContact(fetchedData.contact);
          setAddress(fetchedData.address);
          setclientInfo(fetchedData.clientInfo);
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

  const calculateAmounts = () => {
    const subtotalAmount = items.reduce(
      (acc, item) => acc + parseFloat(item.amount || 0),
      0
    );
    const calculatedTax = subtotalAmount * (parseFloat(taxRate) / 100);
    const totalAmount = subtotalAmount + calculatedTax + parseFloat(other || 0);

    setSubtotal(subtotalAmount.toFixed(2));
    setTax(calculatedTax.toFixed(2));
    setTotal(totalAmount.toFixed(2));
  };

  // Function to update line items
  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
    calculateAmounts();
  };

  const { user } = useUser();
  const timestamp = Date.now();
  const TimeRef = timestamp.toString();

  // Function to save data to Firestore

  // Function to add new item
  const addItem = () => {
    setItems([...items, { description: "", amount: "" }]);
  };

  // Function to remove item
  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    calculateAmounts(); // Corrected to calculateAmounts
  };

  const saveToFirestore = async () => {
    try {
      const emailid =
        user.primaryEmailAddress?.emailAddress || "unknown@example.com";
      const uname = user.fullName || "Anonymous";

      const data = {
        companyInfo,
        clientInfo,
        contact,
        address,
        invoiceNumber,
        invoiceDate,
        invoicename,
      };

      await setDoc(doc(db, "CompanyInvoice2", id), {
        email: emailid,
        name: invoicename,
        data: data,
        id: id,
        type: "ci2",
      });

      Alert.alert("Success", "Data saved successfully!");
    } catch (error) {
      console.error("Error saving data to Firestore: ", error);
      Alert.alert("Error", "Failed to save data.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Company Information Section */}
      <View style={styles.section}>
        <TextInput
          style={styles.companyName}
          placeholder="[Company Name]"
          value={companyInfo.name}
          onChangeText={(text) =>
            setCompanyInfo({ ...companyInfo, name: text })
          }
        />
        <TextInput
          style={styles.companySlogan}
          placeholder="[Company Slogan]"
          value={companyInfo.slogan}
          onChangeText={(text) =>
            setCompanyInfo({ ...companyInfo, slogan: text })
          }
        />
        <TextInput
          style={styles.input}
          placeholder="[Street Address]"
          value={companyInfo.address}
          onChangeText={(text) =>
            setCompanyInfo({ ...companyInfo, address: text })
          }
        />
        <TextInput
          style={styles.input}
          placeholder="[City, State, Zip]"
          value={companyInfo.cityStateZip}
          onChangeText={(text) =>
            setCompanyInfo({ ...companyInfo, cityStateZip: text })
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Phone:"
          value={companyInfo.phone}
          onChangeText={(text) =>
            setCompanyInfo({ ...companyInfo, phone: text })
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Email:"
          value={companyInfo.email}
          onChangeText={(text) =>
            setCompanyInfo({ ...companyInfo, email: text })
          }
        />
      </View>

      {/* Client Information Section */}
      <View style={styles.section}>
        <Text style={styles.label}>Client Information:</Text>
        <TextInput
          style={styles.input}
          placeholder="[Client Name]"
          value={clientInfo.name}
          onChangeText={(text) => setClientInfo({ ...clientInfo, name: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="[Client Company Name]"
          value={clientInfo.companyName}
          onChangeText={(text) =>
            setClientInfo({ ...clientInfo, companyName: text })
          }
        />
        <TextInput
          style={styles.input}
          placeholder="[Street Address]"
          value={clientInfo.address}
          onChangeText={(text) =>
            setClientInfo({ ...clientInfo, address: text })
          }
        />
        <TextInput
          style={styles.input}
          placeholder="[City, State, Zip]"
          value={clientInfo.cityStateZip}
          onChangeText={(text) =>
            setClientInfo({ ...clientInfo, cityStateZip: text })
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Phone:"
          value={clientInfo.phone}
          onChangeText={(text) => setClientInfo({ ...clientInfo, phone: text })}
        />
      </View>

      {/* Contact and Address Section */}
      <View style={styles.section}>
        <Text style={styles.label}>Contact:</Text>
        <TextInput
          style={styles.input}
          placeholder="[Contact Name]"
          value={contact}
          onChangeText={setContact}
        />
        <Text style={styles.label}>Address:</Text>
        <TextInput
          style={styles.input}
          placeholder="[Address]"
          value={address}
          onChangeText={setAddress}
        />
      </View>

      {/* Invoice Details Section */}
      <View>
        <Text style={styles.subLabel}>File Name:</Text>
        <TextInput
          style={styles.input}
          placeholder="File Name"
          value={invoicename}
          onChangeText={setInvoicename}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Invoice Details:</Text>
        <Text style={styles.subLabel}>Invoice Number:</Text>
        <TextInput
          style={styles.input}
          placeholder="Invoice #"
          value={invoiceNumber}
          onChangeText={setInvoiceNumber}
          keyboardType="numeric"
        />
        <Text style={styles.subLabel}>Invoice Date:</Text>
        <TextInput
          style={styles.input}
          placeholder="MM/DD/YYYY"
          value={invoiceDate}
          onChangeText={setInvoiceDate}
        />
      </View>

      {/* Save Button */}
      <View style={styles.section}>
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
  section: {
    marginBottom: 20,
  },
  companyName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  companySlogan: {
    fontSize: 16,
    fontStyle: "italic",
    marginBottom: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#000",
    fontSize: 16,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subLabel: {
    fontSize: 14,
    marginTop: 10,
    marginBottom: 5,
  },
});
