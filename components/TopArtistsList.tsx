import { View, Text, FlatList, StyleSheet, ActivityIndicator, Dimensions } from "react-native";
import { Image } from "expo-image";
import { type SpotifyArtist } from "@/hooks/use-Spotify-Data";

interface TopArtistsProps {
  artists?: SpotifyArtist[];
  horizontal?: boolean;
  showGenre?: boolean;
  showPlays?: boolean;
  showId?: boolean;
  loading?: boolean;
  viewLayout?: 'list' | 'grid';
}

const { width } = Dimensions.get("window");
const GRID_ITEM_SIZE = (width - 48) / 3;

export default function TopArtistsList({
  artists = [],
  horizontal = true,
  showGenre = false,
  showPlays = false,
  showId = false,
  loading = false,
  viewLayout = 'list',
}: TopArtistsProps) {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#8B5CF6" />
      </View>
    );
  }

  if (artists.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.emptyText}>No top artists available yet.</Text>
      </View>
    );
  }

  const isGrid = viewLayout === 'grid';

  return (
    <FlatList
      key={viewLayout} // Force rebuild when switching list/grid
      data={artists}
      horizontal={!isGrid && horizontal}
      numColumns={isGrid ? 3 : 1}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      style={[
        styles.listContainer, 
        (!horizontal || isGrid) && styles.columnContainer
      ]}
      contentContainerStyle={
        isGrid 
          ? styles.gridContainer 
          : (!horizontal ? styles.listScrollContainer : undefined)
      }
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => {
        const rank = String(index + 1).padStart(2, '0');
        const imageUrl = item.images?.[1]?.url ?? item.images?.[0]?.url;
        const genre = item.genres?.[0] ?? 'Music';

        if (isGrid) {
          return (
            <View style={styles.gridItem}>
              <View style={styles.gridImageWrapper}>
                {imageUrl ? (
                  <Image
                    source={{ uri: imageUrl }}
                    style={styles.gridImage}
                    contentFit="cover"
                  />
                ) : (
                  <View style={styles.gridImagePlaceholder}>
                    <Text style={{ fontSize: 24 }}>🎤</Text>
                  </View>
                )}
                {showId && (
                  <View style={styles.gridRankBadge}>
                    <Text style={styles.gridRankText}>{rank}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.gridArtistName} numberOfLines={1}>
                {item.name}
              </Text>
            </View>
          );
        }

        return (
          <View style={[styles.mainContainer, !horizontal && styles.columnItem]}>
            {showId && <Text style={styles.idText}>{rank}</Text>}
            {imageUrl ? (
              <Image
                source={{ uri: imageUrl }}
                style={[styles.imageContainer, !horizontal && { marginRight: 16 }]}
                contentFit="cover"
              />
            ) : (
              <View style={[styles.imageContainer, !horizontal && { marginRight: 16 }]} />
            )}
            <View style={!horizontal ? styles.textContainer : { alignItems: "center" }}>
              <Text style={[styles.artistText, horizontal && { textAlign: "center" }]} numberOfLines={1}>{item.name}</Text>
              {showGenre && (
                <Text style={styles.genreText} numberOfLines={1}>
                  {genre.charAt(0).toUpperCase() + genre.slice(1)}
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
    marginTop: 0,
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
    paddingHorizontal: 0,
    borderBottomColor: "#1e2533",
    borderBottomWidth: 0.5,
    backgroundColor: "transparent",
    paddingVertical: 12,
  },
  imageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#444",
    overflow: "hidden",
  },
  artistText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
    flex: 1,
  },
  genreText: {
    color: "#9ca3af",
    fontSize: 11,
    marginTop: 2,
  },
  idText: {
    color: "#8B5CF6",
    fontSize: 13,
    fontWeight: "700",
    width: 22,
    marginRight: 12,
  },
  
  // Grid View Styles
  gridContainer: {
    paddingHorizontal: 8,
    paddingBottom: 50,
  },
  listScrollContainer: {
    paddingBottom: 50,
  },
  gridItem: {
    width: GRID_ITEM_SIZE,
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 6,
  },
  gridImageWrapper: {
    position: "relative",
    width: GRID_ITEM_SIZE - 20,
    height: GRID_ITEM_SIZE - 20,
    borderRadius: (GRID_ITEM_SIZE - 20) / 2,
    backgroundColor: "#1a2030",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 8,
  },
  gridImage: {
    width: "100%",
    height: "100%",
    borderRadius: (GRID_ITEM_SIZE - 20) / 2,
  },
  gridImagePlaceholder: {
    width: "100%",
    height: "100%",
    borderRadius: (GRID_ITEM_SIZE - 20) / 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a2030",
  },
  gridRankBadge: {
    position: "absolute",
    top: -2,
    left: -2,
    backgroundColor: "#8B5CF6",
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#0d1117",
  },
  gridRankText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  gridArtistName: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
    width: "100%",
  },
});
