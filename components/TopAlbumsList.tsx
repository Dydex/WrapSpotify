import { ALBUMS } from "@/constants/albums";
import { useRef } from "react";
import { View, FlatList, StyleSheet, Animated, Text } from "react-native";
import {useEffect} from "react";

const AlbumRow = ({
  item,
  index,
}: {
  item: (typeof ALBUMS)[0];
  index: number;
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const barWidth = useRef(new Animated.Value(0)).current;

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
      Animated.timing(barWidth, {
        toValue: item.plays,
        duration: 600,
        delay: index * 80 + 200,
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  const maxPlays = 18;

  return (
    <Animated.View
      style={[
        styles.albumRow,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <Text style={styles.albumRank}>{item.rank}</Text>

      <View style={styles.albumIconWrap}>
        <Text style={{ fontSize: 20 }}>🎵</Text>
      </View>

      <View style={styles.albumInfo}>
        <Text style={styles.albumTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.albumArtist}>{item.artist}</Text>
        <Text style={styles.albumYear}>{item.year}</Text>
        {/* Progress bar */}
        <View style={styles.barTrack}>
          <Animated.View
            style={[
              styles.barFill,
              {
                width: barWidth.interpolate({
                  inputRange: [0, maxPlays],
                  outputRange: ["0%", "100%"],
                }),
              },
            ]}
          />
        </View>
      </View>

      <Text style={styles.albumPlays}>{item.plays} plays</Text>
    </Animated.View>
  );
};

export default function TopAlbumsList() {
    return (
       
          <FlatList
                    style={styles.albumList}
                    data={ALBUMS}
                    renderItem={({ item, index }) => <AlbumRow item={item} index={index} />}
                    keyExtractor={(item) => item.id}
                  />  
    
    )
}

const GREEN = "#22c55e";
const MUTED = "#6b7280";

const styles = StyleSheet.create({
     albumList: {
    gap: 0,
  },
  albumRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#1e2533",
  },
  albumRank: {
    color: GREEN,
    fontSize: 13,
    fontWeight: "700",
    width: 22,
  },
  albumIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#1a2030",
    alignItems: "center",
    justifyContent: "center",
  },
  albumInfo: {
    flex: 1,
    minWidth: 0,
  },
  albumTitle: {
    color: "#e5e7eb",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 1,
  },
  albumArtist: {
    color: MUTED,
    fontSize: 11,
    marginBottom: 1,
  },
  albumYear: {
    color: "#374151",
    fontSize: 10,
    marginBottom: 5,
  },
  barTrack: {
    height: 3,
    backgroundColor: "#1e2533",
    borderRadius: 2,
    overflow: "hidden",
  },
  barFill: {
    height: 3,
    backgroundColor: GREEN,
    borderRadius: 2,
  },
  albumPlays: {
    color: GREEN,
    fontSize: 11,
    fontWeight: "700",
    minWidth: 50,
    textAlign: "right",
  },
})