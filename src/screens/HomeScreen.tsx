import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, RefreshControl } from 'react-native';
import { CompositeNavigationProp, useTheme } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootStackParamList, TabParamList } from '../../App';
import { Ionicons } from '@expo/vector-icons';

type HomeScreenProps = {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<TabParamList, 'Home'>,
    NativeStackNavigationProp<RootStackParamList>
  >;
};

type FeatureCardProps = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
};

const FeatureCard = ({ title, icon, color, onPress }: FeatureCardProps) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity style={[styles.featureCard, { backgroundColor: color }]} onPress={onPress}>
      <Ionicons name={icon} size={24} color={colors.primary} />
      <Text style={[styles.featureTitle, { color: colors.text }]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const features = [
    { title: 'Find Roommates', icon: 'people', color: '#fef3c7', route: 'Roommate' },
    { title: 'Shopping List', icon: 'cart', color: '#dcfce7', route: 'Shopping' },
    { title: 'Rent Items', icon: 'cube', color: '#dbeafe', route: 'Renting' },
    { title: 'Share Rides', icon: 'car', color: '#fae8ff', route: 'RideShare' },
    { title: 'Find Players', icon: 'game-controller', color: '#fee2e2', route: 'Gaming' },
  ] as const;

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Welcome Section */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.welcomeText, { color: '#6b7280' }]}>Welcome to</Text>
          <Text style={[styles.titleText, { color: colors.text }]}>Hive Community</Text>
        </View>
        <TouchableOpacity 
          style={[styles.profileButton, { backgroundColor: colors.card }]}
          onPress={() => navigation.navigate('Profile')}
        >
          <Image 
            source={{ uri: 'https://picsum.photos/200' }} 
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
        <View style={styles.featureGrid}>
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              icon={feature.icon as keyof typeof Ionicons.glyphMap}
              color={feature.color}
              onPress={() => navigation.navigate(feature.route)}
            />
          ))}
        </View>
      </View>

      {/* Recent Activities */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activities</Text>
        {[
          { title: 'New roommate request', desc: 'Sarah is looking for a roommate', icon: 'people' },
          { title: 'Shopping list updated', desc: 'Mike added 3 items to the list', icon: 'cart' },
          { title: 'Item available', desc: 'Mountain bike for rent', icon: 'cube' },
        ].map((activity, index) => (
          <TouchableOpacity key={index} style={[styles.activityCard, { backgroundColor: colors.card }]}>
            <View style={[styles.activityIcon, { backgroundColor: features[index].color }]}>
              <Ionicons name={activity.icon as keyof typeof Ionicons.glyphMap} size={24} color={colors.primary} />
            </View>
            <View style={styles.activityContent}>
              <Text style={[styles.activityTitle, { color: colors.text }]}>{activity.title}</Text>
              <Text style={styles.activityDesc}>{activity.desc}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  welcomeText: {
    fontSize: 16,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  quickActions: {
    padding: 20,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  featureCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  activityDesc: {
    fontSize: 14,
    color: '#6b7280',
  },
}); 