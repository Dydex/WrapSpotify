import { View, Text, FlatList, StyleSheet } from "react-native";

interface TopArtistsProps {
  horizontal?: boolean;
  showGenre?: boolean;
  showPlays?: boolean;
  showId?: boolean;
}

export default function TopArtistsList({
  horizontal = true,
  showGenre = false,
  showPlays = false,
  showId = false,
}: TopArtistsProps) {
  const artists = [
    { id: "01", name: "Drake", genre: "Hip-Hop", plays: 1200 },
    { id: "02", name: "Asake", genre: "Afrobeats", plays: 900 },
    { id: "03", name: "Rema", genre: "Afrobeats", plays: 800 },
    { id: "04", name: "Tems", genre: "Alternative R&B", plays: 700 },
    { id: "05", name: "Wizkid", genre: "Afrobeats", plays: 600 },
  ];

  return (
    <FlatList
      data={artists}
      horizontal={horizontal}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      style={[styles.listContainer, !horizontal && styles.columnContainer]}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={[styles.mainContainer, !horizontal && styles.columnItem]}>
          {showId && <Text style={styles.idText}>{item.id}</Text>}
          <View style={styles.imageContainer} />
          <View style={!horizontal && styles.textContainer}>
            <Text style={styles.artistText}>{item.name}</Text>
            {showGenre && <Text style={styles.genreText}>{item.genre}</Text>}
            {showPlays && (
              <Text style={styles.playsText}>{item.plays} plays</Text>
            )}
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
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
