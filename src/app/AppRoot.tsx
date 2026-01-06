import React, { useEffect, useMemo } from 'react';
import { StatusBar } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './navigation';
import { getTheme } from './theme';
import { mockSocket } from '@/services/realtime/mockSocket';
import { useAuthStore } from '@/store/authStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

export const AppRoot = () => {
  const restoreSession = useAuthStore((state) => state.restoreSession);
  const themeMode = useAuthStore((state) => state.themeMode);
  const theme = useMemo(() => getTheme(themeMode), [themeMode]);

  useEffect(() => {
    restoreSession();
    mockSocket.connect();
    return () => mockSocket.disconnect();
  }, [restoreSession]);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <PaperProvider theme={theme}>
          <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />
          <AppNavigator />
        </PaperProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};
