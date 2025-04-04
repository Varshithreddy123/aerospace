import React, { Component } from 'react';
import { Text, View, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import tw from "../../tailwind";
import Feather from 'react-native-vector-icons/Feather';
import { useRouter } from "expo-router";

// Option 1: Convert to functional component
const Providers = () => {
  const router = useRouter();
  
  return (
    <View style={tw`flex-1 bg-white pt-8`}>
      {/* Search bar */}
      <View style={tw`px-4 mb-4 relative`}>
        <View style={tw`flex-row items-center border border-gray-200 rounded-lg p-2 bg-gray-50`}>
          <Feather name="search" size={20} color="#718096" />
          <TextInput
            placeholder="Search for providers, services..."
            style={tw`flex-1 ml-2 text-gray-700`}
          />
          <TouchableOpacity>
            <Text style={tw`text-gray-400 px-2`}>⋮</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Services filter button */}
      <View style={tw`px-4 mb-4`}>
        <TouchableOpacity 
          style={tw`border border-blue-500 self-start rounded-full px-4 py-1 bg-blue-50`}
        >
          <Text style={tw`text-blue-500 text-sm`}>SERVICES FILTER</Text>
        </TouchableOpacity>
      </View>

      {/* Heading */}
      <Text style={tw`px-4 text-gray-600 mb-2`}>Select provider to create request</Text>

      {/* Provider list */}
      <ScrollView style={tw`px-4`}>
        <TouchableOpacity 
          style={tw`flex-row items-center bg-white rounded-lg p-4 border border-gray-200 mb-2`}
          onPress={() => router.push("/Spraying")}
        >
          <View style={tw`h-12 w-12 rounded-full bg-blue-500 items-center justify-center mr-4`}>
            <Text style={tw`text-white font-bold`}>B</Text>
          </View>
          <View>
            <Text style={tw`font-bold text-gray-800`}>BlueMeet Spraying Services</Text>
            <Text style={tw`text-xs text-gray-500`}>Clearwater, Minnesota</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

// Alternative Option 2: Keep class component but use withRouter HOC
/* 
import { withRouter } from "expo-router/withRouter";

class ProvidersClass extends Component {
  render() {
    const { router } = this.props;
    return (
      // Same JSX but using router from props
      // onPress={() => router.push('/spraying')}
    );
  }
}

export default withRouter(ProvidersClass);
*/

export default Providers;