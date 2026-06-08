import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useSpotify } from "@/contexts/SpotifyContext";

export default function ProfileScreen() {
  const { token, userProfile, logout, promptAsync, ready } = useSpotify();

  if (!token) {
    return (
      <SafeAreaView style={[styles.safe, styles.center]}>
        <Ionicons name="lock-closed-outline" size={48} color="#6b7280" style={{ marginBottom: 16 }} />
        <Text style={styles.loginTitle}>Spotify Connection Required</Text>
        <Text style={styles.loginSubtitle}>
          Please connect your Spotify account to view your profile.
        </Text>
        <TouchableOpacity
          style={[styles.loginButton, !ready && styles.loginButtonDisabled]}
          onPress={() => ready && promptAsync()}
          disabled={!ready}
          activeOpacity={0.85}
        >
          <Ionicons name="musical-note" size={20} color="white" />
          <Text style={styles.loginButtonText}>Connect Spotify</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const avatarUrl = userProfile?.images?.[1]?.url ?? userProfile?.images?.[0]?.url;
  const displayName = userProfile?.display_name ?? "Spotify User";
  const followersCount = userProfile?.followers?.total ?? 0;
  const productTier = userProfile?.product ?? "free";
  const country = userProfile?.country ?? "US";

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <View style={styles.headerContainer}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatar} contentFit="cover" />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Ionicons name="person" size={48} color="#9ca3af" />
            </View>
          )}
          <Text style={styles.displayName}>{displayName}</Text>
          
          <View style={styles.metaRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{productTier.toUpperCase()}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{country}</Text>
            </View>
          </View>
          
          <Text style={styles.followersText}>
            {followersCount.toLocaleString()} {followersCount === 1 ? "follower" : "followers"}
          </Text>
        </View>

        {/* Options Card List */}
        <View style={styles.optionsCard}>
          {/* Data & Privacy */}
          <TouchableOpacity style={styles.optionRow} activeOpacity={0.7}>
            <View style={styles.optionLeft}>
              <Ionicons name="shield-outline" size={22} color="#ffffff" style={styles.optionIcon} />
              <Text style={styles.optionText}>Data & Privacy</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#6b7280" />
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* About Statify */}
          <TouchableOpacity style={styles.optionRow} activeOpacity={0.7}>
            <View style={styles.optionLeft}>
              <Ionicons name="information-circle-outline" size={22} color="#ffffff" style={styles.optionIcon} />
              <Text style={styles.optionText}>About Statify</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Disconnect Button */}
        <TouchableOpacity style={styles.disconnectButton} onPress={logout} activeOpacity={0.85}>
          <Text style={styles.disconnectText}>Disconnect Spotify</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0d1117",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
    alignItems: "center",
  },
  loginTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  loginSubtitle: {
    color: "#6b7280",
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 30,
    marginBottom: 24,
  },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#1DB954",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
  },
  loginButtonDisabled: {
    opacity: 0.5,
  },
  loginButtonText: {
    color: "white",
    fontWeight: "700",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#21262d",
  },
  avatarPlaceholder: {
    backgroundColor: "#161b22",
    justifyContent: "center",
    alignItems: "center",
  },
  displayName: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  metaRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  badge: {
    backgroundColor: "#21262d",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: "#1DB954",
    fontSize: 11,
    fontWeight: "700",
  },
  followersText: {
    color: "#6b7280",
    fontSize: 13,
    fontWeight: "500",
  },
  optionsCard: {
    width: "100%",
    backgroundColor: "#161b22",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#21262d",
    paddingVertical: 4,
    marginBottom: 36,
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  optionIcon: {
    width: 24,
    textAlign: "center",
  },
  optionText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#21262d",
    marginHorizontal: 16,
  },
  disconnectButton: {
    width: "100%",
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#e11d48",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  disconnectText: {
    color: "#ef4444",
    fontSize: 15,
    fontWeight: "600",
  },
});
