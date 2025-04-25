import { useEffect, useState } from "react";
import { ThemeProvider, DarkTheme, DefaultTheme } from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "@/hooks/useColorScheme";
import "../i18n/i18n"; // Import i18n setup
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n/i18n";
import {
  useFonts,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_900Black,
} from "@expo-google-fonts/inter";

import WelcomeScreen from "./screens/WelcomeScreen";
import OtpScreen from "./screens/OtpScreen";
import Spraying from "./Spraying";
import FieldLocation from "./FieldLocation";
import React from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_900Black,
  });

  const colorScheme = useColorScheme();
  const [step, setStep] = useState("welcome"); // 'welcome' → 'otp' → 'main'

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null; // Don't render until fonts load

  // Show Welcome Screen first
  if (step === "welcome") {
    return <WelcomeScreen onFinish={() => setStep("otp")} />;
  }

  // Show OTP Screen after Welcome
  if (step === "otp") {
    return <OtpScreen onVerify={() => setStep("main")} />;
  }

  // Main App Layout after OTP verification
  return (
    <ThemeProvider value={colorScheme === "light" ? DarkTheme : DefaultTheme}>
      <I18nextProvider i18n={i18n}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="location" options={{ title: "Select Location" }} />
        <Stack.Screen name="notification" options={{ title: "Notification" }} />
        <Stack.Screen name="fieldlocation" options={{ title: "FieldLocation" }} />
      </Stack>
      </I18nextProvider>
    </ThemeProvider>
  );
}

