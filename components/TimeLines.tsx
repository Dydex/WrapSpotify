import { View, Text, StyleSheet, Animated, TouchableOpacity } from "react-native"
import { useState, useRef } from "react";

export default function TimeLines() {
    const [activeTab, setActiveTab] = useState(0);
    const tabIndicator = useRef(new Animated.Value(0)).current;

    const TABS = [
        '4 Weeks',
        '6 Months',
        'All Time'
    ];

     const handleTabPress = (i: number) => {
        setActiveTab(i);
        Animated.spring(tabIndicator, {
          toValue: i,
          useNativeDriver: true,
          tension: 80,
          friction: 10,
        }).start();
      };

      const TAB_WIDTH = 80;

    return (
        <View style={styles.tabContainer}>
                  <View style={styles.tabRow}>
                    {TABS.map((tab, i) => (
                      <TouchableOpacity
                        key={i}
                        onPress={() => handleTabPress(i)}
                        activeOpacity={0.7}
                        style={styles.tabBtn}
                      >
                        <Text style={[styles.tabText, activeTab === i && styles.tabTextActive]}>
                          {tab}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <Animated.View
                    style={[
                      styles.tabIndicator,
                      {
                        transform: [
                          {
                            translateX: tabIndicator.interpolate({
                              inputRange: [0, 1, 2],
                              outputRange: [0, TAB_WIDTH, TAB_WIDTH * 2],
                            }),
                          },
                        ],
                      },
                    ]}
                  />
                </View>
    )
}

const GREEN = '#22c55e';
const MUTED = '#6b7280';

const styles = StyleSheet.create({
    tabContainer: {
    marginBottom: 20,
    marginTop: 12
  },
  tabRow: {
    flexDirection: 'row',
    gap: 0,
  },
  tabBtn: {
    width: 80,
    paddingBottom: 8,
    alignItems: 'flex-start',
  },
  tabText: {
    color: MUTED,
    fontSize: 13,
    fontWeight: '500',
  },
  tabTextActive: {
    color: GREEN,
    fontWeight: '600',
  },
  tabIndicator: {
    height: 2,
    width: 48,
    backgroundColor: GREEN,
    borderRadius: 1,
    marginTop: -2,
  },
    
})