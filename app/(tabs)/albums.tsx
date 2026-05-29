import { SafeAreaView } from "react-native-safe-area-context";
import {
  StyleSheet,
  View,
  Text,
  Animated,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import TimeLines from "@/components/TimeLines";
import TopAlbumsList from "@/components/TopAlbumsList";

const { width } = Dimensions.get("window");

const GREEN = "#22c55e";
const BG = "#0d1117";
const CARD_BG = "#1a1b1cc7";
const MUTED = "#6b7280";



// ── Vinyl Disc ────────────────────────────────────────────────────────────────
const VinylDisc = ({
  size = 80,
  color = "#2a2f3e",
  spinning = false,
}: {
  size?: number;
  color?: string;
  spinning?: boolean;
}) => {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!spinning) return;
    const spin = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      }),
    );
    spin.start();
    return () => spin.stop();
  }, [spinning]);

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 2,
          borderColor: "#1a1f2e",
        },
        spinning && { transform: [{ rotate }] },
      ]}
    >
      {/* Rings */}
      <View
        style={{
          width: size * 0.7,
          height: size * 0.7,
          borderRadius: size * 0.35,
          borderWidth: 1,
          borderColor: "#ffffff10",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: size * 0.4,
            height: size * 0.4,
            borderRadius: size * 0.2,
            borderWidth: 1,
            borderColor: "#ffffff10",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Center hole */}
          <View
            style={{
              width: size * 0.12,
              height: size * 0.12,
              borderRadius: size * 0.06,
              backgroundColor: BG,
            }}
          />
        </View>
      </View>
    </Animated.View>
  );
};

// ── Album Row ─────────────────────────────────────────────────────────────────


// ── Main Screen ───────────────────────────────────────────────────────────────
export default function AlbumsScreen() {
  const [isPlaying, setIsPlaying] = useState(false);
  const heroFade = useRef(new Animated.Value(0)).current;
  const heroSlide = useRef(new Animated.Value(-20)).current;
  

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heroFade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(heroSlide, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  

  return (
    <SafeAreaView style={styles.safe}>
      
        {/* Header */}
        <Text style={styles.headerTitle}>Your Top Albums</Text>

        {/* Tabs */}
        <TimeLines />

        {/* Hero Card */}
        <Animated.View
          style={[
            styles.heroCard,
            { opacity: heroFade, transform: [{ translateY: heroSlide }] },
          ]}
        >
        

          {/* Album art area */}
          <View style={styles.heroArtArea}>
            {/* Back vinyl (shadow) */}
            <View style={[styles.vinylBack]}>
              <VinylDisc size={90} color="#1a1f2e" />
            </View>
            {/* Front album art card */}
            <View style={styles.albumArtCard}>
              <View style={styles.albumArtInner}>
                <VinylDisc size={52} color="#3b4a6b" spinning={isPlaying} />
              </View>
            </View>
          </View>

          {/* Badge */}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>#1 Most Played</Text>
          </View>

          <Text style={styles.heroTitle}>Love, Damini</Text>
          <Text style={styles.heroArtist}>Burna Boy</Text>
          <Text style={styles.heroPlays}>Played 23 times this month</Text>

          {/* Play button */}
          <TouchableOpacity
            style={[styles.playBtn, isPlaying && styles.playBtnActive]}
            onPress={() => setIsPlaying((p) => !p)}
            activeOpacity={0.85}
          >
            {isPlaying ? (
              <View style={styles.pauseIcon}>
                <View style={styles.pauseBar} />
                <View style={styles.pauseBar} />
              </View>
            ) : (
              <View style={styles.playIcon} />
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* Collection header */}
        <Text style={styles.sectionTitle}>Your Collection</Text>

        {/* Album list */}
        <View style={{ height: 300 }} >
            <TopAlbumsList />
        </View>
        
     
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingHorizontal: 20,
  },
 
  scrollContent: {
    
  },

  headerTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.3,
    marginTop: 16,
    marginBottom: 14,
  },

  // Tabs
  tabContainer: {
    marginBottom: 20,
  },
  tabRow: {
    flexDirection: "row",
  },
  tabBtn: {
    width: 80,
    paddingBottom: 8,
  },
  tabText: {
    color: MUTED,
    fontSize: 13,
    fontWeight: "500",
  },
  tabTextActive: {
    color: GREEN,
    fontWeight: "600",
  },
  tabIndicator: {
    height: 2,
    width: 48,
    backgroundColor: GREEN,
    borderRadius: 1,
    marginTop: -2,
  },

  // Hero
  heroCard: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    padding: 18,
    marginBottom: 24,
    overflow: "hidden",
    minHeight: 200,
  },
  heroBgCircle: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#0f2d1a",
    right: -40,
    top: -40,
  },
  heroArtArea: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    height: 100,
  },
  vinylBack: {
    position: "absolute",
    left: 70,
    top: 5,
    opacity: 0.6,
  },
  albumArtCard: {
    width: 90,
    height: 90,
    borderRadius: 14,
    backgroundColor: "#232a3e",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  albumArtInner: {
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    backgroundColor: "#1a2e1a",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 10,
  },
  badgeText: {
    color: GREEN,
    fontSize: 11,
    fontWeight: "600",
  },
  heroTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 2,
    letterSpacing: -0.4,
  },
  heroArtist: {
    color: MUTED,
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 4,
  },
  heroPlays: {
    color: GREEN,
    fontSize: 12,
    fontWeight: "500",
  },
  playBtn: {
    position: "absolute",
    right: 18,
    bottom: 18,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
  },
  playBtnActive: {
    backgroundColor: "#16a34a",
  },
  playIcon: {
    width: 0,
    height: 0,
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderLeftWidth: 14,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: BG,
    marginLeft: 3,
  },
  pauseIcon: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  pauseBar: {
    width: 3,
    height: 14,
    backgroundColor: BG,
    borderRadius: 2,
  },

  // Section
  sectionTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    letterSpacing: -0.2,
  },

  

  // Bottom nav
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#10141e",
    borderTopWidth: 0.5,
    borderTopColor: "#1e2533",
    paddingTop: 10,
    paddingBottom: 24,
    justifyContent: "space-around",
  },
  navItem: {
    alignItems: "center",
    gap: 3,
  },
  navIcon: {
    fontSize: 20,
    opacity: 0.4,
  },
  navIconActive: {
    opacity: 1,
  },
  navLabel: {
    fontSize: 9,
    color: "#4b5563",
    fontWeight: "500",
  },
  navLabelActive: {
    color: GREEN,
  },
});
