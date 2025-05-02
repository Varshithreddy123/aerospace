import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';

export default function BESScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Stack.Screen
        options={{
          title: 'BES',
          headerBackTitle: 'Back',
          // These options ensure the back arrow appears and looks good
          headerBackVisible: true,
          headerBackTitleVisible: true,
          headerShadowVisible: false, // if you want a clean header
          headerTitleAlign: 'center', // centers the title
        }}
      />
      
      {/* Main content */}
      <View style={styles.content}>
        {/* Logo with blue background */}
        <View style={styles.logoContainer}>
          <Image
            source={require('@/assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        
        {/* Text content */}
        <Text style={styles.title}>
          We are coming soon.
        </Text>
        
        <Text style={styles.subtitle}>
          We are coming with BES app soon.
        </Text>
        
        <Text style={styles.text}>
          Stay tuned
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  content: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  logoContainer: {
    backgroundColor: '#1d4ed8', // blue-700
    borderRadius: 999,
    padding: 24,
    marginBottom: 48,
  },
  logo: {
    width: 64,
    height: 64,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});