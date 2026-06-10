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

  const radius = 65;
  const strokeWidth = 13;
  const circumference = 2 * Math.PI * radius;
  let runningPercent = 0;

  const topGenre = genres[0];

  return (
    <View style={styles.container}>
      {/* Donut Chart Card (Stacked layout with grid legend) */}
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
            <Ionicons name="musical-note" size={20} color="#6b7280" style={styles.innerIcon} />
            <Text style={styles.innerTextTitle} numberOfLines={1}>
              {topGenre?.name ?? "N/A"}
            </Text>
          </View>
        </View>

        {/* Legend List (Grid Wrap layout below chart) */}
        <View style={styles.legendContainer}>
          {genres.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: item.color }]} />
              <View style={styles.legendTextWrapper}>
                <Text style={styles.legendLabel} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.legendPercentage}>{item.percentage}%</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 16,
  },
  chartCard: {
    backgroundColor: "#161b22",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#21262d",
  },
  chartWrapper: {
    position: "relative",
    width: 160,
    height: 160,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  svg: {
    position: "absolute",
  },
  innerLabelContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    justifyContent: "center",
    alignItems: "center",
  },
  innerIcon: {
    marginBottom: 2,
  },
  innerTextTitle: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
    width: 90,
  },
  legendContainer: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
    columnGap: 8,
    borderTopWidth: 1,
    borderTopColor: "#21262d",
    paddingTop: 16,
  },
  legendItem: {
    width: (width - 72) / 2, // 2 equal columns with padding accounted for
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendTextWrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  legendLabel: {
    color: "#e5e7eb",
    fontSize: 12,
    fontWeight: "500",
    flex: 1,
    marginRight: 4,
  },
  legendPercentage: {
    color: "#6b7280",
    fontSize: 11,
    fontWeight: "600",
  },
});
