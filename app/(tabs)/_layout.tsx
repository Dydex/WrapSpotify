import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";
import { Image } from "expo-image";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSpotify } from "@/contexts/SpotifyContext";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { userProfile } = useSpotify();
  const avatarUrl = userProfile?.images?.[1]?.url ?? userProfile?.images?.[0]?.url;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="artists"
        options={{
          title: "Artists",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "people" : "people-outline"}
              size={28}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
      name="tracks"
      options={{
        title: "Tracks",
        tabBarIcon: ({ color, focused }) => (
          <Ionicons
            name={focused ? "musical-notes" : "musical-notes-outline"}
            size={28}
            color={color}
          />
        ),
      }}
      />
      <Tabs.Screen
      name="albums"
      options={{
        title: "Albums",
        tabBarIcon: ({ color, focused }) => (
          <Ionicons
            name={focused ? "disc" : "disc-outline"}
            size={28}
            color={color}
          />
        ),
      }}
      />
      <Tabs.Screen
      name="genres"
      options={{
        title: "Genres",
        tabBarIcon: ({ color, focused }) => (
          <Ionicons
            name={focused ? "bar-chart" : "bar-chart-outline"}
            size={28}
            color={color}
          />
        ),
      }}
      />
      <Tabs.Screen
      name="profile"
      options={{
        title: "Profile",
        tabBarIcon: ({ color, focused }) => {
          if (avatarUrl) {
            return (
              <View style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                overflow: 'hidden',
                borderWidth: focused ? 2 : 1,
                borderColor: focused ? Colors[colorScheme ?? "light"].tint : color,
              }}>
                <Image
                  source={{ uri: avatarUrl }}
                  style={{ width: '100%', height: '100%' }}
                  contentFit="cover"
                />
              </View>
            );
          }
          return (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={28}
              color={color}
            />
          );
        },
      }}
      />

    </Tabs>
  );
}
