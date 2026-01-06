import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';

export const EmptyState = ({
  title,
  subtitle,
  actionLabel,
  onAction,
}: {
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
}) => {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <Text variant="titleMedium">{title}</Text>
      <Text style={{ color: colors.outline, marginTop: 8, textAlign: 'center' }}>
        {subtitle}
      </Text>
      {actionLabel && onAction ? (
        <Button mode="contained" onPress={onAction} style={styles.button}>
          {actionLabel}
        </Button>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 32,
    alignItems: 'center',
  },
  button: {
    marginTop: 16,
  },
});
