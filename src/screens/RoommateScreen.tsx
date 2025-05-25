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

type RoommatePost = {
  id: string;
  name: string;
  location: string;
  budget: string;
  preferences: string;
  timestamp: Date;
};

export default function RoommateScreen() {
  const { colors } = useTheme();
  const [posts, setPosts] = useState<RoommatePost[]>([
    {
      id: '1',
      name: 'Alex Smith',
      location: 'Downtown',
      budget: '$800-1000',
      preferences: 'Non-smoker, pet-friendly',
      timestamp: new Date(),
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    budget: '',
    preferences: '',
  });

  const handlePost = () => {
    if (!formData.name || !formData.location || !formData.budget) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const newPost: RoommatePost = {
      id: Date.now().toString(),
      ...formData,
      timestamp: new Date(),
    };

    setPosts([newPost, ...posts]);
    setShowForm(false);
    setFormData({ name: '', location: '', budget: '', preferences: '' });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: colors.primary }]}
        onPress={() => setShowForm(!showForm)}
      >
        <Ionicons name={showForm ? 'close' : 'add'} size={24} color="white" />
        <Text style={styles.addButtonText}>
          {showForm ? 'Cancel' : 'Post Roommate Ad'}
        </Text>
      </TouchableOpacity>

      {showForm && (
        <View style={[styles.form, { backgroundColor: colors.card }]}>
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            placeholder="Your Name"
            placeholderTextColor="#6b7280"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            placeholder="Location"
            placeholderTextColor="#6b7280"
            value={formData.location}
            onChangeText={(text) => setFormData({ ...formData, location: text })}
          />
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            placeholder="Budget Range"
            placeholderTextColor="#6b7280"
            value={formData.budget}
            onChangeText={(text) => setFormData({ ...formData, budget: text })}
          />
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            placeholder="Preferences (Optional)"
            placeholderTextColor="#6b7280"
            value={formData.preferences}
            onChangeText={(text) => setFormData({ ...formData, preferences: text })}
            multiline
          />
          <TouchableOpacity 
            style={[styles.submitButton, { backgroundColor: colors.primary }]} 
            onPress={handlePost}
          >
            <Text style={styles.submitButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.posts}>
        {posts.map((post) => (
          <View key={post.id} style={[styles.postCard, { backgroundColor: colors.card }]}>
            <View style={styles.postHeader}>
              <Text style={[styles.name, { color: colors.text }]}>{post.name}</Text>
              <Text style={styles.timestamp}>
                {post.timestamp.toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.postDetails}>
              <View style={styles.detailRow}>
                <Ionicons name="location" size={16} color={colors.primary} />
                <Text style={[styles.detailText, { color: colors.text }]}>{post.location}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="cash" size={16} color={colors.primary} />
                <Text style={[styles.detailText, { color: colors.text }]}>{post.budget}</Text>
              </View>
              {post.preferences && (
                <View style={styles.detailRow}>
                  <Ionicons name="list" size={16} color={colors.primary} />
                  <Text style={[styles.detailText, { color: colors.text }]}>{post.preferences}</Text>
                </View>
              )}
            </View>
            <TouchableOpacity 
              style={[styles.contactButton, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.contactButtonText}>Contact</Text>
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
  posts: {
    padding: 16,
  },
  postCard: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  timestamp: {
    color: '#6b7280',
    fontSize: 14,
  },
  postDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 16,
  },
  contactButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  contactButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 