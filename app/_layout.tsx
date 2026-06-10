import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { SpotifyProvider, useSpotify } from '@/contexts/SpotifyContext';
import OnboardingScreen from '@/components/OnboardingScreen';

export const unstable_settings = {
  anchor: '(tabs)',
};

import { View, Text, ActivityIndicator } from 'react-native';

function AppNavigator() {
  const { token, isExchanging } = useSpotify();

  if (isExchanging) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0d1117', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={{ color: 'white', marginTop: 16, fontSize: 16, fontWeight: '600' }}>
          Connecting to Spotify...
        </Text>
      </View>
    );
  }

  if (!token) {
    return <OnboardingScreen />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SpotifyProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AppNavigator />
        <StatusBar style="auto" />
      </ThemeProvider>
    </SpotifyProvider>
  );
}
