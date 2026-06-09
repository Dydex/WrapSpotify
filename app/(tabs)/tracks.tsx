import { SafeAreaView } from "react-native-safe-area-context";
import {
  StyleSheet,
  View,
  Text,
  Animated,
  TouchableOpacity,
} from "react-native";
import TimeLines from "@/components/TimeLines";
import TopTracksList from "@/components/TopTracksList";
import { useEffect, useRef } from "react";
import { useSpotify } from "@/contexts/SpotifyContext";
import { Image } from "expo-image";
import { formatDuration } from "@/hooks/use-Spotify-Data";

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function TracksScreen() {
  const heroFade = useRef(new Animated.Value(0)).current;
  const heroSlide = useRef(new Animated.Value(-20)).current;
  const { topTracks, loading, timeRange, setTimeRange } = useSpotify();

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

  const topTrack = topTracks[0];
  const heroTitle = topTrack?.name ?? "No top track";
  const heroArtist = topTrack?.artists?.[0]?.name ?? "Unknown Artist";
  const heroAlbumArt = topTrack?.album?.images?.[0]?.url;

  return (
    <SafeAreaView style={styles.Container}>
      <View>
        <Text style={styles.text}>Your Top Tracks</Text>
      </View>

      <TimeLines activeRange={timeRange} onRangeChange={setTimeRange} />

      <Animated.View
        style={[
          styles.heroCard,
          { opacity: heroFade, transform: [{ translateY: heroSlide }] },
        ]}
      >
        <View style={styles.badge}>
          <Text style={styles.badgeEmoji}>🏆</Text>
          <Text style={styles.badgeText}>Your #1 Track</Text>
        </View>

        {heroAlbumArt && (
          <Image
            source={{ uri: heroAlbumArt }}
            style={styles.heroAlbumArt}
            contentFit="cover"
          />
        )}

        <Text style={styles.heroTitle}>{heroTitle}</Text>
        <Text style={styles.heroArtist}>{heroArtist}</Text>
        {topTrack && (
          <Text style={styles.heroPlays}>
            {formatDuration(topTrack.duration_ms)}
          </Text>
        )}
      </Animated.View>

      <View style={{ height: 410 }}>
        <TopTracksList
          tracks={topTracks}
          showPlays={true}
          loading={loading}
        />
      </View>
    </SafeAreaView>
  );
}

const GREEN = "#22c55e";
const BG = "#0d1117";
const CARD_BG = "#1a1b1cc7";
const MUTED = "#6b7280";

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    padding: 8,
  },
  text: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  waveform: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 40,
    gap: 2.5,
    marginBottom: 16,
  },
  waveBar: {
    width: 4,
    backgroundColor: GREEN,
    borderRadius: 2,
  },
  heroCard: {
    marginHorizontal: 20,
    backgroundColor: CARD_BG,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    overflow: "hidden",
  },
  heroAlbumArt: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginBottom: 12,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#1a2e1a",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 12,
  },
  badgeEmoji: {
    fontSize: 11,
  },
  badgeText: {
    color: GREEN,
    fontSize: 11,
    fontWeight: "600",
  },
  heroTitle: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 2,
    letterSpacing: -0.5,
  },
  heroArtist: {
    color: GREEN,
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 4,
  },
  heroPlays: {
    color: MUTED,
    fontSize: 12,
    marginBottom: 16,
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
    backgroundColor: GREEN,
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
});
