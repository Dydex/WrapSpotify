import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { HelloWave } from "@/components/hello-wave";
import { SafeAreaView } from "react-native-safe-area-context";
import TopArtists from "@/components/TopArtistsList";
import { LinearGradient } from "expo-linear-gradient";
import TopTracksList from "@/components/TopTracksList";
import { useSpotify } from "@/contexts/SpotifyContext";
import { Image } from "expo-image";
import { useEffect, useRef } from "react";

export default function HomeScreen() {
  const {
    token,
    promptAsync,
    topTracks,
    topArtists,
    userProfile,
    loading,
    redirectUri,
    ready,
  } = useSpotify();

  // Show redirect URI as an Alert popup once so user can copy it
  const alertShown = useRef(false);
  useEffect(() => {
    if (!token && !alertShown.current) {
      alertShown.current = true;
      Alert.alert(
        "Spotify Redirect URI",
        `Add this exact URI to your Spotify Developer Dashboard:\n\n${redirectUri}`,
        [{ text: "OK" }]
      );
    }
  }, [token, redirectUri]);

  // Derive greeting based on time of day
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const displayName = userProfile?.display_name ?? "Music Lover";
  const firstName = displayName.split(" ")[0];
  const profileImage = userProfile?.images?.[0]?.url;

  // Derive top genre from artists
  const genreCounts: Record<string, number> = {};
  topArtists.forEach((a) =>
    a.genres.forEach((g) => {
      genreCounts[g] = (genreCounts[g] || 0) + 1;
    }),
  );
  const topGenre =
    Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Music";
  const topGenreDisplay =
    topGenre.charAt(0).toUpperCase() + topGenre.slice(1);

  // If not logged in, show login prompt
  if (!token) {
    return (
      <SafeAreaView style={[styles.Container, styles.loginContainer]}>
        <LinearGradient
          colors={["#1DB954", "#8B5CF6"]}
          style={styles.loginCard}
        >
          <Ionicons name="musical-notes" size={60} color="white" />
          <Text style={styles.loginTitle}>StatsSpotify</Text>
          <Text style={styles.loginSubtitle}>
            Connect your Spotify account to see your listening stats
          </Text>
          <TouchableOpacity
            style={[styles.loginButton, !ready && styles.loginButtonDisabled]}
            onPress={() => ready && promptAsync()}
            disabled={!ready}
            activeOpacity={0.85}
          >
            <Ionicons name="musical-note" size={20} color="#1DB954" />
            <Text style={styles.loginButtonText}>Connect with Spotify</Text>
          </TouchableOpacity>

          <View style={{ marginTop: 20, backgroundColor: 'rgba(0,0,0,0.3)', padding: 12, borderRadius: 12, width: '100%' }}>
            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, textAlign: 'center', marginBottom: 6 }}>
              Add this exact URI to your Spotify Dashboard → Redirect URIs:
            </Text>
            <Text selectable style={{ color: 'white', fontSize: 12, fontWeight: 'bold', textAlign: 'center' }}>
              {redirectUri}
            </Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.Container}>
      <View style={styles.titleContainer}>
        <View style={styles.greetingsContainer}>
          <Text style={styles.text}>
            {greeting}, {firstName}
          </Text>
          <HelloWave />
        </View>
        <LinearGradient
          style={styles.activeCircle}
          colors={["#1DB954", "#8B5CF6"]}
        >
          {profileImage ? (
            <Image
              source={{ uri: profileImage }}
              style={styles.profileImage}
              contentFit="cover"
            />
          ) : (
            <Ionicons name="person-circle" size={45} />
          )}
        </LinearGradient>
      </View>

      <LinearGradient
        colors={["#1DB954", "#8B5CF6"]}
        style={styles.stepContainer}
      >
        <Text style={styles.text}>Your Music DNA</Text>
        <Text style={styles.textSubtitle}>
          {topGenreDisplay}{" "}
          <Ionicons name="flame" size={20} color="#cb2c2c" />
        </Text>

        <View style={styles.statsContainer}>
          <View style={styles.statsGroup}>
            <Text style={styles.textStats}>
              <Ionicons name="musical-notes" size={15} color="white" />{" "}
              {topTracks.length}
              {"\n"} top tracks
            </Text>
          </View>
          <View style={styles.statsGroup}>
            <Text style={styles.textStats}>
              <Ionicons name="people" size={15} color="white" />{" "}
              {topArtists.length}
              {"\n"} top artists
            </Text>
          </View>
          <View style={styles.statsGroup}>
            <Text style={styles.textStats}>
              <Ionicons name="mic" size={15} color="white" />{" "}
              {userProfile?.followers?.total ?? 0}
              {"\n"} followers
            </Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.TopArtistContainer}>
        <Text style={styles.textArtist}>Top Artists This Month</Text>
        <Text style={styles.textArtist}>See All</Text>
      </View>
      <View>
        <TopArtists
          artists={topArtists.slice(0, 5)}
          showPlays={true}
          loading={loading}
        />
      </View>

      <View style={styles.TopTracksContainer}>
        <Text style={styles.textTrack}>Top Tracks This Month</Text>
        <Text style={styles.textTrack}>See All</Text>
      </View>

      <View style={{ height: 300 }}>
        <TopTracksList
          tracks={topTracks.slice(0, 5)}
          loading={loading}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    padding: 8,
  },
  loginContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loginCard: {
    width: "100%",
    padding: 40,
    borderRadius: 24,
    alignItems: "center",
    gap: 16,
  },
  loginTitle: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
  },
  loginSubtitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "white",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    marginTop: 8,
  },
  loginButtonText: {
    color: "#1DB954",
    fontSize: 16,
    fontWeight: "700",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  greetingsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  stepContainer: {
    width: "100%",
    padding: 20,
    gap: 10,
    borderRadius: 20,
    marginTop: 10,
  },
  text: {
    fontWeight: "bold",
    fontSize: 20,
    color: "white",
  },
  textSubtitle: {
    fontWeight: "bold",
    fontSize: 15,
    color: "white",
  },
  textStats: {
    fontWeight: "bold",
    fontSize: 10,
    color: "white",
  },
  textArtist: {
    fontWeight: "600",
    fontSize: 15,
    color: "white",
  },
  textTrack: {
    fontWeight: "600",
    fontSize: 15,
    color: "white",
  },
  statsGroup: {
    backgroundColor: "#7b5fc0",
    padding: 10,
    borderRadius: 10,
    width: 100,
  },
  TopArtistContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  TopTracksContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  activeCircle: {
    width: 45,
    height: 45,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 999,
  },
  loginButtonDisabled: {
    opacity: 0.5,
  },
});
