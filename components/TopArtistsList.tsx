import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import { type SpotifyArtist } from "@/hooks/use-Spotify-Data";

interface TopArtistsProps {
  artists?: SpotifyArtist[];
  horizontal?: boolean;
  showGenre?: boolean;
  showPlays?: boolean;
  showId?: boolean;
  loading?: boolean;
}

export default function TopArtistsList({
  artists = [],
  horizontal = true,
  showGenre = false,
  showPlays = false,
  showId = false,
  loading = false,
}: TopArtistsProps) {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#1DB954" />
      </View>
    );
  }

  if (artists.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.emptyText}>No artists yet. Connect Spotify to see your top artists!</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={artists}
      horizontal={horizontal}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      style={[styles.listContainer, !horizontal && styles.columnContainer]}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => {
        const rank = String(index + 1).padStart(2, '0');
        const imageUrl = item.images?.[1]?.url ?? item.images?.[0]?.url;
        const genre = item.genres?.[0] ?? 'Music';

        return (
          <View style={[styles.mainContainer, !horizontal && styles.columnItem]}>
            {showId && <Text style={styles.idText}>{rank}</Text>}
            {imageUrl ? (
              <Image
                source={{ uri: imageUrl }}
                style={styles.imageContainer}
                contentFit="cover"
              />
            ) : (
              <View style={styles.imageContainer} />
            )}
            <View style={!horizontal && styles.textContainer}>
              <Text style={styles.artistText}>{item.name}</Text>
              {showGenre && (
                <Text style={styles.genreText}>
                  {genre.charAt(0).toUpperCase() + genre.slice(1)}
                </Text>
              )}
              {showPlays && (
                <Text style={styles.playsText}>
                  Popularity: {item.popularity}
                </Text>
              )}
            </View>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: "#6b7280",
    fontSize: 13,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  listContainer: {
    marginTop: 12,
  },
  columnContainer: {
    marginTop: 16,
    marginBottom: 300,
  },
  mainContainer: {
    backgroundColor: "#222",
    borderRadius: 20,
    padding: 16,
    marginRight: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  columnItem: {
    marginRight: 0,
    marginBottom: 1,
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    borderBottomColor: "#444",
    borderBottomWidth: 1,
    backgroundColor: "transparent",
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 999,
    backgroundColor: "#444",
    marginBottom: 12,
    marginRight: 16,
    overflow: "hidden",
  },
  artistText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
    flex: 1,
  },
  genreText: {
    color: "#999",
    fontSize: 12,
    marginTop: 4,
  },
  playsText: {
    color: "#1DB954",
    fontSize: 12,
    marginTop: 4,
  },
  idText: {
    color: "#1DB954",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 4,
    marginRight: 20,
  },
});
