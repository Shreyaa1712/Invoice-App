import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { initializeApp } from "firebase/app";
import { useUser } from "@clerk/clerk-expo";
import { firebaseConfig } from "../../../firebaseConfig";
import { collection, getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { useLocalSearchParams } from "expo-router";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Invoice() {
  const { id } = useLocalSearchParams();
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log('id',id);
  useEffect(() => {
    const fetchInvoiceData = async () => {
      if (!id) {
        console.log("No ID found");
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, "CompanyInvoice1", id); // Adjust the collection name as needed
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("Fetched Invoice Data:", data);
          setInvoiceData(data);
        } else {
          console.log("No such document!");
          Alert.alert("No Data", "No document found with this ID");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
        Alert.alert("Error", "Failed to fetch invoice data");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoiceData();
  }, [id]);

  // State for invoice data
  const [invoiceNumber, setInvoiceNumber] = useState("1");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [invoicename, setInvoicename] = useState("New CompanyInvoice1");
  const [companyInfo, setCompanyInfo] = useState({
    name: "",
    slogan: "",
    address: "",
    cityStateZip: "",
    phone: "",
    email: "",
  });
  const [billTo, setBillTo] = useState({
    name: "",
    companyName: "",
    address: "",
    cityStateZip: "",
    phone: "",
  });
  const [items, setItems] = useState([{ description: "", amount: "" }]);
  const [subtotal, setSubtotal] = useState("0.00");
  const [taxRate, setTaxRate] = useState("0.00");
  const [tax, setTax] = useState("0.00");
  const [other, setOther] = useState("0.00");
  const [total, setTotal] = useState("0.00");
  const [notes, setNotes] = useState("");

  // Function to calculate the subtotal, tax, and total amounts
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

  // Function to save data to Firestore
  const saveToFirestore = async () => {
    try {
      const emailid =
        user.primaryEmailAddress?.emailAddress || "unknown@example.com";
      const uname = user.fullName || "Anonymous";
      const invoiceData = {
        invoicename,
        invoiceNumber,
        invoiceDate,
        companyInfo,
        billTo,
        items,
        subtotal,
        taxRate,
        tax,
        other,
        total,
        notes,
      };

      await setDoc(doc(db, "CompanyInvoice1", invoiceNumber), {
        email: emailid,
        name: invoicename,
        data: invoiceData,
      });

      Alert.alert("Success", "Invoice saved to Firestore!");
    } catch (error) {
      console.error("Error saving invoice to Firestore: ", error);
      Alert.alert("Error", "Failed to save invoice");
    }
  };

  // Function to add new item
  const addItem = () => {
    setItems([...items, { description: "", amount: "" }]);
  };

  // Function to remove item
  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    calculateAmounts();  // Corrected to calculateAmounts
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Company Information */}
      <View style={styles.companyInfo}>
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

      {/* Invoice Title */}
      <Text style={styles.invoiceTitle}>INVOICE</Text>

      {/* Invoice Header */}
      <View>
        <Text style={styles.label}>File Name :</Text>
        <TextInput
          style={styles.input}
          value={invoicename}
          onChangeText={setInvoicename}
          placeholder="FileName"
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>DATE :</Text>
        <TextInput
          style={styles.input}
          value={invoiceDate}
          onChangeText={setInvoiceDate}
          placeholder="MM/DD/YYYY"
        />

        <Text style={styles.label}>INVOICE # :</Text>
        <TextInput
          style={styles.input}
          value={invoiceNumber}
          onChangeText={setInvoiceNumber}
          keyboardType="numeric"
        />
      </View>

      {/* Billing Information */}
      <View style={styles.section}>
        <Text style={styles.billToTitle}>BILL TO:</Text>
        <TextInput
          style={styles.input}
          placeholder="[Name]"
          value={billTo.name}
          onChangeText={(text) => setBillTo({ ...billTo, name: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="[Company Name]"
          value={billTo.companyName}
          onChangeText={(text) => setBillTo({ ...billTo, companyName: text })}
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

      {/* Invoice Items */}
      <View style={styles.itemsHeader}>
        <Text style={styles.itemsHeaderText}>DESCRIPTION</Text>
        <Text style={styles.itemsHeaderText}>AMOUNT</Text>
      </View>

      {items.map((item, index) => (
        <View key={index} style={styles.itemRow}>
          <TextInput
            style={styles.itemDescription}
            placeholder="Description"
            value={item.description}
            onChangeText={(text) => updateItem(index, "description", text)}
          />
          <TextInput
            style={styles.itemAmount}
            placeholder="0.00"
            value={item.amount}
            keyboardType="numeric"
            onChangeText={(text) => updateItem(index, "amount", text)}
          />
          <TouchableOpacity onPress={() => removeItem(index)}>
            <Text style={styles.deleteButton}>X</Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Add Item Button */}
      <TouchableOpacity onPress={addItem}>
        <Text style={styles.addItemButton}>Add Item</Text>
      </TouchableOpacity>

      {/* Subtotal, Tax, Other, Total */}
      <View style={styles.amounts}>
        <View style={styles.amountRow}>
          <Text style={styles.amountLabel}>SUBTOTAL :</Text>
          <Text style={styles.amountValue}>{subtotal}</Text>
        </View>
        <View style={styles.amountRow}>
          <Text style={styles.amountLabel}>TAX RATE :</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            value={taxRate}
            keyboardType="numeric"
            onChangeText={setTaxRate}
            onEndEditing={calculateAmounts}
          />
        </View>
        <View style={styles.amountRow}>
          <Text style={styles.amountLabel}>TAX :</Text>
          <Text style={styles.amountValue}>{tax}</Text>
        </View>
        <View style={styles.amountRow}>
          <Text style={styles.amountLabel}>OTHER :</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            value={other}
            keyboardType="numeric"
            onChangeText={setOther}
            onEndEditing={calculateAmounts}
          />
        </View>
        <View style={styles.amountRow}>
          <Text style={styles.amountLabel}>TOTAL :</Text>
          <Text style={styles.amountValue}>{total}</Text>
        </View>
      </View>

      {/* Notes Section */}
      <Text style={styles.label}>NOTES:</Text>
      <TextInput
        style={[styles.input, styles.notesInput]}
        placeholder="Add any notes here..."
        value={notes}
        onChangeText={setNotes}
        multiline
      />

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={saveToFirestore}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  companyInfo: {
    marginBottom: 24,
  },
  companyName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  companySlogan: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginBottom: 12,
    paddingVertical: 8,
  },
  invoiceTitle: {
    fontSize: 36,
    fontWeight: "bold",
    alignSelf: "center",
    marginVertical: 16,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  section: {
    marginVertical: 16,
  },
  billToTitle: {
    fontWeight: "bold",
    fontSize: 18,
  },
  itemsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginVertical: 16,
  },
  itemsHeaderText: {
    fontWeight: "bold",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  itemDescription: {
    flex: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginRight: 8,
    paddingVertical: 8,
  },
  itemAmount: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginRight: 8,
    paddingVertical: 8,
  },
  deleteButton: {
    color: "red",
  },
  addItemButton: {
    color: "blue",
    textAlign: "center",
    marginVertical: 8,
  },
  amounts: {
    marginVertical: 16,
  },
  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  amountLabel: {
    fontWeight: "bold",
  },
  amountValue: {
    fontWeight: "bold",
  },
  notesInput: {
    height: 80,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: "green",
    paddingVertical: 12,
    borderRadius: 4,
    marginTop: 24,
  },
  saveButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});