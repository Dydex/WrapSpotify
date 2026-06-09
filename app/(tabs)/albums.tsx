import { SafeAreaView } from "react-native-safe-area-context";
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Dimensions,
} from "react-native";
import { useEffect, useRef } from "react";
import TimeLines from "@/components/TimeLines";
import TopAlbumsList from "@/components/TopAlbumsList";
import { useSpotify } from "@/contexts/SpotifyContext";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const GREEN = "#8B5CF6";
const BG = "#0d1117";
const CARD_BG = "#1a1b1cc7";
const MUTED = "#6b7280";

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function AlbumsScreen() {
  const heroFade = useRef(new Animated.Value(0)).current;
  const heroSlide = useRef(new Animated.Value(-20)).current;
  const { topAlbums, loading, timeRange, setTimeRange } = useSpotify();

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
  }, [timeRange]);

  const topAlbum = topAlbums[0]?.album;
  const heroTitle = topAlbum?.name ?? "—";
  const heroArtist = topAlbum?.artists?.map((a) => a.name).join(", ") ?? "—";
  const heroAlbumArt = topAlbum?.images?.[1]?.url ?? topAlbum?.images?.[0]?.url;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <Text style={styles.headerTitle}>Your Top Albums</Text>

      {/* Tabs */}
      <TimeLines activeRange={timeRange} onRangeChange={setTimeRange} />

      {/* Hero Card */}
      <Animated.View
        style={[
          styles.heroCard,
          { opacity: heroFade, transform: [{ translateY: heroSlide }] },
        ]}
      >
        {/* Album art area */}
        <View style={styles.heroArtArea}>
          <View style={styles.albumArtCard}>
            {heroAlbumArt ? (
              <Image
                source={{ uri: heroAlbumArt }}
                style={styles.albumArtImage}
                contentFit="cover"
              />
            ) : (
              <View style={styles.albumArtInner}>
                <Ionicons name="disc-outline" size={52} color="#6b7280" />
              </View>
            )}
          </View>
        </View>

        {/* Badge */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>#1 Top Album</Text>
        </View>

        <Text style={styles.heroTitle}>{heroTitle}</Text>
        <Text style={styles.heroArtist}>{heroArtist}</Text>
      </Animated.View>

      {/* Collection header */}
      <Text style={styles.sectionTitle}>Your Collection</Text>

      {/* Album list */}
      <View style={{ height: 300 }}>
        <TopAlbumsList albums={topAlbums} loading={loading} />
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

  headerTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.3,
    marginTop: 16,
    marginBottom: 14,
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
    overflow: "hidden",
  },
  albumArtImage: {
    width: 90,
    height: 90,
    borderRadius: 14,
  },
  albumArtInner: {
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    backgroundColor: "#21163b",
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
});
