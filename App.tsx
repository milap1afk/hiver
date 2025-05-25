import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';
import { theme } from './src/theme';

import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import RoommateScreen from './src/screens/RoommateScreen';
import ShoppingScreen from './src/screens/ShoppingScreen';
import RentingScreen from './src/screens/RentingScreen';
import RideShareScreen from './src/screens/RideShareScreen';
import GamePartnerScreen from './src/screens/GamePartnerScreen';

export type RootStackParamList = {
  MainTabs: undefined;
  Profile: undefined;
  Roommate: undefined;
  Shopping: undefined;
  Renting: undefined;
  RideShare: undefined;
  Gaming: undefined;
};

export type TabParamList = {
  Home: undefined;
  Roommate: undefined;
  Shopping: undefined;
  Renting: undefined;
  RideShare: undefined;
  Gaming: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;
          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Roommate':
              iconName = focused ? 'people' : 'people-outline';
              break;
            case 'Shopping':
              iconName = focused ? 'cart' : 'cart-outline';
              break;
            case 'Renting':
              iconName = focused ? 'cube' : 'cube-outline';
              break;
            case 'RideShare':
              iconName = focused ? 'car' : 'car-outline';
              break;
            case 'Gaming':
              iconName = focused ? 'game-controller' : 'game-controller-outline';
              break;
            default:
              iconName = 'home-outline';
          }
          return (
            <View style={styles.tabIconContainer}>
              <Ionicons name={iconName} size={size} color={color} />
              {focused && <View style={[styles.tabIndicator, { backgroundColor: color }]} />}
            </View>
          );
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: theme.colors.card,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 3,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          title: 'Hive',
          headerRight: () => (
            <Ionicons 
              name="notifications-outline" 
              size={24} 
              color={theme.colors.text}
              style={{ marginRight: 16 }}
            />
          ),
        }}
      />
      <Tab.Screen 
        name="Roommate" 
        component={RoommateScreen}
        options={{ title: 'Roommates' }}
      />
      <Tab.Screen 
        name="Shopping" 
        component={ShoppingScreen}
        options={{ title: 'Shopping' }}
      />
      <Tab.Screen 
        name="Renting" 
        component={RentingScreen}
        options={{ title: 'Rent Items' }}
      />
      <Tab.Screen 
        name="RideShare" 
        component={RideShareScreen}
        options={{ title: 'Rides' }}
      />
      <Tab.Screen 
        name="Gaming" 
        component={GamePartnerScreen}
        options={{ title: 'Gaming' }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer theme={theme}>
      <StatusBar style="dark" />
      <Stack.Navigator>
        <Stack.Screen 
          name="MainTabs" 
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen}
          options={{
            headerStyle: {
              backgroundColor: theme.colors.card,
            },
            headerTintColor: theme.colors.text,
            headerShadowVisible: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIndicator: {
    height: 4,
    width: 4,
    borderRadius: 2,
    marginTop: 4,
  }
}); 