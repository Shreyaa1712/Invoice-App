// components/TermsAndConditions.jsx

import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';

export default function TermsAndConditions() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Terms and Conditions</Text>
      <Text style={styles.subHeader}>Last Updated: [Insert Date]</Text>

      <Text style={styles.sectionHeader}>1. Acceptance of Terms</Text>
      <Text style={styles.text}>
        By accessing or using the App, you agree to comply with and be bound by these Terms. If you do not agree with any part of these Terms, you should not use the App.
      </Text>

      <Text style={styles.sectionHeader}>2. User Responsibilities</Text>
      <Text style={styles.text}>
        You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. You agree to use the App only for lawful purposes and in compliance with all applicable laws and regulations.
      </Text>

      <Text style={styles.sectionHeader}>3. Intellectual Property</Text>
      <Text style={styles.text}>
        All content, including but not limited to text, graphics, logos, and software, is the property of [Your Organization Name] or its licensors and is protected by intellectual property laws. You agree not to copy, modify, distribute, or sell any part of the App without explicit permission.
      </Text>

      <Text style={styles.sectionHeader}>4. Privacy</Text>
      <Text style={styles.text}>
        Your use of the App is also governed by our Privacy Policy, which can be accessed at [Link to Privacy Policy]. By using the App, you consent to the collection and use of your information as described in the Privacy Policy.
      </Text>

      <Text style={styles.sectionHeader}>5. Limitation of Liability</Text>
      <Text style={styles.text}>
        In no event shall [Your Organization Name] be liable for any direct, indirect, incidental, special, or consequential damages arising out of or in connection with your use of the App, whether based on warranty, contract, tort, or any other legal theory.
      </Text>

      <Text style={styles.sectionHeader}>6. Changes to Terms</Text>
      <Text style={styles.text}>
        We reserve the right to update or modify these Terms at any time. Any changes will be effective immediately upon posting on the App. Your continued use of the App following the posting of changes constitutes your acceptance of those changes.
      </Text>

      <Text style={styles.sectionHeader}>7. Governing Law</Text>
      <Text style={styles.text}>
        These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law principles.
      </Text>

      <Text style={styles.sectionHeader}>8. Contact Information</Text>
      <Text style={styles.text}>
        If you have any questions about these Terms, please contact us at [Your Contact Information].
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF', // White background
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000000', // Black text
  },
  subHeader: {
    fontSize: 16,
    marginBottom: 20,
    color: '#000000', // Black text
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#4B0082', // Indigo color
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333333', // Dark grey text
  },
});
