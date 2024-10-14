import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function CurrencyConverter() {
  const [currencyFirst, setCurrencyFirst] = useState('USD');
  const [worthFirst, setWorthFirst] = useState('1');
  const [currencySecond, setCurrencySecond] = useState('INR');
  const [worthSecond, setWorthSecond] = useState('');
  const [exchangeRate, setExchangeRate] = useState('');
  const [taxInfo, setTaxInfo] = useState({ rate: 0, description: 'No data available' });

  const taxRates = {
    AUD: { rate: 0.10, description: "Australian GST" },
    CAD: { rate: 0.05, description: "Canadian GST" },
    EUR: { rate: 0.19, description: "Eurozone VAT" },
    GBP: { rate: 0.20, description: "UK VAT" },
    INR: { rate: 0.18, description: "Indian GST" },
    JPY: { rate: 0.10, description: "Japanese Consumption Tax" },
    USD: { rate: 0.07, description: "US Federal Sales Tax" },
  };

  const updateRate = () => {
    fetch(`https://api.coinbase.com/v2/exchange-rates?currency=${currencyFirst}`)
      .then((res) => res.json())
      .then((data) => {
        const rate = data.data.rates[currencySecond];
        if (rate) {
          setExchangeRate(`1 ${currencyFirst} = ${rate} ${currencySecond}`);
          setWorthSecond((parseFloat(worthFirst) * parseFloat(rate)).toFixed(2));
        } else {
          setExchangeRate(`Rate not available`);
          setWorthSecond('');
        }
      })
      .catch((error) => console.error('Error fetching exchange rate:', error));
  };

  // Update exchange rate and tax information whenever the currencies change
  useEffect(() => {
    updateRate();
    const taxRate = taxRates[currencySecond] || { rate: 0, description: 'No data available' };
    setTaxInfo(taxRate);
  }, [currencyFirst, currencySecond, worthFirst]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Currency Converter</Text>
      <View style={styles.currencyContainer}>
        <Picker
          selectedValue={currencyFirst}
          onValueChange={(itemValue) => setCurrencyFirst(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="AUD" value="AUD" />
          <Picker.Item label="CAD" value="CAD" />
          <Picker.Item label="EUR" value="EUR" />
          <Picker.Item label="GBP" value="GBP" />
          <Picker.Item label="INR" value="INR" />
          <Picker.Item label="JPY" value="JPY" />
          <Picker.Item label="USD" value="USD" />
        </Picker>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={worthFirst}
          onChangeText={(text) => setWorthFirst(text)}
        />
      </View>
      <View style={styles.currencyContainer}>
        <Picker
          selectedValue={currencySecond}
          onValueChange={(itemValue) => setCurrencySecond(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="AUD" value="AUD" />
          <Picker.Item label="CAD" value="CAD" />
          <Picker.Item label="EUR" value="EUR" />
          <Picker.Item label="GBP" value="GBP" />
          <Picker.Item label="INR" value="INR" />
          <Picker.Item label="JPY" value="JPY" />
          <Picker.Item label="USD" value="USD" />
        </Picker>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={worthSecond}
          editable={false}
        />
      </View>
      <Text style={styles.exchangeRate}>{exchangeRate}</Text>
      <Text style={styles.taxInfo}>
        The current tax rate for {currencySecond} is {taxInfo.rate * 100}% ({taxInfo.description}).
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#181818",
    color:'white',
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "white",
  },
  currencyContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: 150,
    color: "white",
  },
  input: {
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 5,
    padding: 10,
    marginLeft: 20,
    flex: 1,
    color: "white",
    textAlign: "right",
  },
  exchangeRate: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    color: "#8A4FFF",
  },
  taxInfo: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 20,
    color: "red",
  },
});