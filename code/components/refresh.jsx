import React from 'react'

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
import { Dimensions } from "react-native";

// Define the width for the Pie Chart
const screenWidth = Dimensions.get("window").width;

const refresh = () => {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const [searchQuery, setSearchQuery] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pieData, setPieData] = useState([]);
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
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
        const fetchedFilesData = [];

        snapshots.forEach((snapshot) => {
          snapshot.forEach((doc) => {
            const docData = doc.data();
            fetchedFiles.push({ id: doc.id, ...docData });
            fetchedFilesData.push({
              id: doc.id,
              ...docData,
              data: JSON.stringify(docData.data, null, 2),
            });
          });
        });

        setFiles(fetchedFiles);

        const transformDataForPieChart = (data) => {
          const parsedData = fetchedFilesData;

          const columnSums = {
            column1: 0,
            column2: 0,
            column3: 0,
          };

          parsedData.forEach((item) => {
            if (item.column1)
              columnSums.column1 += parseFloat(item.column1) || 0;
            if (item.column2)
              columnSums.column2 += parseFloat(item.column2) || 0;
            if (item.column3)
              columnSums.column3 += parseFloat(item.column3) || 0;
          });

          return Object.entries(columnSums).map(([name, amount]) => ({
            name,
            population: amount,
            color: "#" + ((Math.random() * 0xffffff) << 0).toString(16),
            legendFontColor: "#7F7F7F",
            legendFontSize: 15,
          }));
        };

        const transformedData = transformDataForPieChart(fetchedFilesData);
        setPieData(transformedData);
      } catch (error) {
        console.error("Error fetching files:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();

    // Optionally, set up an interval to refetch files periodically
    //   const intervalId = setInterval(fetchFiles, 1000); // Adjust interval as needed

    return () => clearInterval(intervalId); // Clean up interval on unmount
  }, [user]);

}

export default refresh

