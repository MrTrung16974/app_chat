import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text, useTheme } from 'react-native-paper';

export const Loading = ({ label = 'Loading...' }: { label?: string }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <ActivityIndicator animating color={colors.primary} />
      <Text style={{ color: colors.outline, marginTop: 8 }}>{label}</Text>
    </View>
  );
};

export const SkeletonList = () => (
  <View style={styles.skeletonContainer}>
    {Array.from({ length: 6 }).map((_, index) => (
      <View key={index} style={styles.skeletonRow} />
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skeletonContainer: {
    paddingHorizontal: 16,
  },
  skeletonRow: {
    height: 64,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.08)',
    marginBottom: 12,
  },
});
