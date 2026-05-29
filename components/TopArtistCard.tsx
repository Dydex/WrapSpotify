import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { Ionicons } from '@expo/vector-icons';

export default function TopArtistsCard() {
  return (
    <View style={styles.container}>
      {/* Artist #2 - Wizkid */}
      <View style={styles.artistWrapper}>
        <View style={styles.smallCircleWrapper}>
          <View style={styles.smallCircleGray}>
            <Ionicons
              name="musical-notes"
              size={26}
              color="#999"
            />
          </View>
        </View>

        <View style={styles.rankBoxGray}>
          <Text style={styles.rankText}>2</Text>
        </View>

        <Text style={styles.artistName}>
          Wizkid
        </Text>

        <Text style={styles.genre}>
          Afrobeats
        </Text>
      </View>

      {/* Artist #1 - Burna Boy (Active) */}
      <View style={styles.artistWrapperActive}>
        <Text style={styles.crown}>👑</Text>

        <View style={styles.activeCircleOuter}>
          <LinearGradient
            colors={['#1DB954', '#4A90D9', '#8B5CF6']}
            style={styles.activeCircleGradient}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.activeCircleInner}>
              <Ionicons
                name="mic"
                size={32}
                color="#aaa"
              />
            </View>
          </LinearGradient>
        </View>

        <View style={styles.rankBoxGreen}>
          <Text style={styles.rankTextActive}>1</Text>
        </View>

        <Text style={styles.activeArtistName}>
          Burna Boy
        </Text>

        <Text style={styles.activeGenre}>
          Afrobeats
        </Text>
      </View>

      {/* Artist #3 - Tems */}
      <View style={styles.artistWrapper}>
        <View style={styles.smallCircleWrapper}>
          <View style={styles.smallCircleBrown}>
            <Ionicons
              name="headset"
              size={26}
              color="#8B6914"
            />
          </View>
        </View>

        <View style={styles.rankBoxBrown}>
          <Text style={styles.rankText}>3</Text>
        </View>

        <Text style={styles.artistName}>
          Tems
        </Text>

        <Text style={styles.genre}>
          R&B
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 20,
    paddingTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },

  /* ---- Side artist wrappers ---- */
  artistWrapper: {
    alignItems: 'center',
    flex: 1,
  },

  /* ---- Center (active) artist wrapper ---- */
  artistWrapperActive: {
    alignItems: 'center',
    flex: 1,
    marginTop: -10,
  },

  /* ---- Small circle ring wrappers ---- */
  smallCircleWrapper: {
    padding: 2,
    borderRadius: 999,
  },

  /* ---- #2 Gray ring circle ---- */
  smallCircleGray: {
    width: 68,
    height: 68,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#888',
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* ---- #3 Brown ring circle ---- */
  smallCircleBrown: {
    width: 68,
    height: 68,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#A0703C',
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* ---- #1 Active gradient circle ---- */
  activeCircleOuter: {
    borderRadius: 999,
    padding: 3,
  },

  activeCircleGradient: {
    width: 96,
    height: 96,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },

  activeCircleInner: {
    width: 82,
    height: 82,
    borderRadius: 999,
    backgroundColor: '#6B7AF0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* ---- Crown ---- */
  crown: {
    fontSize: 20,
    marginBottom: 4,
  },

  /* ---- Rank boxes ---- */
  rankBoxGray: {
    backgroundColor: '#3a3a3a',
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 10,
    marginTop: -8,
    minWidth: 40,
    alignItems: 'center',
  },

  rankBoxBrown: {
    backgroundColor: '#5C3D2E',
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 10,
    marginTop: -8,
    minWidth: 40,
    alignItems: 'center',
  },

  rankBoxGreen: {
    backgroundColor: '#1DB954',
    paddingHorizontal: 22,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: -8,
    minWidth: 48,
    alignItems: 'center',
  },

  /* ---- Rank text ---- */
  rankText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },

  rankTextActive: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

  /* ---- Artist names ---- */
  artistName: {
    color: '#ccc',
    fontWeight: '600',
    marginTop: 10,
    fontSize: 13,
  },

  activeArtistName: {
    color: 'white',
    fontWeight: 'bold',
    marginTop: 10,
    fontSize: 15,
  },

  /* ---- Genres ---- */
  genre: {
    color: '#777',
    fontSize: 11,
    marginTop: 3,
  },

  activeGenre: {
    color: '#1DB954',
    fontSize: 11,
    marginTop: 3,
  },
});