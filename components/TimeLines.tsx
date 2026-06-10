import { View, Text, StyleSheet, Animated, TouchableOpacity } from "react-native"
import { useState, useRef, useEffect } from "react";
import type { TimeRange } from "@/hooks/use-Spotify-Data";
import { Ionicons } from "@expo/vector-icons";

interface TimeLinesProps {
  activeRange?: TimeRange;
  onRangeChange?: (range: TimeRange) => void;
  viewLayout?: 'list' | 'grid';
  onLayoutChange?: (layout: 'list' | 'grid') => void;
}

const TABS: { label: string; value: TimeRange }[] = [
  { label: '4 Weeks', value: 'short_term' },
  { label: '6 Months', value: 'medium_term' },
  { label: 'All Time', value: 'long_term' },
];

export default function TimeLines({
  activeRange = 'short_term',
  onRangeChange,
  viewLayout = 'list',
  onLayoutChange,
}: TimeLinesProps) {
  const activeIndex = TABS.findIndex((t) => t.value === activeRange);
  const tabIndicator = useRef(new Animated.Value(activeIndex >= 0 ? activeIndex : 0)).current;

  useEffect(() => {
    Animated.spring(tabIndicator, {
      toValue: activeIndex >= 0 ? activeIndex : 0,
      useNativeDriver: true,
      tension: 80,
      friction: 10,
    }).start();
  }, [activeIndex]);

  const handleTabPress = (i: number) => {
    onRangeChange?.(TABS[i].value);
  };

  const TAB_WIDTH = 80;

  return (
    <View style={styles.headerRow}>
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

      {onLayoutChange && (
        <View style={styles.toggleRow}>
          <TouchableOpacity
            onPress={() => onLayoutChange('list')}
            activeOpacity={0.75}
            style={[styles.toggleBtn, viewLayout === 'list' && styles.toggleBtnActive]}
          >
            <Ionicons
              name="list"
              size={16}
              color={viewLayout === 'list' ? 'white' : '#6b7280'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onLayoutChange('grid')}
            activeOpacity={0.75}
            style={[styles.toggleBtn, viewLayout === 'grid' && styles.toggleBtnActive]}
          >
            <Ionicons
              name="grid"
              size={16}
              color={viewLayout === 'grid' ? 'white' : '#6b7280'}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const GREEN = '#8B5CF6';
const MUTED = '#6b7280';

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  tabContainer: {
    marginTop: 12,
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
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  toggleBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#161b22',
    borderWidth: 1,
    borderColor: '#21262d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleBtnActive: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
});