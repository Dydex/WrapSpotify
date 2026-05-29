import { FlatList, Text, View, StyleSheet, Animated } from "react-native";
import { useEffect, useRef } from "react";
import {tracks} from "@/constants/tracks";


interface TopTracksProps {
  showPlays?: boolean;
}

const TrackRow = ({
  item,
  index,
  showPlays,
}: {
  item: (typeof tracks)[0];
  index: number;
  showPlays?: boolean;
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.trackRow,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <View>
        <Text style={styles.trackRank}>{item.rank}</Text>
      </View>

      <View style={styles.trackIcon}>
        <Text style={{ fontSize: 18 }}>{item.emoji}</Text>
      </View>
      <View style={styles.trackInfo}>
        <Text style={styles.trackName} numberOfLines={1}>
          {item.track}
        </Text>
        <Text style={styles.trackArtist}>
          {item.artist} · {item.duration}
        </Text>
      </View>
      {showPlays && (
        <View style={styles.playsBadge}>
          <Text style={styles.playsText}>{item.plays} plays</Text>
        </View>
      )}
    </Animated.View>
  );
};
export default function TopTracksList({
  showPlays,
}: TopTracksProps) {
  return (
    <FlatList
      data={tracks}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingHorizontal: 20, paddingBottom: 50}}
      renderItem={({ item, index }) => (
        <TrackRow
          item={item}
          index={index}
          showPlays={showPlays}
        />
      )}
    />
  );
}

const GREEN = "#22c55e";
const MUTED = "#6b7280";

const styles = StyleSheet.create({
  listContainer: {
    marginTop: 16,
    marginBottom: 46,
  },
  mainContainer: {
    gap: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  imageContainer: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#444",
    marginBottom: 12,
  },
  trackText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  artistText: {
    color: "white",
    fontSize: 14,
  },
  artistTextId: {
    color: "#1DB954",
    fontSize: 16,
    fontWeight: "bold",
  },
  textContainer: {
    flexDirection: "column",
  },
  trackIcon: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#1a2030",
    alignItems: "center",
    justifyContent: "center",
  },
  trackRank: {
    color: GREEN,
    fontSize: 13,
    fontWeight: "700",
    width: 22,
  },
  playsBadge: {
    backgroundColor: "#1a2a1a",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  playsText: {
    color: GREEN,
    fontSize: 10,
    fontWeight: "700",
  },
  trackInfo: {
    flex: 1,
    minWidth: 0,
  },
  trackName: {
    color: "#e5e7eb",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 2,
  },
  trackArtist: {
    color: MUTED,
    fontSize: 11,
  },
  trackRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 11,
    borderBottomWidth: 0.5,
    borderBottomColor: "#1e2533",
  },
  
});
