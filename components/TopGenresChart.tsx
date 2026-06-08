import React from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export interface GenreItem {
  name: string;
  count: number;
  percentage: number;
  topArtist: string;
  color: string;
  emoji: string;
}

interface TopGenresChartProps {
  genres: GenreItem[];
}

export default function TopGenresChart({ genres = [] }: TopGenresChartProps) {
  if (genres.length === 0) return null;

  const radius = 60;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  let runningPercent = 0;

  const topGenre = genres[0];

  return (
    <View style={styles.container}>
      {/* Donut Chart Card */}
      <View style={styles.chartCard}>
        <View style={styles.chartWrapper}>
          <Svg width={160} height={160} style={styles.svg}>
            <G rotation={-90} origin="80, 80">
              {/* Background track circle */}
              <Circle
                cx="80"
                cy="80"
                r={radius}
                stroke="#222"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              {/* Render slices */}
              {genres.map((item, index) => {
                const strokeDashoffset = circumference - (circumference * item.percentage) / 100;
                const rotationAngle = (runningPercent / 100) * 360;
                runningPercent += item.percentage;

                return (
                  <Circle
                    key={index}
                    cx="80"
                    cy="80"
                    r={radius}
                    stroke={item.color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    fill="transparent"
                    transform={`rotate(${rotationAngle} 80 80)`}
                    strokeLinecap="round"
                  />
                );
              })}
            </G>
          </Svg>
          
          {/* Donut Inner Text */}
          <View style={styles.innerLabelContainer}>
            <Ionicons name="musical-note" size={24} color="#6b7280" style={styles.innerIcon} />
            <Text style={styles.innerTextTitle} numberOfLines={1}>
              {topGenre?.name ?? "N/A"}
            </Text>
            <Text style={styles.innerTextSubtitle}>Your #1 genre</Text>
          </View>
        </View>

        {/* Legend List */}
        <View style={styles.legendContainer}>
          {genres.map((item, index) => (
            <View key={index} style={styles.legendRow}>
              <View style={styles.legendLeft}>
                <View style={[styles.dot, { backgroundColor: item.color }]} />
                <Text style={styles.legendLabel}>{item.name}</Text>
              </View>
              <Text style={styles.legendPercentage}>{item.percentage}%</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Grid Cards */}
      <View style={styles.gridContainer}>
        {genres.slice(0, 4).map((item, index) => (
          <View key={index} style={[styles.gridCard, { backgroundColor: item.color }]}>
            {/* Subtle Top-Right Emoji */}
            <Text style={styles.gridEmoji}>{item.emoji}</Text>
            
            <View style={styles.gridCardContent}>
              <Text style={styles.gridName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.gridPercent}>
                {item.percentage}%
              </Text>
              <Text style={styles.gridArtist} numberOfLines={1}>
                Top artist: {item.topArtist}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  chartCard: {
    backgroundColor: "#161b22",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#21262d",
    marginBottom: 24,
  },
  chartWrapper: {
    position: "relative",
    width: 160,
    height: 160,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  svg: {
    position: "absolute",
  },
  innerLabelContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  innerIcon: {
    marginBottom: 2,
  },
  innerTextTitle: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    width: 90,
  },
  innerTextSubtitle: {
    color: "#6b7280",
    fontSize: 10,
    marginTop: 2,
  },
  legendContainer: {
    width: "100%",
    gap: 12,
  },
  legendRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  legendLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    color: "#e5e7eb",
    fontSize: 13,
    fontWeight: "500",
  },
  legendPercentage: {
    color: "#e5e7eb",
    fontSize: 13,
    fontWeight: "600",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  gridCard: {
    width: (width - 52) / 2,
    borderRadius: 20,
    padding: 16,
    height: 125,
    position: "relative",
    overflow: "hidden",
  },
  gridEmoji: {
    position: "absolute",
    right: 12,
    top: 12,
    fontSize: 24,
    opacity: 0.25,
  },
  gridCardContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  gridName: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
    opacity: 0.9,
    width: "80%",
  },
  gridPercent: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "700",
    marginVertical: 4,
  },
  gridArtist: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "500",
    opacity: 0.8,
  },
});
