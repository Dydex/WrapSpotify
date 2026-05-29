import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, Platform, StyleSheet } from "react-native";
import { HelloWave } from "@/components/hello-wave";
import { SafeAreaView } from "react-native-safe-area-context";
import TopArtists from "@/components/TopArtistsList";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import TopTracksList from "@/components/TopTracksList";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.Container}>
      <View style={styles.titleContainer}>
        <View style={styles.greetingsContainer}>
          <Text style={styles.text}>Good morning, David</Text>
          <HelloWave />
        </View>
        <LinearGradient
          style={styles.activeCircle}
          colors={["#1DB954", "#8B5CF6"]}
        >
          <Ionicons name="person-circle" size={45} />
        </LinearGradient>
      </View>
      <LinearGradient
        colors={["#1DB954", "#8B5CF6"]}
        style={styles.stepContainer}
      >
        <Text style={styles.text}>Your Music DNA</Text>
        <Text style={styles.textSubtitle}>
          Afrobeats <Ionicons name="flame" size={20} color="#cb2c2c" />
        </Text>

        <View style={styles.statsContainer}>
          <View style={styles.statsGroup}>
            <Text style={styles.textStats}>
              <Ionicons name="musical-notes" size={15} color="white" /> 1,247
              mins {"\n"} this week{" "}
            </Text>
          </View>
          <View style={styles.statsGroup}>
            <Text style={styles.textStats}>
              <Ionicons name="flame" size={15} color="white" /> 23 days {"\n"}{" "}
              streak
            </Text>
          </View>
          <View style={styles.statsGroup}>
            <Text style={styles.textStats}>
              <Ionicons name="mic" size={15} color="white" /> 47 artists {"\n"}{" "}
              this month
            </Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.TopArtistContainer}>
        <Text style={styles.textArtist}>Top Artists This Month</Text>
        <Text style={styles.textArtist}>See All</Text>
      </View>
      <View>
        <TopArtists showPlays={true} />
      </View>

      <View style={styles.TopTracksContainer}>
        <Text style={styles.textTrack}>Top Tracks This Month</Text>
        <Text style={styles.textTrack}>See All</Text>
      </View>

      <View style={{ height: 300 }}>
        <TopTracksList />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    padding: 8,
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
    fontWeight: "semibold",
    fontSize: 15,
    color: "white",
  },
  textTrack: {
    fontWeight: "semibold",
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
  },
});
