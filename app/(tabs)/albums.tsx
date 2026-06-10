import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, Text } from "react-native";
import TimeLines from "@/components/TimeLines";
import TopAlbumsList from "@/components/TopAlbumsList";
import { useSpotify } from "@/contexts/SpotifyContext";

export default function AlbumsScreen() {
  const { topAlbums, loading, timeRange, setTimeRange } = useSpotify();
  const [viewLayout, setViewLayout] = useState<'list' | 'grid'>('list');

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Your Top Albums</Text>
      </View>

      {/* Tabs with layout toggle */}
      <TimeLines 
        activeRange={timeRange} 
        onRangeChange={setTimeRange} 
        viewLayout={viewLayout}
        onLayoutChange={setViewLayout}
      />

      {/* Album list wrapper */}
      <View>
        <TopAlbumsList 
          albums={topAlbums} 
          loading={loading} 
          viewLayout={viewLayout}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#0d1117",
  },
  headerContainer: {
    marginTop: 16,
    marginBottom: 4,
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
});
