import TimeLines from "@/components/TimeLines";
import TopArtistsCard from "@/components/TopArtistCard";
import TopArtistsList from "@/components/TopArtistsList";
import { Image } from "expo-image";
import { StyleSheet, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ArtistsScreen() {
  return (
    <SafeAreaView style={styles.Container}>
      <View>
        <Text style={styles.text}>Your Top Artists</Text>
      </View>

      <TimeLines />

      <TopArtistsCard />

      <View >
        <TopArtistsList horizontal={false} showGenre={true} showId={true} />
      </View>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    padding: 8,
  },
  listContainer: {
    marginTop: 0,
    marginBottom: 20

  },
  text: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  imageContainerOne: {
    width: 80,
    height: 80,
    borderRadius: 999,
    backgroundColor: "#444",
    marginBottom: 12,
  },
  imageContainerTwo: {
    width: 70,
    height: 70,
    borderRadius: 999,
    backgroundColor: "#444",
    marginBottom: 12,
  },
  imageContainerThree: {
    width: 70,
    height: 70,
    borderRadius: 999,
    backgroundColor: "#444",
    marginBottom: 12,
  },
  circleImages: {
    flexDirection: "row",
    gap: 12,
  },
  firstPositionImage: {
    width: 70,
  },
  secondPositionImage: {
    width: 70,
  },
  thirdPositionImage: {
    width: 70,
    height: 50,
    backgroundColor: "#444",
  },
});
