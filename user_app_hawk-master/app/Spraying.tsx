import React, { useState, useRef, useEffect } from 'react';
import { Text, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import tw from "../tailwind";
import { useRouter, useLocalSearchParams } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

// Define form data interface
interface FormData {
  address: string;
  acres: string;
  numberOfTanks: string;
  tanksToSpray: string;
  sprayingDate: string;
  agrochemical: string;
  crop: string;
}

// Define form field types
type FormField = keyof FormData;

// Define step interface for better readability
interface Step {
  id: number;
  label: string;
  icon: string; // This would be the icon identifier - we're using numbers in circles now
  visible: boolean;
}

const Spraying = () => {
  const router = useRouter();
  const mapRef = useRef<MapView | null>(null);
  const params = useLocalSearchParams<{ lat?: string; lng?: string }>();

  // Form state management with proper typing
  const [formData, setFormData] = useState<FormData>({
    address: '',
    acres: '',
    numberOfTanks: '',
    tanksToSpray: '',
    sprayingDate: '',
    agrochemical: '',
    crop: ''
  });

  // Location state
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  } | null>(null);

  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [locationPermission, setLocationPermission] = useState<Location.PermissionStatus | null>(null);
  
  // Form visibility state - progressive display of form sections
  const [currentStep, setCurrentStep] = useState<number>(1);
  
  // Options for dropdown selects
  const agrochemicalOptions = ["Insecticide", "Herbicide", "Fungicide", "Fertilizer"];
  const cropOptions = ["Bajra", "Wheat", "Rice", "Cotton", "Sugarcane"];

  useEffect(() => {
    let isMounted = true;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (!isMounted) return;

      setLocationPermission(status);

      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        if (!isMounted) return;

        const initialRegion = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        };

        setCurrentLocation(initialRegion);
        setSelectedLocation({ latitude: location.coords.latitude, longitude: location.coords.longitude });
      } else {
        setCurrentLocation({
          latitude: 45.5,
          longitude: -94.0,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        });
      }
      setIsLoading(false);
    })();

    return () => { isMounted = false; }; // Cleanup to prevent memory leaks
  }, []);

  useEffect(() => {
    if (params.lat && params.lng && (!selectedLocation || selectedLocation.latitude !== parseFloat(params.lat) || selectedLocation.longitude !== parseFloat(params.lng))) {
      setSelectedLocation({
        latitude: parseFloat(params.lat),
        longitude: parseFloat(params.lng),
      });
    }
  }, [params]);

  // Type-safe input handler
  const handleInputChange = (field: FormField, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Progress to next step
  const handleNextStep = () => {
    // Validate current step
    if (currentStep === 1) {
      // Validate address
      if (!formData.address.trim()) {
        alert("Please enter your address");
        return;
      }
    } else if (currentStep === 2) {
      // Validate spraying need
      if (!formData.acres.trim() || !formData.numberOfTanks.trim()) {
        alert("Please enter both acres and number of tanks");
        return;
      }
    } else if (currentStep === 3) {
      // Validate tanks to spray
      if (!formData.tanksToSpray.trim()) {
        alert("Please enter how many tanks you want to spray");
        return;
      }
    } else if (currentStep === 4) {
      // Validate date
      if (!formData.sprayingDate.trim()) {
        alert("Please enter when you want spraying");
        return;
      }
    } else if (currentStep === 5) {
      // Validate agrochemical
      if (!formData.agrochemical.trim()) {
        alert("Please select an agrochemical");
        return;
      }
    } else if (currentStep === 6) {
      // Validate crop
      if (!formData.crop.trim()) {
        alert("Please select a crop");
        return;
      }
      
      // Submit form - all steps are completed
      console.log("Form data to save:", {
        location: selectedLocation,
        ...formData
      });
      
      // Navigate to next screen or submit form
      // router.push('/NextScreen');
      return;
    }
    
    // Move to next step
    setCurrentStep(currentStep + 1);
  };

  // Handle dropdown selection
  const handleDropdownSelect = (field: FormField, value: string) => {
    handleInputChange(field, value);
  };

  // Render icon based on step number
  const renderStepIcon = (stepNumber: number) => {
    return (
      <View style={tw`w-8 h-8 rounded-full bg-green-500 items-center justify-center mr-2`}>
        <Text style={tw`text-white font-bold`}>{stepNumber}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <ScrollView contentContainerStyle={tw`pb-8`}>
        <View style={tw`p-4`}>
          {/* Address Section - Always visible (Step 1) */}
          {currentStep >= 1 && (
            <View style={tw`mb-6`}>
              <View style={tw`flex-row items-center mb-2`}>
                {renderStepIcon(1)}
                <Text style={tw`text-base font-medium`}>Tell us your address</Text>
              </View>
              
              <TextInput
                placeholder="Enter your specific address"
                style={tw`border border-gray-300 rounded-full py-3 px-4 mb-4`}
                value={formData.address}
                onChangeText={(text) => handleInputChange('address', text)}
              />

              {selectedLocation && (
                <Text style={tw`text-sm text-gray-500 mb-2`}>
                  Selected: {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
                </Text>
              )}

              {/* Button to open map selection */}
              <TouchableOpacity 
                style={tw`bg-gray-200 rounded-full py-3 px-4 items-center mb-4`}
                onPress={() => router.push({ 
                  pathname: "/FieldLocation", 
                  params: selectedLocation 
                    ? { lat: selectedLocation.latitude, lng: selectedLocation.longitude } 
                    : {} 
                })}
              >
                <Text style={tw`text-blue-500`}>View on Map</Text>
              </TouchableOpacity>
              
              {currentStep === 1 && (
                <TouchableOpacity 
                  style={tw`bg-blue-500 rounded-full py-3 items-center mt-4`}
                  onPress={handleNextStep}
                >
                  <Text style={tw`text-white font-medium`}>Next</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          
          {/* Spraying Need Section (Step 2) */}
          {currentStep >= 2 && (
            <View style={tw`mb-6`}>
              <View style={tw`flex-row items-center mb-4`}>
                {renderStepIcon(2)}
                <Text style={tw`text-base font-medium`}>Tell us about your spraying need</Text>
              </View>
              
              <View style={tw`flex-row justify-between mb-4`}>
                <TextInput
                  placeholder="Acres"
                  style={tw`border border-gray-300 rounded-full py-3 px-4 w-5/12 text-center`}
                  value={formData.acres}
                  onChangeText={(text) => handleInputChange('acres', text)}
                  keyboardType="numeric"
                />
                <TextInput
                  placeholder="No. of Tank"
                  style={tw`border border-gray-300 rounded-full py-3 px-4 w-5/12 text-center`}
                  value={formData.numberOfTanks}
                  onChangeText={(text) => handleInputChange('numberOfTanks', text)}
                  keyboardType="numeric"
                />
              </View>
              
              {currentStep === 2 && (
                <TouchableOpacity 
                  style={tw`bg-blue-500 rounded-full py-3 items-center mt-4`}
                  onPress={handleNextStep}
                >
                  <Text style={tw`text-white font-medium`}>Next</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          
          {/* Tanks to Spray Section (Step 3) */}
          {currentStep >= 3 && (
            <View style={tw`mb-6`}>
              <View style={tw`flex-row items-center mb-4`}>
                {renderStepIcon(3)}
                <Text style={tw`text-base font-medium`}>How many no. of tanks you want to spray?</Text>
              </View>
              
              <TextInput
                placeholder="Enter number of tanks"
                style={tw`border border-gray-300 rounded-full py-3 px-4 mb-4`}
                value={formData.tanksToSpray}
                onChangeText={(text) => handleInputChange('tanksToSpray', text)}
                keyboardType="numeric"
              />
              
              {currentStep === 3 && (
                <TouchableOpacity 
                  style={tw`bg-blue-500 rounded-full py-3 items-center mt-4`}
                  onPress={handleNextStep}
                >
                  <Text style={tw`text-white font-medium`}>Next</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          
          {/* Date Selection (Step 4) */}
          {currentStep >= 4 && (
            <View style={tw`mb-6`}>
              <View style={tw`flex-row items-center mb-4`}>
                {renderStepIcon(4)}
                <Text style={tw`text-base font-medium`}>When you want spraying?</Text>
              </View>
              
              <View style={tw`flex-row border border-gray-300 rounded-full py-3 px-4 mb-4 items-center`}>
                <TextInput
                  placeholder="DD/MM/YYYY"
                  style={tw`flex-1`}
                  value={formData.sprayingDate}
                  onChangeText={(text) => handleInputChange('sprayingDate', text)}
                />
                <Text style={tw`text-gray-400`}>📅</Text>
              </View>
              
              {currentStep === 4 && (
                <TouchableOpacity 
                  style={tw`bg-blue-500 rounded-full py-3 items-center mt-4`}
                  onPress={handleNextStep}
                >
                  <Text style={tw`text-white font-medium`}>Next</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          
          {/* Select Agrochemical (Step 5) */}
          {currentStep >= 5 && (
            <View style={tw`mb-6`}>
              <View style={tw`flex-row items-center mb-4`}>
                {renderStepIcon(5)}
                <Text style={tw`text-base font-medium`}>Select Agrochemical</Text>
              </View>
              
              <TouchableOpacity 
                style={tw`border border-gray-300 rounded-full py-3 px-4 mb-4 flex-row justify-between items-center`}
                onPress={() => {
                  // In a real app, this would open a dropdown or modal
                  // For now, we'll just select the first option for demo purposes
                  if (!formData.agrochemical) {
                    handleInputChange('agrochemical', agrochemicalOptions[0]);
                  }
                }}
              >
                <Text style={formData.agrochemical ? tw`text-black` : tw`text-gray-400`}>
                  {formData.agrochemical || "Select an option"}
                </Text>
                <Text>▼</Text>
              </TouchableOpacity>
              
              {currentStep === 5 && (
                <TouchableOpacity 
                  style={tw`bg-blue-500 rounded-full py-3 items-center mt-4`}
                  onPress={handleNextStep}
                >
                  <Text style={tw`text-white font-medium`}>Next</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          
          {/* Select Crop (Step 6) */}
          {currentStep >= 6 && (
            <View style={tw`mb-6`}>
              <View style={tw`flex-row items-center mb-4`}>
                {renderStepIcon(6)}
                <Text style={tw`text-base font-medium`}>Select Crop</Text>
              </View>
              
              <TouchableOpacity 
                style={tw`border border-gray-300 rounded-full py-3 px-4 mb-4 flex-row justify-between items-center`}
                onPress={() => {
                  // In a real app, this would open a dropdown or modal
                  // For now, we'll just select the first option for demo purposes
                  if (!formData.crop) {
                    handleInputChange('crop', cropOptions[0]);
                  }
                }}
              >
                <Text style={formData.crop ? tw`text-black` : tw`text-gray-400`}>
                  {formData.crop || "Select an option"}
                </Text>
                <Text>▼</Text>
              </TouchableOpacity>
              
              {/* Final next button */}
              <TouchableOpacity 
                style={tw`bg-blue-500 rounded-full py-3 items-center mt-4`}
                onPress={handleNextStep}
              >
                <Text style={tw`text-white font-medium`}>Next</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Spraying;