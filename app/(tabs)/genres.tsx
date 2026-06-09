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

const GENRE_COLORS = ["#1DB954", "#8B5CF6", "#3B82F6", "#EC4899", "#4B5563"];
const GENRE_EMOJIS = ["🔥", "🎤", "💙", "✨", "🎵"];

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

  // Create a map of artist ID to genres
  const artistGenreMap: Record<string, string[]> = {};
  topArtists.forEach((artist) => {
    if (artist.genres) {
      artistGenreMap[artist.id] = artist.genres;
    }
  });

  const genreCounts: Record<string, { count: number; topArtist: string }> = {};

  // Aggregate genres from topTracks (weighting genres by track play frequency)
  topTracks.forEach((track) => {
    if (!track.artists) return;
    track.artists.forEach((trackArtist) => {
      const genres = artistGenreMap[trackArtist.id];
      if (genres) {
        genres.forEach((genre) => {
          let formattedName = genre
            .split(" ")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");

          if (formattedName.toLowerCase() === "afrobeat" || formattedName.toLowerCase() === "afrobeats") {
            formattedName = "Afrobeats";
          }

          if (!genreCounts[formattedName]) {
            genreCounts[formattedName] = {
              count: 0,
              topArtist: trackArtist.name,
            };
          }
          genreCounts[formattedName].count += 1;
        });
      }
    });
  });

  // Fallback to topArtists direct aggregation if topTracks yields no genre data
  if (Object.keys(genreCounts).length === 0) {
    topArtists.forEach((artist) => {
      if (!artist.genres) return;
      artist.genres.forEach((genre) => {
        let formattedName = genre
          .split(" ")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");

        if (formattedName.toLowerCase() === "afrobeat" || formattedName.toLowerCase() === "afrobeats") {
          formattedName = "Afrobeats";
        }

        if (!genreCounts[formattedName]) {
          genreCounts[formattedName] = {
            count: 0,
            topArtist: artist.name,
          };
        }
        genreCounts[formattedName].count += 1;
      });
    });
  }

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
    const top4 = sortedGenres.slice(0, 4);
    const othersList = sortedGenres.slice(4);

    displayedGenres = top4.map((g, idx) => ({
      name: g.name,
      count: g.count,
      percentage: totalPoints > 0 ? Math.round((g.count / totalPoints) * 100) : 0,
      topArtist: g.topArtist,
      color: GENRE_COLORS[idx] || "#4B5563",
      emoji: GENRE_EMOJIS[idx] || "🎵",
    }));

    if (othersList.length > 0) {
      const othersCount = othersList.reduce((acc, g) => acc + g.count, 0);
      displayedGenres.push({
        name: "Others",
        count: othersCount,
        percentage: totalPoints > 0 ? Math.round((othersCount / totalPoints) * 100) : 0,
        topArtist: othersList[0]?.topArtist || "Various Artists",
        color: GENRE_COLORS[4],
        emoji: GENRE_EMOJIS[4],
      });
    }
  }

  // Adjust percentages so they sum to exactly 100% if needed
  const percentageSum = displayedGenres.reduce((acc, g) => acc + g.percentage, 0);
  if (percentageSum > 0 && percentageSum !== 100 && displayedGenres.length > 0) {
    const diff = 100 - percentageSum;
    displayedGenres[0].percentage += diff; // Adjust first element
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <Text style={styles.headerTitle}>Your Music Taste</Text>

        {/* Tabs */}
        <TimeLines activeRange={timeRange} onRangeChange={setTimeRange} />

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#1DB954" />
          </View>
        ) : displayedGenres.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="musical-notes-outline" size={48} color="#6b7280" style={{ marginBottom: 12 }} />
            <Text style={styles.emptyText}>No genre data available. Try playing more music!</Text>
          </View>
        ) : (
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            <TopGenresChart genres={displayedGenres} />
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0d1117",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
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
