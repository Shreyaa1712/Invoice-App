import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CurrencyConverter from '../../components/currencyConvertor/currency';


export default function Page() {
  return (
    <View style={{marginVertical:'auto'}}>
      <CurrencyConverter/>
    </View>
  );
}
 