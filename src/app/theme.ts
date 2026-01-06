import { MD3DarkTheme, MD3LightTheme, type MD3Theme } from 'react-native-paper';

const baseSpacing = 8;

export const spacing = {
  xs: baseSpacing * 0.5,
  sm: baseSpacing,
  md: baseSpacing * 2,
  lg: baseSpacing * 3,
  xl: baseSpacing * 4,
};

export const typography = {
  title: { fontSize: 22, fontWeight: '700' },
  subtitle: { fontSize: 16, fontWeight: '600' },
  body: { fontSize: 14, fontWeight: '400' },
  caption: { fontSize: 12, fontWeight: '400' },
};

export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#4B7BE5',
    secondary: '#7C4DFF',
    background: '#F6F7FB',
    surface: '#FFFFFF',
    onSurface: '#1C1E21',
    outline: '#E5E7EF',
  },
};

export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#8FB4FF',
    secondary: '#BFA3FF',
    background: '#0E1014',
    surface: '#151922',
    onSurface: '#E3E6ED',
    outline: '#2A2F3A',
  },
};

export const getTheme = (mode: 'light' | 'dark') =>
  mode === 'dark' ? darkTheme : lightTheme;
