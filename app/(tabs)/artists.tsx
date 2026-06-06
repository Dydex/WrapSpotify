import TimeLines from "@/components/TimeLines";
import TopArtistsCard from "@/components/TopArtistCard";
import TopArtistsList from "@/components/TopArtistsList";
import { StyleSheet, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSpotify } from "@/contexts/SpotifyContext";

export default function ArtistsScreen() {
  const { topArtists, loading, timeRange, setTimeRange } = useSpotify();

  return (
    <SafeAreaView style={styles.Container}>
      <View>
        <Text style={styles.text}>Your Top Artists</Text>
      </View>

      <TimeLines activeRange={timeRange} onRangeChange={setTimeRange} />

      <TopArtistsCard artists={topArtists} loading={loading} />

      <View>
        <TopArtistsList
          artists={topArtists}
          horizontal={false}
          showGenre={true}
          showId={true}
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
  text: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});
