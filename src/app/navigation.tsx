import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'react-native-paper';
import { LoginScreen } from '@/screens/LoginScreen';
import { ChatsScreen } from '@/screens/ChatsScreen';
import { ChatDetailScreen } from '@/screens/ChatDetailScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { useAuthStore } from '@/store/authStore';
import type { AuthStackParamList, MainTabParamList, RootStackParamList } from '@/types/navigation';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tabs = createBottomTabNavigator<MainTabParamList>();

const AuthNavigator = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
  </AuthStack.Navigator>
);

const MainTabs = () => (
  <Tabs.Navigator screenOptions={{ headerShown: false }}>
    <Tabs.Screen name="Chats" component={ChatsScreen} />
    <Tabs.Screen name="Settings" component={SettingsScreen} />
  </Tabs.Navigator>
);

export const AppNavigator = () => {
  const { colors, dark } = useTheme();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <NavigationContainer
      theme={dark ? DarkTheme : { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: colors.background } }}
    >
      <RootStack.Navigator>
        {!isAuthenticated ? (
          <RootStack.Screen name="Auth" component={AuthNavigator} options={{ headerShown: false }} />
        ) : (
          <>
            <RootStack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
            <RootStack.Screen
              name="ChatDetail"
              component={ChatDetailScreen}
              options={({ route }) => ({ title: route.params.title })}
            />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
