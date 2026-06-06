import { View, Text, StyleSheet, Animated, TouchableOpacity } from "react-native"
import { useState, useRef } from "react";
import type { TimeRange } from "@/hooks/use-Spotify-Data";

interface TimeLinesProps {
  activeRange?: TimeRange;
  onRangeChange?: (range: TimeRange) => void;
}

const TABS: { label: string; value: TimeRange }[] = [
  { label: '4 Weeks', value: 'short_term' },
  { label: '6 Months', value: 'medium_term' },
  { label: 'All Time', value: 'long_term' },
];

export default function TimeLines({ activeRange = 'short_term', onRangeChange }: TimeLinesProps) {
    const activeIndex = TABS.findIndex((t) => t.value === activeRange);
    const tabIndicator = useRef(new Animated.Value(activeIndex >= 0 ? activeIndex : 0)).current;

     const handleTabPress = (i: number) => {
        Animated.spring(tabIndicator, {
          toValue: i,
          useNativeDriver: true,
          tension: 80,
          friction: 10,
        }).start();
        onRangeChange?.(TABS[i].value);
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
                        <Text style={[styles.tabText, tab.value === activeRange && styles.tabTextActive]}>
                          {tab.label}
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