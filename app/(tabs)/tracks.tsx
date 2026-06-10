import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, Text } from "react-native";
import TimeLines from "@/components/TimeLines";
import TopTracksList from "@/components/TopTracksList";
import { useSpotify } from "@/contexts/SpotifyContext";

export default function TracksScreen() {
  const { topTracks, loading, timeRange, setTimeRange } = useSpotify();
  const [viewLayout, setViewLayout] = useState<'list' | 'grid'>('list');

  return (
    <SafeAreaView style={styles.Container}>
      <View style={styles.headerContainer}>
        <Text style={styles.text}>Your Top Tracks</Text>
      </View>

      <TimeLines 
        activeRange={timeRange} 
        onRangeChange={setTimeRange} 
        viewLayout={viewLayout}
        onLayoutChange={setViewLayout}
      />

      <View>
        <TopTracksList
          tracks={topTracks}
          showPlays={true}
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
