import { DefaultTheme, Theme as NavigationTheme } from '@react-navigation/native';

const customColors = {
  primary: '#6366f1',
  background: '#ffffff',
  card: '#f3f4f6',
  text: '#1f2937',
  border: '#e5e7eb',
  notification: '#ef4444'
};

export const theme: NavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    ...customColors
  }
}; 