import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Animated,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useSpotify } from "@/contexts/SpotifyContext";
import TimeLines from "@/components/TimeLines";
import TopGenresChart, { type GenreItem } from "@/components/TopGenresChart";

const GENRE_COLORS = [
  "#1DB954", // Spotify Green
  "#8B5CF6", // Violet
  "#3B82F6", // Blue
  "#EC4899", // Pink
  "#F59E0B", // Amber/Yellow
  "#10B981", // Emerald
  "#EF4444", // Red
  "#06B6D4", // Cyan
  "#84CC16", // Lime
  "#A855F7", // Purple
  "#F97316", // Orange
  "#00f2fe", // Bright Cyan
  "#4facfe", // Bright Blue
  "#ff0844", // Bright Pink
  "#ffb199", // Soft Peach
];
const GENRE_EMOJIS = ["🔥", "🎤", "💙", "✨", "🎵", "🎸", "🎧", "🎷", "🎹", "🎺", "🥁", "🎻", "🎼", "🌟", "💫"];

export default function GenresScreen() {
  const { topTracks, topArtists, loading, timeRange, setTimeRange } = useSpotify();
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [timeRange]);

  // Helper to format genre name properly
  const formatGenreName = (genre: string): string => {
    let name = genre
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    if (name.toLowerCase() === "afrobeat" || name.toLowerCase() === "afrobeats") {
      name = "Afrobeats";
    } else if (name.startsWith("Uk ")) {
      name = "UK " + name.slice(3);
    } else if (name === "Uk") {
      name = "UK";
    }
    return name;
  };

  // Create a map of artist ID to genres
  const artistGenreMap: Record<string, string[]> = {};
  topArtists.forEach((artist) => {
    if (artist.genres) {
      artistGenreMap[artist.id] = artist.genres;
    }
  });

  const genreCounts: Record<string, { count: number; topArtist: string }> = {};

  // 1. Primary Source: Aggregate genres directly from all topArtists
  topArtists.forEach((artist) => {
    if (!artist.genres) return;
    artist.genres.forEach((genre) => {
      const formattedName = formatGenreName(genre);
      if (!genreCounts[formattedName]) {
        genreCounts[formattedName] = {
          count: 0,
          topArtist: artist.name,
        };
      }
      genreCounts[formattedName].count += 3; // base weight for top artists
    });
  });

  // 2. Secondary Source: Aggregate genres from topTracks to add active listening weight
  topTracks.forEach((track) => {
    if (!track.artists) return;
    track.artists.forEach((trackArtist) => {
      const genres = artistGenreMap[trackArtist.id];
      if (genres) {
        genres.forEach((genre) => {
          const formattedName = formatGenreName(genre);
          if (!genreCounts[formattedName]) {
            genreCounts[formattedName] = {
              count: 0,
              topArtist: trackArtist.name,
            };
          }
          genreCounts[formattedName].count += 1; // active listening weight
        });
      }
    });
  });

  const sortedGenres = Object.entries(genreCounts)
    .map(([name, data]) => ({
      name,
      count: data.count,
      topArtist: data.topArtist,
    }))
    .sort((a, b) => b.count - a.count);

  const totalPoints = sortedGenres.reduce((acc, g) => acc + g.count, 0);

  let displayedGenres: GenreItem[] = [];
  if (sortedGenres.length > 0) {
    displayedGenres = sortedGenres.slice(0, 13).map((g, idx) => ({
      name: g.name,
      count: g.count,
      percentage: totalPoints > 0 ? Math.round((g.count / totalPoints) * 100) : 0,
      topArtist: g.topArtist,
      color: GENRE_COLORS[idx % GENRE_COLORS.length],
      emoji: GENRE_EMOJIS[idx % GENRE_EMOJIS.length] || "🎵",
    }));
  }

  // Adjust percentages so they sum to exactly 100% if needed
  const percentageSum = displayedGenres.reduce((acc, g) => acc + g.percentage, 0);
  if (percentageSum > 0 && percentageSum !== 100 && displayedGenres.length > 0) {
    const diff = 100 - percentageSum;
    displayedGenres[0].percentage += diff; // Adjust first element
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Header */}
        <Text style={styles.headerTitle}>Your Music Taste</Text>

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#8B5CF6" />
          </View>
        ) : displayedGenres.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="musical-notes-outline" size={48} color="#6b7280" style={{ marginBottom: 12 }} />
            <Text style={styles.emptyText}>No genre data available. Try playing more music!</Text>
          </View>
        ) : (
          <Animated.View 
            style={[
              styles.contentContainer,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <TimeLines activeRange={timeRange} onRangeChange={setTimeRange} />
            <TopGenresChart genres={displayedGenres} />
          </Animated.View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0d1117",
  },
  container: {
    paddingHorizontal: 10,
  
  },
  contentContainer: {
    gap: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.3,
    marginTop: 16,
    marginBottom: 20,
  },
  loaderContainer: {
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  emptyText: {
    color: "#6b7280",
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 40,
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
});
