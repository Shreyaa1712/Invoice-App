import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useUser, useClerk } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

export default function Profile() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  // Helper function to get user initials
  const getInitials = (name) => {
    if (!name) return '';
    const nameParts = name.split(' ');
    const initials = nameParts.map(part => part.charAt(0)).join('');
    return initials.toUpperCase();
  };

  return (
    <View style={styles.container}>
      {/* Profile Image or Initials */}
      {user?.profileImageUrl ? (
        <Image source={{ uri: user.profileImageUrl }} style={styles.profileImage} />
      ) : (
        <View style={styles.initialsContainer}>
          <Text style={styles.initialsText}>
            {getInitials(user?.fullName || "No Name Available")}
          </Text>
        </View>
      )}

      {/* Name */}
      <Text style={styles.name}>{user?.fullName || "No Name Available"}</Text>
      
      {/* Email */}
      <Text style={styles.email}>{user?.primaryEmailAddress?.emailAddress || "No Email Available"}</Text>

      {/* Sign Out Button */}
      <TouchableOpacity style={styles.button} onPress={() => signOut()}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>

      {/* Terms and Conditions */}
      <TouchableOpacity
        style={styles.link}
        onPress={() => router.push('/terms-and-conditions')}
      >
        <Text style={styles.linkText}>Terms and Conditions</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181818",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  initialsContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#8A4FFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 0,
  },
  initialsText: {
    color: "#fff",
    fontSize: 60,
    fontWeight: "bold",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop:10,
    color: "#6c757d",
  },
  email: {
    fontSize: 18,
    color: "#6c757d",
    marginBottom: 50,
  },
  button: {
    backgroundColor: "#8A4FFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    marginTop: 20,
  },
  linkText: {
    color: "#8A4FFF",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
