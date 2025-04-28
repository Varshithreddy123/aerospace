import React, { useState, useRef, useEffect } from 'react';
import { Text, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Image } from 'react-native';
import tw from "../tailwind";
import { useRouter, useLocalSearchParams } from 'expo-router';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons, MaterialCommunityIcons, FontAwesome5, AntDesign } from '@expo/vector-icons';

// Define form data
interface FormData {
  address: string;
  acres: string;
  numberOfTanks: string;
  tanksToSpray: string;
  sprayingDate: string;
  agrochemical: string;
  crop: string;
  coupon: string;
}

// Define form fields
type FormField = keyof FormData;

const Spraying = () => {
  const router = useRouter();
  const mapRef = useRef<MapView | null>(null);
  const params = useLocalSearchParams<{ lat?: string; lng?: string }>();

  const [formData, setFormData] = useState<FormData>({
    address: 'Nashik',
    acres: '',
    numberOfTanks: '',
    tanksToSpray: '3',
    sprayingDate: '13/03/2025',
    agrochemical: 'Insecticide',
    crop: 'Bajra',
    coupon: ''
  });

  const [selectedCoupon, setSelectedCoupon] = useState("FLAT20");
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  } | null>(null);

  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [locationPermission, setLocationPermission] = useState<Location.PermissionStatus | null>(null);

  const [showAllSteps, setShowAllSteps] = useState(true);
  const [finalPrice, setFinalPrice] = useState(1500.00);

  const agrochemicalOptions = ["Insecticide", "Herbicide", "Fungicide", "Fertilizer"];
  const cropOptions = ["Bajra", "Wheat", "Rice", "Cotton", "Sugarcane"];

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (!isMounted) return;
      setLocationPermission(status);
      setIsLoading(false);
    })();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (params.lat && params.lng) {
      setSelectedLocation({
        latitude: parseFloat(params.lat),
        longitude: parseFloat(params.lng),
      });
    }
  }, [params]);

  const handleInputChange = (field: FormField, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNextStep = () => {
    // In this implementation, all steps are shown at once
    console.log("Creating request...");
  };

  const handleApplyCoupon = () => {
    console.log("Applying coupon:", selectedCoupon);
  };

  const handleCreateRequest = () => {
    console.log("Final form data =>", {
      location: selectedLocation,
      ...formData,
      finalPrice: finalPrice
    });
    alert(`Request created successfully!`);
  };

  // Icon components for each step
  const LocationIcon = () => (
    <View style={tw`w-6 h-6 rounded-full bg-green-500 items-center justify-center mr-3`}>
      <Ionicons name="location-outline" size={14} color="white" />
    </View>
  );

  const SprayingNeedIcon = () => (
    <View style={tw`w-6 h-6 rounded-full bg-green-500 items-center justify-center mr-3`}>
      <MaterialCommunityIcons name="spray" size={14} color="white" />
    </View>
  );

  const TanksIcon = () => (
    <View style={tw`w-6 h-6 rounded-full bg-green-500 items-center justify-center mr-3`}>
      <MaterialCommunityIcons name="water-pump" size={14} color="white" />
    </View>
  );

  const CalendarIcon = () => (
    <View style={tw`w-6 h-6 rounded-full bg-green-500 items-center justify-center mr-3`}>
      <Ionicons name="calendar-outline" size={14} color="white" />
    </View>
  );

  const ChemicalIcon = () => (
    <View style={tw`w-6 h-6 rounded-full bg-green-500 items-center justify-center mr-3`}>
      <FontAwesome5 name="flask" size={12} color="white" />
    </View>
  );

  const CropIcon = () => (
    <View style={tw`w-6 h-6 rounded-full bg-green-500 items-center justify-center mr-3`}>
      <MaterialCommunityIcons name="seed-outline" size={14} color="white" />
    </View>
  );

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100`}>
      <View style={tw`flex-row items-center p-4 border-b border-gray-200 bg-white`}>
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={tw`ml-4 text-lg font-semibold`}>Spraying</Text>
      </View>
      
      <ScrollView contentContainerStyle={tw`pb-10`}>
        <View style={tw`bg-white`}>
          {/* Step 1: Address */}
          <View style={tw`p-4 border-b border-gray-100`}>
            <View style={tw`flex-row items-center mb-3`}>
              <LocationIcon />
              <Text style={tw`text-sm`}>Tell us your address</Text>
            </View>
            <TextInput
              placeholder="Enter address"
              style={tw`border border-gray-300 rounded-full py-3 px-4`}
              value={formData.address}
              onChangeText={(text) => handleInputChange('address', text)}
            />
          </View>

          {/* Step 2: Spraying Need */}
          <View style={tw`p-4 border-b border-gray-100`}>
            <View style={tw`flex-row items-center mb-3`}>
              <SprayingNeedIcon />
              <Text style={tw`text-sm`}>Tell us about your spraying need</Text>
            </View>
            <View style={tw`flex-row justify-between`}>
              <TextInput
                placeholder="Acres"
                style={tw`border border-gray-300 rounded-full py-3 px-4 w-5/12`}
                value={formData.acres}
                onChangeText={(text) => handleInputChange('acres', text)}
                keyboardType="numeric"
              />
              <TextInput
                placeholder="No. of Tank"
                style={tw`border border-gray-300 rounded-full py-3 px-4 w-5/12`}
                value={formData.numberOfTanks}
                onChangeText={(text) => handleInputChange('numberOfTanks', text)}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Step 3: Tanks to Spray */}
          <View style={tw`p-4 border-b border-gray-100`}>
            <View style={tw`flex-row items-center mb-3`}>
              <TanksIcon />
              <Text style={tw`text-sm`}>How many no. of tanks you want to spray?</Text>
            </View>
            <TextInput
              placeholder="Enter number of tanks"
              style={tw`border border-gray-300 rounded-full py-3 px-4`}
              value={formData.tanksToSpray}
              onChangeText={(text) => handleInputChange('tanksToSpray', text)}
              keyboardType="numeric"
            />
          </View>

          {/* Step 4: Spraying Date */}
          <View style={tw`p-4 border-b border-gray-100`}>
            <View style={tw`flex-row items-center mb-3`}>
              <CalendarIcon />
              <Text style={tw`text-sm`}>When you want spraying?</Text>
            </View>
            <View style={tw`relative`}>
              <TextInput
                placeholder="YYYY-MM-DD"
                style={tw`border border-gray-300 rounded-full py-3 px-4 pr-10`}
                value={formData.sprayingDate}
                onChangeText={(text) => handleInputChange('sprayingDate', text)}
              />
              <View style={tw`absolute right-3 top-3`}>
                <Ionicons name="calendar-outline" size={20} color="gray" />
              </View>
            </View>
          </View>

          {/* Step 5: Agrochemical Select */}
          <View style={tw`p-4 border-b border-gray-100`}>
            <View style={tw`flex-row items-center mb-3`}>
              <ChemicalIcon />
              <Text style={tw`text-sm`}>Select Agrochemical</Text>
            </View>
            <View style={tw`relative`}>
              <TextInput
                placeholder="Select agrochemical"
                style={tw`border border-gray-300 rounded-full py-3 px-4 pr-10`}
                value={formData.agrochemical}
                editable={false}
                pointerEvents="none"
              />
              <View style={tw`absolute right-3 top-3`}>
                <AntDesign name="down" size={16} color="gray" />
              </View>
            </View>
          </View>

          {/* Step 6: Crop Select */}
          <View style={tw`p-4 border-b border-gray-100`}>
            <View style={tw`flex-row items-center mb-3`}>
              <CropIcon />
              <Text style={tw`text-sm`}>Select Crop</Text>
            </View>
            <View style={tw`relative`}>
              <TextInput
                placeholder="Select crop"
                style={tw`border border-gray-300 rounded-full py-3 px-4 pr-10`}
                value={formData.crop}
                editable={false}
                pointerEvents="none"
              />
              <View style={tw`absolute right-3 top-3`}>
                <AntDesign name="down" size={16} color="gray" />
              </View>
            </View>
          </View>

          {/* Next Button */}
          <View style={tw`p-4`}>
            <TouchableOpacity 
              style={tw`bg-blue-500 rounded-full py-3 items-center`} 
              onPress={handleNextStep}
            >
              <Text style={tw`text-white font-bold`}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bhumeet Coupons Section */}
        <View style={tw`mt-4 p-4 bg-white`}>
          <Text style={tw`text-sm font-semibold mb-4`}>Bhumeet Coupons</Text>
          
          <View style={tw`border border-gray-200 rounded-lg p-4 mb-2`}>
            <View style={tw`flex-row items-start`}>
              <View style={tw`mt-1`}>
                <View style={tw`w-5 h-5 rounded-full border border-blue-500 items-center justify-center`}>
                  <View style={tw`w-3 h-3 rounded-full bg-blue-500`}></View>
                </View>
              </View>
              <View style={tw`ml-3 flex-1`}>
                <Text style={tw`font-semibold`}>20% OFF up to ₹500</Text>
                <Text style={tw`text-xs text-gray-500`}>Save ₹500 with this code ON MINIMUM AMOUNT OF ₹500</Text>
                <Text style={tw`text-sm font-semibold mt-2`}>FLAT20</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={tw`mt-4 bg-gray-200 py-2 items-center rounded`}
              onPress={handleApplyCoupon}
            >
              <Text style={tw`text-gray-800`}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Charges Section */}
        <View style={tw`mt-4 p-4 bg-white`}>
          <Text style={tw`text-sm font-semibold mb-4`}>Bhumeet Coupons</Text>
          
          <View style={tw`flex-row justify-between items-center`}>
            <Text style={tw`font-semibold`}>CHARGES</Text>
            <TouchableOpacity>
              <Text style={tw`text-blue-500 text-sm`}>View bill in detail</Text>
            </TouchableOpacity>
          </View>
          
          <View style={tw`border-t border-gray-200 my-4`}></View>
          
          <View style={tw`flex-row justify-between items-center`}>
            <Text style={tw`font-semibold`}>To Pay</Text>
            <Text style={tw`font-semibold`}>₹ {finalPrice.toFixed(2)}</Text>
          </View>
        </View>

        {/* Create Request Button */}
        <View style={tw`mt-4 p-4`}>
          <TouchableOpacity 
            style={tw`bg-blue-500 rounded-full py-3 items-center`} 
            onPress={handleCreateRequest}
          >
            <Text style={tw`text-white font-bold`}>Create Request</Text>
          </TouchableOpacity>
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
};

export default Spraying;