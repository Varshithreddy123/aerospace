import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import Feather from "react-native-vector-icons/Feather";
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarLabelStyle: {
          fontWeight: '400', // This makes the font thin
          fontSize: 12,
          color: "black"
           // Optional: adjust the font size if needed
        },
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
            height: 60, // Increase the height (default is typically around 49-50)
          },
          default: {
            height: 60, // Increase the height for other platforms too
          },
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            // <IconSymbol size={28} name="house.fill" color={color} />
            <Feather name="home" size={28} color="black" />
            
          ),
        }}
      />
      <Tabs.Screen
        name="providers"
        options={{
          title: "Providers",
          tabBarIcon: ({ color }) => (
            // <IconSymbol size={28} name="paperplane.fill" color={color} />
            <Feather name="user" size={28} color="black" />
          ),
        }}
      />
      <Tabs.Screen
        name="requests" // Changed from "Settings" to "settings"
        options={{
          title: "Requests",
          tabBarIcon: ({ color }) => (
           <MaterialCommunityIcons name="web-refresh" size={28} color="black" />
          ), // Maybe use a more appropriate icon
        }}
      />
      <Tabs.Screen
        name="read" // Changed from "Settings" to "settings"
        options={{
          title: "Read",
          tabBarIcon: ({ color }) => (
            <Feather name="file" size={28} color="black" />
          ), // Maybe use a more appropriate icon
        }}
      />
      <Tabs.Screen
        name="more" // Changed from "Settings" to "settings"
        options={{
          title: "More",
          tabBarIcon: ({ color }) => (
            <Feather name="more-horizontal" size={28} color="black" />
          ), // Maybe use a more appropriate icon
        }}
      />
    </Tabs>
  );
}
