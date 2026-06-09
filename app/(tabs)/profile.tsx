import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useSpotify } from "@/contexts/SpotifyContext";

export default function ProfileScreen() {
  const { userProfile, logout } = useSpotify();
  const [modalVisible, setModalVisible] = useState(false);
  const [aboutModalVisible, setAboutModalVisible] = useState(false);

  const avatarUrl = userProfile?.images?.[1]?.url ?? userProfile?.images?.[0]?.url;
  const displayName = userProfile?.display_name ?? "Spotify User";
  const followersCount = userProfile?.followers?.total ?? 0;
  const productTier = userProfile?.product ?? "free";

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
          </View>
          
          <Text style={styles.followersText}>
            {followersCount.toLocaleString()} {followersCount === 1 ? "follower" : "followers"}
          </Text>
        </View>

        {/* Options Card List */}
        <View style={styles.optionsCard}>
          {/* Data & Privacy */}
          <TouchableOpacity 
            style={styles.optionRow} 
            activeOpacity={0.7}
            onPress={() => setModalVisible(true)}
          >
            <View style={styles.optionLeft}>
              <Ionicons name="shield-outline" size={22} color="#ffffff" style={styles.optionIcon} />
              <Text style={styles.optionText}>Data & Privacy</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#6b7280" />
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* About Wrap Spotify */}
          <TouchableOpacity 
            style={styles.optionRow} 
            activeOpacity={0.7}
            onPress={() => setAboutModalVisible(true)}
          >
            <View style={styles.optionLeft}>
              <Ionicons name="information-circle-outline" size={22} color="#ffffff" style={styles.optionIcon} />
              <Text style={styles.optionText}>About Wrap Spotify</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Disconnect Button */}
        <TouchableOpacity style={styles.disconnectButton} onPress={logout} activeOpacity={0.85}>
          <Text style={styles.disconnectText}>Disconnect Spotify</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Privacy Policy Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Ionicons name="shield-checkmark" size={24} color="#1DB954" />
              <Text style={styles.modalTitle}>Data & Privacy Policy</Text>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false} style={styles.modalBody}>
              <Text style={styles.policyText}>
                Wrap Spotify values your trust and is built with data transparency and user privacy as core principles.
              </Text>
              
              <View style={styles.policySection}>
                <Text style={styles.policySubTitle}>1. Zero Data Retention</Text>
                <Text style={styles.policyBody}>
                  Wrap Spotify does not store, collect, or transmit any of your personal music data or Spotify account credentials. All analytical calculations (genres, top artists, tracks) are computed completely on your local device.
                </Text>
              </View>

              <View style={styles.policySection}>
                <Text style={styles.policySubTitle}>2. Spotify API Authentication</Text>
                <Text style={styles.policyBody}>
                  Authentication is handled securely using Spotify's official OAuth mechanism. We only request read-only scopes (`user-top-read`, `user-read-recently-played`, `user-library-read`) to retrieve and display statistics.
                </Text>
              </View>

              <View style={styles.policySection}>
                <Text style={styles.policySubTitle}>3. Local Session Control</Text>
                <Text style={styles.policyBody}>
                  Your access credentials are kept strictly in your local device storage. To terminate your session and clear all local data, simply click "Disconnect Spotify" on the profile screen.
                </Text>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
              activeOpacity={0.85}
            >
              <Text style={styles.modalCloseText}>Got It</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* About Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={aboutModalVisible}
        onRequestClose={() => setAboutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Ionicons name="information-circle" size={24} color="#1DB954" />
              <Text style={styles.modalTitle}>About Wrap Spotify</Text>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false} style={styles.modalBody}>
              <Text style={styles.policyText}>
                Wrap Spotify provides beautiful, personalized listening analytics, helping you explore your music trends year-round.
              </Text>
              
              <View style={styles.policySection}>
                <Text style={styles.policySubTitle}>Independent Companion App</Text>
                <Text style={styles.policyBody}>
                  Wrap Spotify is built independently. It is not associated, affiliated, authorized, endorsed by, or in any way officially connected with Spotify AB, Spotify USA Inc., or any of their subsidiaries.
                </Text>
              </View>

              <View style={styles.policySection}>
                <Text style={styles.policySubTitle}>Secure Local Computation</Text>
                <Text style={styles.policyBody}>
                  Your statistics are processed strictly on your device using temporary access tokens fetched directly from Spotify's secure APIs. No servers are operated to collect, store, or transmit your credentials.
                </Text>
              </View>

              <View style={styles.policySection}>
                <Text style={styles.policySubTitle}>Trademarks Notice</Text>
                <Text style={styles.policyBody}>
                  The name "Spotify" and its official logos are registered trademarks owned by Spotify AB. Use of these names does not imply any affiliation with or endorsement by them.
                </Text>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setAboutModalVisible(false)}
              activeOpacity={0.85}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    backgroundColor: "#161b22",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#21262d",
    width: "100%",
    maxHeight: "80%",
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 18,
  },
  modalTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
  modalBody: {
    marginBottom: 20,
  },
  policyText: {
    color: "#e5e7eb",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  policySection: {
    marginBottom: 16,
  },
  policySubTitle: {
    color: "#1DB954",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  policyBody: {
    color: "#9ca3af",
    fontSize: 13,
    lineHeight: 18,
  },
  modalCloseButton: {
    backgroundColor: "#21262d",
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#30363d",
  },
  modalCloseText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  privacyLink: {
    color: "#1DB954",
    textDecorationLine: "underline",
    fontWeight: "600",
  },
  flex1: {
    flex: 1,
  },
});
