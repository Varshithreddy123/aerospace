import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { Stack } from 'expo-router'; // Make sure to import Stack from expo-router

const { width } = Dimensions.get('window');

// Sample drone data with INR prices
const DRONE_DATA = [
  {
    id: '1',
    name: 'AgriDrone Pro X2',
    price: '₹89,999',
    originalPrice: '$1,299',
    range: '5 km',
    battery: '45 min',
    payload: '5 kg',
    image: 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    seller: 'AgriTech Solutions',
    location: 'Within 10 km',
    available: true,
  },
  {
    id: '2',
    name: 'CropSpray 3000',
    price: '₹1,79,999',
    originalPrice: '$2,499',
    range: '8 km',
    battery: '60 min',
    payload: '10 kg',
    image: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    seller: 'FarmDrone Inc.',
    location: 'Within 25 km',
    available: true,
  },
];

const BuyDronePage = () => {
  const navigation = useNavigation();
  const [availableDrones, setAvailableDrones] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    fetchLocationAndDrones();
  }, []);

  const fetchLocationAndDrones = async () => {
    setRefreshing(true);
    setLocationLoading(true);
    
    try {
      // Request location permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Location permission denied');
        setUserLocation('Location services disabled');
        return;
      }

      // Get current location
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      // Reverse geocode to get address
      let geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
      const city = geocode[0]?.city || 'your area';
      const region = geocode[0]?.region || '';
      setUserLocation(`${city}${region ? `, ${region}` : ''}`);

      // Simulate API call with location data
      setTimeout(() => {
        const showDrones = Math.random() > 0.5;
        setAvailableDrones(showDrones ? DRONE_DATA : []);
        setRefreshing(false);
        setLocationLoading(false);
      }, 1500);

    } catch (error) {
      console.error('Location error:', error);
      setLocationError('Unable to fetch location');
      setUserLocation('Location unavailable');
      setRefreshing(false);
      setLocationLoading(false);
    }
  };

  const handleBuyNow = (drone) => {
    navigation.navigate('DroneCheckout', { drone });
  };

  const handleContactSeller = (seller) => {
    alert(`Contacting ${seller}...`);
  };

  const handleChangeLocation = () => {
    Alert.alert(
      "Change Location",
      "This feature would allow you to select a different location in the full app version.",
      [{ text: "OK" }]
    );
  };

  // Define the header right component for the filter button
  const HeaderRight = () => (
    <TouchableOpacity style={{ marginRight: 8 }}>
      <Ionicons name="filter" size={22} color="#333" />
    </TouchableOpacity>
  );

  const renderContent = () => {
    if (locationLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Detecting your location...</Text>
        </View>
      );
    }

    if (availableDrones.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons 
            name="drone" 
            size={120} 
            color="#4CAF50" 
            style={styles.droneIcon}
          />
          <Text style={styles.emptyTitle}>No Drone Providers Available</Text>
          <Text style={styles.emptyText}>
            We couldn't find any drone sellers in {userLocation}.
          </Text>
          
          {locationError && (
            <Text style={styles.errorText}>{locationError}</Text>
          )}
          
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={fetchLocationAndDrones}
            disabled={refreshing}
          >
            <Text style={styles.refreshText}>
              {refreshing ? 'Searching...' : 'Refresh Availability'}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.locationContainer}>
          <Ionicons name="location-sharp" size={18} color="#4CAF50" />
          <Text style={styles.locationText}>{userLocation}</Text>
          <TouchableOpacity 
            style={styles.changeLocation}
            onPress={handleChangeLocation}
          >
            <Text style={styles.changeLocationText}>Change</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Available Drones ({availableDrones.length})</Text>

        {availableDrones.map((drone) => (
          <View key={drone.id} style={styles.droneCard}>
            <Image source={{ uri: drone.image }} style={styles.droneImage} />
            
            <View style={styles.droneDetails}>
              <View style={styles.titleRow}>
                <Text style={styles.droneName}>{drone.name}</Text>
                <Text style={styles.dronePrice}>{drone.price}</Text>
              </View>
              
              <Text style={styles.originalPrice}>{drone.originalPrice}</Text>
              
              <View style={styles.specsContainer}>
                <View style={styles.specItem}>
                  <Ionicons name="speedometer" size={16} color="#666" />
                  <Text style={styles.specText}>{drone.range}</Text>
                </View>
                <View style={styles.specItem}>
                  <Ionicons name="battery-charging" size={16} color="#666" />
                  <Text style={styles.specText}>{drone.battery}</Text>
                </View>
                <View style={styles.specItem}>
                  <MaterialCommunityIcons name="weight" size={16} color="#666" />
                  <Text style={styles.specText}>{drone.payload}</Text>
                </View>
              </View>
              
              <View style={styles.sellerInfo}>
                <Text style={styles.sellerText}>Sold by: {drone.seller}</Text>
                <Text style={styles.distanceText}>{drone.location}</Text>
              </View>
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={styles.contactButton}
                  onPress={() => handleContactSeller(drone.seller)}
                >
                  <Text style={styles.contactButtonText}>Contact</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.buyButton}
                  onPress={() => handleBuyNow(drone)}
                >
                  <Text style={styles.buyButtonText}>Buy Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Stack.Screen component for header configuration */}
      <Stack.Screen
        options={{
          title: 'Buy Agricultural Drones',
          headerBackTitle: 'Back',
          headerRight: () => <HeaderRight />,
          headerStyle: {
            backgroundColor: '#fff',
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
            color: '#333',
          },
        }}
      />
      
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollContainer: {
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  droneIcon: {
    marginBottom: 20,
    opacity: 0.8,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 22,
    maxWidth: '80%',
  },
  errorText: {
    fontSize: 14,
    color: '#FF5252',
    textAlign: 'center',
    marginBottom: 16,
  },
  refreshButton: {
    marginTop: 30,
    paddingVertical: 14,
    paddingHorizontal: 32,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    elevation: 2,
  },
  refreshText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    paddingVertical: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
    fontWeight: '500',
  },
  changeLocation: {
    marginLeft: 'auto',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  changeLocationText: {
    color: '#4CAF50',
    fontWeight: '500',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  droneCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  droneImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#f0f0f0',
  },
  droneDetails: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  droneName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  dronePrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4CAF50',
    marginLeft: 10,
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
    marginBottom: 12,
    textAlign: 'right',
  },
  specsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  specText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
    fontWeight: '500',
  },
  sellerInfo: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
    marginBottom: 16,
  },
  sellerText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  distanceText: {
    fontSize: 13,
    color: '#4CAF50',
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  buyButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
  contactButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactButtonText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 15,
  },
});

export default BuyDronePage;