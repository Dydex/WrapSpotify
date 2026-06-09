import { useRef } from "react";
import { View, FlatList, StyleSheet, Animated, Text, ActivityIndicator } from "react-native";
import { useEffect } from "react";
import { Image } from "expo-image";
import { type SpotifyDerivedAlbum } from "@/hooks/use-Spotify-Data";

interface TopAlbumsProps {
  albums?: SpotifyDerivedAlbum[];
  loading?: boolean;
}

const AlbumRow = ({
  item,
  index,
}: {
  item: SpotifyDerivedAlbum;
  index: number;
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

  const album = item.album;
  const rank = String(index + 1).padStart(2, '0');
  const artistNames = album.artists.map((a) => a.name).join(', ');
  const year = album.release_date?.substring(0, 4) ?? '';
  const albumArt = album.images?.[2]?.url ?? album.images?.[1]?.url ?? album.images?.[0]?.url;

  return (
    <Animated.View
      style={[
        styles.albumRow,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <Text style={styles.albumRank}>{rank}</Text>

      <View style={styles.albumIconWrap}>
        {albumArt ? (
          <Image
            source={{ uri: albumArt }}
            style={styles.albumImage}
            contentFit="cover"
          />
        ) : (
          <Text style={{ fontSize: 20 }}>🎵</Text>
        )}
      </View>

      <View style={styles.albumInfo}>
        <Text style={styles.albumTitle} numberOfLines={1}>
          {album.name}
        </Text>
        <Text style={styles.albumArtist}>{artistNames}</Text>
        <Text style={styles.albumYear}>{year}</Text>
      </View>
    </Animated.View>
  );
};

export default function TopAlbumsList({ albums = [], loading = false }: TopAlbumsProps) {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#22c55e" />
      </View>
    );
  }

  if (albums.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.emptyText}>No top albums available yet.</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.albumList}
      data={albums}
      renderItem={({ item, index }) => <AlbumRow item={item} index={index} />}
      keyExtractor={(item) => item.album.id}
    />
  );
}

const GREEN = "#8B5CF6";
const MUTED = "#6b7280";

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: MUTED,
    fontSize: 13,
    textAlign: "center",
    paddingHorizontal: 20,
  },
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
    overflow: "hidden",
  },
  albumImage: {
    width: 44,
    height: 44,
    borderRadius: 10,
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
  },
  albumTracks: {
    color: GREEN,
    fontSize: 11,
    fontWeight: "700",
    minWidth: 50,
    textAlign: "right",
  },
});