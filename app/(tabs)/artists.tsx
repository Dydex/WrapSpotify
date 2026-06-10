import { useState } from "react";
import TimeLines from "@/components/TimeLines";
import TopArtistsList from "@/components/TopArtistsList";
import { StyleSheet, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSpotify } from "@/contexts/SpotifyContext";

export default function ArtistsScreen() {
  const { topArtists, loading, timeRange, setTimeRange } = useSpotify();
  const [viewLayout, setViewLayout] = useState<'list' | 'grid'>('list');

  return (
    <SafeAreaView style={styles.Container}>
      <View style={styles.headerContainer}>
        <Text style={styles.text}>Your Top Artists</Text>
      </View>

      <TimeLines 
        activeRange={timeRange} 
        onRangeChange={setTimeRange} 
        viewLayout={viewLayout}
        onLayoutChange={setViewLayout}
      />

      <View >
        <TopArtistsList
          artists={topArtists}
          horizontal={false}
          showGenre={true}
          showId={true}
          loading={loading}
          viewLayout={viewLayout}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#0d1117",
  },
  headerContainer: {
    marginTop: 16,
    marginBottom: 4,
  },
  text: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
});
