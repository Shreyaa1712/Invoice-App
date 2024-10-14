import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AddFile from "../../components/AddFile";
import { useUser } from "@clerk/clerk-expo";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  getFirestore,
} from "firebase/firestore";
import { firebaseConfig } from "../../firebaseConfig";
import { initializeApp } from "firebase/app";
import { PieChart } from "react-native-chart-kit";

// Define the width for the Pie Chart
const screenWidth = Dimensions.get("window").width;

export default function Home() {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const [searchQuery, setSearchQuery] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pieData, setPieData] = useState([]);
  const router = useRouter();
  const { user } = useUser();

  // Fetch files from Firestore
  const fetchFiles = async () => {
    if (!user) {
      console.log("No user found");
      setLoading(false);
      return;
    }

    try {
      console.log(
        "Fetching files for email:",
        user.primaryEmailAddress?.emailAddress
      );

      const fileCollections = [
        collection(db, "sheets"),
        collection(db, "invoice1"),
        collection(db, "invoice2"),
        collection(db, "CompanyInvoice1"),
        collection(db, "CompanyInvoice2"),
      ];

      const queries = fileCollections.map((col) =>
        query(
          col,
          where(
            "email",
            "==",
            user.primaryEmailAddress?.emailAddress || "unknown@example.com"
          )
        )
      );

      const snapshots = await Promise.all(queries.map((q) => getDocs(q)));

      const fetchedFiles = [];

      snapshots.forEach((snapshot) => {
        snapshot.forEach((doc) => {
          const docData = doc.data();
          fetchedFiles.push({ id: doc.id, ...docData });
        });
      });

      setFiles(fetchedFiles);

      // Calculate totals for the PieChart
      const totals = fetchedFiles.map((invoice) =>
        parseFloat(invoice.data?.total) || 0
      );

      const getRandomColor = () => {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      };

      const pieChartData = fetchedFiles.map((invoice, index) => ({
        name: invoice.name,
        amount: totals[index],
        color: getRandomColor(),
        legendFontColor: "#7F7F7F",
        legendFontSize: 15,
      }));

      setPieData(pieChartData);
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [user]);

  // Handle search input
  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle file rename
  const handleRename = (index) => {
    const file = filteredFiles[index];
    Alert.prompt(
      "Rename File",
      "Enter the new name for the file:",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async (newName) => {
            if (newName.trim()) {
              try {
                const fileRef = doc(db, "sheets", file.id);
                await updateDoc(fileRef, { name: newName });
                setFiles((prevFiles) =>
                  prevFiles.map((f) =>
                    f.id === file.id ? { ...f, name: newName } : f
                  )
                );
              } catch (error) {
                console.error("Error renaming file:", error);
              }
            }
          },
        },
      ],
      "plain-text",
      file.name
    );
  };

  // Handle file deletion
  const handleDelete = async (index) => {
    const file = filteredFiles[index];
    try {
      const fileRef = doc(db, "sheets", file.id);
      await deleteDoc(fileRef);
      setFiles((prevFiles) => prevFiles.filter((f) => f.id !== file.id));
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };
  const deleteDocument = async (collectionName, documentId) => {
    try {
      // Reference to the document
      const docRef = doc(db, collectionName, documentId);

      // Delete the document
      await deleteDoc(docRef);
      fetchFiles();

      console.log("Document successfully deleted!");
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  // Handle refresh button
  const handleFetchFiles = () => {
    fetchFiles();
  };

  // Loading screen
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00b4d8" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Bill with Nexus</Text>
      </View>

      {/* Analysis Dashboard */}
      <View style={styles.dashboard}>
        <Text style={styles.dashboardTitle}>Your Dashboard</Text>
        <ScrollView horizontal>
          <View style={styles.chartContainer}>
            <PieChart
              data={pieData}
              width={screenWidth}
              height={220}
              chartConfig={{
                backgroundColor: "#e26a00",
                backgroundGradientFrom: "#fb8c00",
                backgroundGradientTo: "#ffa726",
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              }}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
        </ScrollView>
       
      </View>

      {/* Invoices Section */}
      <View style={styles.invoicesSection}>
        <View style={styles.searchAddContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search here..."
            placeholderTextColor="#6c757d"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <AddFile />
        </View>
        <TouchableOpacity style={styles.fetchButton} onPress={handleFetchFiles}>
          <Text style={styles.fetchButtonText}>Refresh</Text>
        </TouchableOpacity>
        {filteredFiles.length > 0 ? (
          <ScrollView style={styles.invoiceList}>
            {filteredFiles.map((file, index) => (
              <View key={file.id} style={styles.invoiceItem}>
                <Text style={styles.invoiceText}>{file.name}</Text>
                <View style={styles.invoiceActions}>
                  <TouchableOpacity
                    onPress={() => {
                      let route;
                      switch (file.type) {
                        case "ci1":
                          route = `/sheet/C1/${file.id}`;
                          break;
                        case "ci2":
                          route = `/sheet/C2/${file.id}`;
                          break;
                        case "i1":
                          route = `/sheet/I1/${file.id}`;
                          break;
                        case "i2":
                          route = `/sheet/I2/${file.id}`;
                          break;
                        // Add more cases as needed
                        default:
                          route = `/sheet/default/${file.id}`;
                      }
                      router.push(route);
                    }}
                  >
                    <Feather name="edit" size={20} color="#00b4d8" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {let route;
                  switch (file.type) {
                    case "ci1":
                      route = 'CompanyInvoice1';
                      break;
                    case "ci2":
                      route = 'CompanyInvoice2';
                      break;
                    case "i1":
                      route = 'invoice1';
                      break;
                    case "i2":
                      route = 'invoice2';
                      break;
                    // Add more cases as needed
                    default:
                      route = `CompanyInvoice1`;
                  }
                  deleteDocument(route, `${file.id}`);}}>
                    <Feather name="trash" size={20} color="#ff4d4d" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.noResultsText}>No results found</Text>
        )}
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181818",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    color: "#8A4FFF",
    fontWeight: "bold",
  },
  dashboard: {
    backgroundColor: "#1e1e1e",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
    chartPlaceholder: {
        height: 220,
        backgroundColor: "#222",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 15,
      },
      chartText: {
        color: "#6c757d",
      },
  linkText: {
    color: "#00b4d8",
    fontSize: 14,
    textDecorationLine: "underline",
  },
    dashboard: {
      marginBottom: 20,
    },
    dashboardTitle: {
      fontSize: 20,
      color: "white",
      marginBottom: 10,
    },
    chartContainer: {
      minWidth: screenWidth,  // Ensure the chart takes up the full width
      paddingVertical: 10,
    },
  invoicesSection: {
    flex: 1,
    backgroundColor: "#1e1e1e",
    borderRadius: 10,
    padding: 20,
  },
  searchAddContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: "#2c2c2c",
    borderRadius: 10,
    paddingHorizontal: 10,
    color: "white",
  },
  addButtonContainer: {
    marginLeft: 10,
  },
  fetchButton: {
    backgroundColor:"#8A4FFF",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  fetchButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
  invoiceList: {
    maxHeight: 200,
  },
  invoiceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2c2c2c",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  invoiceText: {
    color: "white",
  },
  invoiceActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: 100,
  },
  noResultsText: {
    color: "#6c757d",
    textAlign: "center",
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#181818",
  },
});