import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Button, List, Switch, Text, useTheme } from 'react-native-paper';
import { useAuthStore } from '@/store/authStore';

export const SettingsScreen = () => {
  const { colors } = useTheme();
  const user = useAuthStore((state) => state.user);
  const themeMode = useAuthStore((state) => state.themeMode);
  const setThemeMode = useAuthStore((state) => state.setThemeMode);
  const logout = useAuthStore((state) => state.logout);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.profileCard, { backgroundColor: colors.surface }]}
      >
        <Avatar.Image size={64} source={{ uri: user?.avatar }} />
        <View style={styles.profileInfo}>
          <Text variant="titleMedium">{user?.name}</Text>
          <Text style={{ color: colors.outline }}>{user?.email}</Text>
        </View>
        <View style={[styles.statusDot, { backgroundColor: '#3DDC84' }]} />
      </View>
      <List.Section>
        <List.Item
          title="Dark mode"
          right={() => (
            <Switch
              value={themeMode === 'dark'}
              onValueChange={(value) => setThemeMode(value ? 'dark' : 'light')}
            />
          )}
        />
      </List.Section>
      <Button mode="contained" onPress={() => logout()} style={styles.logout}>
        Logout
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    gap: 12,
  },
  profileInfo: {
    flex: 1,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  logout: {
    marginTop: 'auto',
  },
});
