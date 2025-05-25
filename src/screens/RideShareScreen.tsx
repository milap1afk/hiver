import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';

type RideShare = {
  id: string;
  driver: string;
  from: string;
  to: string;
  date: string;
  time: string;
  seats: number;
  vehicle: string;
  price: string;
  type: 'car' | 'bike';
};

export default function RideShareScreen() {
  const { colors } = useTheme();
  const [rides, setRides] = useState<RideShare[]>([
    {
      id: '1',
      driver: 'Sarah',
      from: 'Downtown',
      to: 'University',
      date: '2024-03-20',
      time: '09:00 AM',
      seats: 3,
      vehicle: 'Toyota Camry',
      price: '$5',
      type: 'car',
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    date: '',
    time: '',
    seats: '',
    vehicle: '',
    price: '',
    type: 'car' as 'car' | 'bike',
  });

  const handleAddRide = () => {
    if (!formData.from || !formData.to || !formData.date || !formData.time) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const newRide: RideShare = {
      id: Date.now().toString(),
      driver: 'You', // In a real app, this would come from user authentication
      ...formData,
      seats: parseInt(formData.seats) || 1,
    };

    setRides([newRide, ...rides]);
    setShowForm(false);
    setFormData({
      from: '',
      to: '',
      date: '',
      time: '',
      seats: '',
      vehicle: '',
      price: '',
      type: 'car',
    });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: colors.primary }]}
        onPress={() => setShowForm(!showForm)}
      >
        <Ionicons name={showForm ? 'close' : 'add'} size={24} color="white" />
        <Text style={styles.addButtonText}>
          {showForm ? 'Cancel' : 'Offer a Ride'}
        </Text>
      </TouchableOpacity>

      {showForm && (
        <View style={[styles.form, { backgroundColor: colors.card }]}>
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                { backgroundColor: colors.card },
                formData.type === 'car' && [styles.typeButtonActive, { backgroundColor: colors.primary }],
              ]}
              onPress={() => setFormData({ ...formData, type: 'car' })}
            >
              <Ionicons
                name="car"
                size={24}
                color={formData.type === 'car' ? 'white' : colors.primary}
              />
              <Text
                style={[
                  styles.typeButtonText,
                  { color: colors.text },
                  formData.type === 'car' && styles.typeButtonTextActive,
                ]}
              >
                Car
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                { backgroundColor: colors.card },
                formData.type === 'bike' && [styles.typeButtonActive, { backgroundColor: colors.primary }],
              ]}
              onPress={() => setFormData({ ...formData, type: 'bike' })}
            >
              <Ionicons
                name="bicycle"
                size={24}
                color={formData.type === 'bike' ? 'white' : colors.primary}
              />
              <Text
                style={[
                  styles.typeButtonText,
                  { color: colors.text },
                  formData.type === 'bike' && styles.typeButtonTextActive,
                ]}
              >
                Bike
              </Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            placeholder="From"
            placeholderTextColor="#6b7280"
            value={formData.from}
            onChangeText={(text) => setFormData({ ...formData, from: text })}
          />
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            placeholder="To"
            placeholderTextColor="#6b7280"
            value={formData.to}
            onChangeText={(text) => setFormData({ ...formData, to: text })}
          />
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            placeholder="Date"
            placeholderTextColor="#6b7280"
            value={formData.date}
            onChangeText={(text) => setFormData({ ...formData, date: text })}
          />
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            placeholder="Time"
            placeholderTextColor="#6b7280"
            value={formData.time}
            onChangeText={(text) => setFormData({ ...formData, time: text })}
          />
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            placeholder="Vehicle (e.g., Toyota Camry, Mountain Bike)"
            placeholderTextColor="#6b7280"
            value={formData.vehicle}
            onChangeText={(text) => setFormData({ ...formData, vehicle: text })}
          />
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            placeholder="Available Seats"
            placeholderTextColor="#6b7280"
            value={formData.seats}
            keyboardType="numeric"
            onChangeText={(text) => setFormData({ ...formData, seats: text })}
          />
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            placeholder="Price per Person"
            placeholderTextColor="#6b7280"
            value={formData.price}
            onChangeText={(text) => setFormData({ ...formData, price: text })}
          />
          <TouchableOpacity 
            style={[styles.submitButton, { backgroundColor: colors.primary }]} 
            onPress={handleAddRide}
          >
            <Text style={styles.submitButtonText}>Post Ride</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.rides}>
        {rides.map((ride) => (
          <View key={ride.id} style={[styles.rideCard, { backgroundColor: colors.card }]}>
            <View style={styles.rideHeader}>
              <View style={styles.driverInfo}>
                <Ionicons
                  name={ride.type === 'car' ? 'car' : 'bicycle'}
                  size={24}
                  color={colors.primary}
                />
                <Text style={[styles.driverName, { color: colors.text }]}>{ride.driver}</Text>
              </View>
              <Text style={[styles.price, { color: colors.text }]}>{ride.price}</Text>
            </View>

            <View style={styles.routeContainer}>
              <View style={styles.routePoint}>
                <Ionicons name="location" size={16} color={colors.primary} />
                <Text style={[styles.routeText, { color: colors.text }]}>{ride.from}</Text>
              </View>
              <View style={[styles.routeLine, { backgroundColor: colors.border }]} />
              <View style={styles.routePoint}>
                <Ionicons name="location" size={16} color={colors.primary} />
                <Text style={[styles.routeText, { color: colors.text }]}>{ride.to}</Text>
              </View>
            </View>

            <View style={styles.detailsContainer}>
              <View style={styles.detailItem}>
                <Ionicons name="calendar" size={16} color={colors.primary} />
                <Text style={[styles.detailText, { color: colors.text }]}>{ride.date}</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="time" size={16} color={colors.primary} />
                <Text style={[styles.detailText, { color: colors.text }]}>{ride.time}</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="people" size={16} color={colors.primary} />
                <Text style={[styles.detailText, { color: colors.text }]}>{ride.seats} seats</Text>
              </View>
            </View>

            <View style={styles.vehicleInfo}>
              <Ionicons name={ride.type === 'car' ? 'car' : 'bicycle'} size={16} color={colors.primary} />
              <Text style={[styles.vehicleText, { color: colors.text }]}>{ride.vehicle}</Text>
            </View>

            <TouchableOpacity 
              style={[styles.bookButton, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.bookButtonText}>Book Ride</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  form: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  typeButtonActive: {
    backgroundColor: '#6366f1',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  typeButtonTextActive: {
    color: 'white',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  submitButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  rides: {
    padding: 16,
  },
  rideCard: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '600',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
  },
  routeContainer: {
    marginBottom: 16,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  routeLine: {
    width: 2,
    height: 24,
    marginLeft: 7,
    marginVertical: 4,
  },
  routeText: {
    fontSize: 16,
  },
  detailsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 14,
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  vehicleText: {
    fontSize: 14,
  },
  bookButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 