import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

export default function Profile() {
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Profile',
          headerBackTitle: 'Back'
        }} 
      />
      
      <Text>Profile Screen Content</Text>
      {/* Add your profile content here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
});