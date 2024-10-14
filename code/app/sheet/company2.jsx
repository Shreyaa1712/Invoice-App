import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Button,
} from "react-native";
import { initializeApp } from "firebase/app";
import { useUser } from "@clerk/clerk-expo";

import { getFirestore, doc, setDoc } from "firebase/firestore";
import { firebaseConfig } from "../../firebaseConfig"; // Make sure this path is correct

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Company2() {
  // State for company and client details
  const [companyInfo, setCompanyInfo] = useState({
    name: "",
    slogan: "",
    address: "",
    cityStateZip: "",
    phone: "",
    email: "",
  });

  const [clientInfo, setClientInfo] = useState({
    name: "",
    companyName: "",
    address: "",
    cityStateZip: "",
    phone: "",
  });

  // State for other fields
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("1");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [invoicename, setInvoicename] = useState("New CompantInvoice 2");
  const type='ci2';

  // Function to save data to Firestore
    const { user } = useUser();
    const timestamp = Date.now();
    const timeRef=timestamp.toString();

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
        invoicename
      };

      await setDoc(doc(db, "CompanyInvoice2", timeRef) , {
        email:emailid,name:invoicename,
        data: data, id: timestamp,
        type:type
      });

      alert("Data saved successfully!");
    } catch (error) {
      console.error("Error saving data to Firestore: ", error);
      alert("Failed to save data.");
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
      <View><Text style={styles.subLabel}>File Name:</Text>
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
