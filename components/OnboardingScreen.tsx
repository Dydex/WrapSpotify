import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useSpotify } from "@/contexts/SpotifyContext";

const { width, height } = Dimensions.get("window");

const INTRO_SLIDES = [
  {
    title: "Wrap Spotify",
    description: "Unwrap your music world. Discover your top tracks, artists, and albums in a whole new way.",
    icon: "musical-notes",
    colors: ["#121824", "#2a150e"], // Deep sunset gradient
    accent: "#FF5A09",
  },
  {
    title: "Genre Analytics",
    description: "Get a visual breakdown of your favorite genres and sub-genres with beautiful interactive charts.",
    icon: "pie-chart",
    colors: ["#121824", "#201235"], // Deep violet/dark gradient
    accent: "#8B5CF6",
  },
  {
    title: "Time Travel",
    description: "Explore your top tracks and artists across different time periods.",
    icon: "time",
    colors: ["#121824", "#0e263d"], // Deep blue/ocean gradient
    accent: "#3B82F6",
  },
];

export default function OnboardingScreen() {
  const { promptAsync, ready, token, redirectUri } = useSpotify();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Animate slide entrance
  useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(20);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentSlide]);

  // Handle slide progress animation & auto-advance
  useEffect(() => {
    if (currentSlide < INTRO_SLIDES.length) {
      progressAnim.setValue(0);
      
      const anim = Animated.timing(progressAnim, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: false,
      });
      
      anim.start();

      const timer = setTimeout(() => {
        setCurrentSlide((prev) => prev + 1);
      }, 5000);

      return () => {
        anim.stop();
        clearTimeout(timer);
      };
    }
  }, [currentSlide]);

  const handleSkip = () => {
    setCurrentSlide(INTRO_SLIDES.length);
  };

  // Connect Screen
  if (currentSlide >= INTRO_SLIDES.length) {
    return (
      <View style={[styles.container, { backgroundColor: "#0d1117" }]}>
        <SafeAreaView style={styles.safe}>
          <View style={styles.connectContent}>
            {/* Logo area */}
            <View style={styles.logoContainer}>
              

            </View>

            {/* Description */}
            <Text style={styles.connectDescription}>
            Connect your Spotify account securely. By connecting, you agree to our{" "}
              <Text style={styles.privacyLink} onPress={() => setModalVisible(true)}>
                privacy policy
              </Text>
              .
            </Text>

            {/* Connect Button */}
            <TouchableOpacity
              style={[styles.connectButton, !ready && styles.connectButtonDisabled]}
              onPress={() => ready && promptAsync()}
              disabled={!ready}
              activeOpacity={0.85}
            >
              <Ionicons name="musical-note" size={20} color="white" />
              <Text style={styles.connectButtonText}>Connect Spotify</Text>
            </TouchableOpacity>

            {/* {Platform.OS !== 'web' && (
              <View style={styles.redirectNotice}>
                <Ionicons name="information-circle" size={14} color="#a3a3a3" style={{ marginTop: 2 }} />
                <Text style={styles.redirectNoticeText}>
                  Add this URI to Spotify Developer Dashboard Settings:{"\n"}
                  <Text style={styles.redirectUriBold}>{redirectUri}</Text>
                </Text>
              </View>
            )} */}
          </View>
        </SafeAreaView>

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
                <Ionicons name="shield-checkmark" size={24} color="#8B5CF6" />
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
      </View>
    );
  }

  const slide = INTRO_SLIDES[currentSlide];

  return (
    <View style={[styles.container, { backgroundColor: slide.colors[0] }]}>
      {/* Background Gradient Accent (Simulated with absolute views) */}
      <View style={[styles.gradientBg, { backgroundColor: slide.colors[1] }]} />

      <SafeAreaView style={styles.safe}>
        {/* Top Header Row */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={handleSkip} activeOpacity={0.7} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Content Area */}
        <Animated.View
          style={[
            styles.slideContent,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={[styles.iconContainer, { borderColor: slide.accent + "40" }]}>
            <Ionicons name={slide.icon as any} size={72} color={slide.accent} />
          </View>

          <Text style={styles.slideTitle}>{slide.title}</Text>
          <Text style={styles.slideDescription}>{slide.description}</Text>
        </Animated.View>

        {/* Bottom Control Bar */}
        <View style={styles.footerRow}>
          {/* Progress Indicators */}
          <View style={styles.indicatorsContainer}>
            {INTRO_SLIDES.map((_, idx) => {
              const isActive = idx === currentSlide;
              const widthStyle = isActive
                ? progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [6, 28],
                  })
                : 6;

              return (
                <Animated.View
                  key={idx}
                  style={[
                    styles.indicatorBar,
                    {
                      width: widthStyle,
                      backgroundColor: isActive ? slide.accent : "#ffffff20",
                    },
                  ]}
                />
              );
            })}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  gradientBg: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.45,
    opacity: 0.6,
    borderTopLeftRadius: width * 0.5,
    borderTopRightRadius: width * 0.5,
    transform: [{ scaleX: 1.5 }],
  },
  safe: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    zIndex: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 60,
  },
  headerLogo: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  skipButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    backgroundColor: "#ffffff10",
  },
  skipText: {
    color: "#a3a3a3",
    fontSize: 12,
    fontWeight: "600",
  },
  slideContent: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingHorizontal: 12,
    marginBottom: 40,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#161b2295",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 5,
  },
  slideTitle: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  slideDescription: {
    color: "#a3a3a3",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  footerRow: {
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  indicatorsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  indicatorBar: {
    height: 6,
    borderRadius: 3,
  },
  connectContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoIconBg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#161b22",
    borderWidth: 1,
    borderColor: "#21262d",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  logoTitle: {
    color: "#ffffff",
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  logoSubtitle: {
    color: "#6b7280",
    fontSize: 13,
    fontWeight: "500",
  },
  connectDescription: {
    color: "#9ca3af",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  privacyLink: {
    color: "#8B5CF6",
    textDecorationLine: "underline",
    fontWeight: "600",
  },
  connectButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#8B5CF6",
    width: "100%",
    height: 54,
    borderRadius: 27,
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  connectButtonDisabled: {
    opacity: 0.5,
  },
  connectButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
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
    color: "#8B5CF6",
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
  redirectNotice: {
    flexDirection: "row",
    gap: 6,
    marginTop: 24,
    backgroundColor: "#161b22",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#21262d",
    padding: 12,
    alignItems: "flex-start",
    width: "100%",
  },
  redirectNoticeText: {
    color: "#a3a3a3",
    fontSize: 11,
    lineHeight: 16,
    flex: 1,
  },
  redirectUriBold: {
    color: "#8B5CF6",
    fontWeight: "bold",
    fontSize: 11,
  },
});
