import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Snackbar, Text, TextInput, useTheme } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';

type FormData = {
  email: string;
  password: string;
};

export const LoginScreen = () => {
  const { colors } = useTheme();
  const { loginMutation } = useAuth();
  const [error, setError] = useState('');
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: { email: 'you@example.com', password: 'password' },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await loginMutation.mutateAsync(values);
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <Text variant="headlineSmall">Welcome back</Text>
        <Text style={{ color: colors.outline, marginTop: 4 }}>Sign in to continue</Text>
        <Controller
          control={control}
          name="email"
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <TextInput
              label="Email"
              value={value}
              onChangeText={onChange}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <TextInput
              label="Password"
              value={value}
              onChangeText={onChange}
              secureTextEntry
              style={styles.input}
            />
          )}
        />
        <Button
          mode="contained"
          onPress={onSubmit}
          loading={loginMutation.isPending}
          style={styles.button}
        >
          Sign In
        </Button>
      </View>
      <Snackbar visible={Boolean(error)} onDismiss={() => setError('')} duration={2000}>
        {error}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    padding: 24,
    borderRadius: 20,
    backgroundColor: '#fff',
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  input: {
    marginTop: 8,
  },
  button: {
    marginTop: 8,
  },
});
