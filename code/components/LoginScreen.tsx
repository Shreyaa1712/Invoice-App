import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import React, { useState } from 'react';
import { useOAuth } from '@clerk/clerk-expo';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { useWarmUpBrowser } from './../hooks/useWarmUpBrowser.js';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  useWarmUpBrowser();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  const [loading, setLoading] = useState(false);

  const onPress = React.useCallback(async () => {
    setLoading(true);
    try {
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL('/home', { scheme: 'myapp' }),
      });

      if (createdSessionId) {
        await setActive!({ session: createdSessionId });
      }
    } catch (err) {
      console.error('OAuth error', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require('../assets/images/logo.png')} style={styles.logo} />

      {/* App Name */}
      <Text style={styles.title}>Nexus</Text>

      {/* Google Login Button */}
      <TouchableOpacity style={styles.btn} onPress={onPress} disabled={loading}>
        <Image 
          source={{ uri: 'https://static-00.iconduck.com/assets.00/google-icon-2048x2048-pks9lbdv.png' }} 
          style={styles.googleIcon} 
        />
        <Text style={styles.btnText}>
          {loading ? 'Loading...' : 'Continue with Google'}
        </Text>
      </TouchableOpacity>

      {/* Terms and Conditions */}
      <Text style={styles.termsText}>
        Read our <Text style={styles.linkText}>Terms and Conditions</Text> here
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C1C1C',
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom:-100,
  },
  title: {
    color: '#8A4FFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  btn: {
    flexDirection: 'row',
    backgroundColor: '#fff', // White background for the Google button
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '80%',
    marginVertical: 10,
    justifyContent:'center'
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  btnText: {
    color: '#000', // Black text for visibility on white background
    fontSize: 16,
    fontWeight: 'bold',
  },
  termsText: {
    color: '#fff',
    marginTop: 20,
    fontSize: 12,
  },
  linkText: {
    color: '#8A4FFF',
    textDecorationLine: 'underline',
  },
});
