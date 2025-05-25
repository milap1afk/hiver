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

type GamePost = {
  id: string;
  player: string;
  game: string;
  platform: string;
  skillLevel: string;
  schedule: string;
  description: string;
  tags: string[];
};

export default function GamePartnerScreen() {
  const { colors } = useTheme();
  const [posts, setPosts] = useState<GamePost[]>([
    {
      id: '1',
      player: 'Alex',
      game: 'League of Legends',
      platform: 'PC',
      skillLevel: 'Intermediate',
      schedule: 'Weekends',
      description: 'Looking for a duo partner for ranked games',
      tags: ['MOBA', 'Ranked', 'Competitive'],
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    game: '',
    platform: '',
    skillLevel: '',
    schedule: '',
    description: '',
    tags: '',
  });

  const platforms = ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile'];
  const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Pro'];

  const handleAddPost = () => {
    if (!formData.game || !formData.platform || !formData.skillLevel) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const newPost: GamePost = {
      id: Date.now().toString(),
      player: 'You', // In a real app, this would come from user authentication
      ...formData,
      tags: formData.tags.split(',').map((tag) => tag.trim()),
    };

    setPosts([newPost, ...posts]);
    setShowForm(false);
    setFormData({
      game: '',
      platform: '',
      skillLevel: '',
      schedule: '',
      description: '',
      tags: '',
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
          {showForm ? 'Cancel' : 'Find Gaming Partner'}
        </Text>
      </TouchableOpacity>

      {showForm && (
        <View style={[styles.form, { backgroundColor: colors.card }]}>
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            placeholder="Game Name"
            placeholderTextColor="#6b7280"
            value={formData.game}
            onChangeText={(text) => setFormData({ ...formData, game: text })}
          />

          <View style={styles.platformContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Platform</Text>
            <View style={styles.platformButtons}>
              {platforms.map((platform) => (
                <TouchableOpacity
                  key={platform}
                  style={[
                    styles.platformButton,
                    { backgroundColor: colors.card },
                    formData.platform === platform && [styles.platformButtonActive, { backgroundColor: colors.primary }],
                  ]}
                  onPress={() => setFormData({ ...formData, platform })}
                >
                  <Text
                    style={[
                      styles.platformButtonText,
                      { color: colors.text },
                      formData.platform === platform && styles.platformButtonTextActive,
                    ]}
                  >
                    {platform}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.skillContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Skill Level</Text>
            <View style={styles.skillButtons}>
              {skillLevels.map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.skillButton,
                    { backgroundColor: colors.card },
                    formData.skillLevel === level && [styles.skillButtonActive, { backgroundColor: colors.primary }],
                  ]}
                  onPress={() => setFormData({ ...formData, skillLevel: level })}
                >
                  <Text
                    style={[
                      styles.skillButtonText,
                      { color: colors.text },
                      formData.skillLevel === level && styles.skillButtonTextActive,
                    ]}
                  >
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            placeholder="Schedule (e.g., Weekends, Evenings)"
            placeholderTextColor="#6b7280"
            value={formData.schedule}
            onChangeText={(text) => setFormData({ ...formData, schedule: text })}
          />

          <TextInput
            style={[styles.input, styles.textArea, { borderColor: colors.border, color: colors.text }]}
            placeholder="Description"
            placeholderTextColor="#6b7280"
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            multiline
            numberOfLines={3}
          />

          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            placeholder="Tags (comma-separated)"
            placeholderTextColor="#6b7280"
            value={formData.tags}
            onChangeText={(text) => setFormData({ ...formData, tags: text })}
          />

          <TouchableOpacity 
            style={[styles.submitButton, { backgroundColor: colors.primary }]} 
            onPress={handleAddPost}
          >
            <Text style={styles.submitButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.posts}>
        {posts.map((post) => (
          <View key={post.id} style={[styles.postCard, { backgroundColor: colors.card }]}>
            <View style={styles.postHeader}>
              <View style={styles.playerInfo}>
                <Ionicons name="person-circle" size={24} color={colors.primary} />
                <Text style={[styles.playerName, { color: colors.text }]}>{post.player}</Text>
              </View>
              <View style={[styles.platformBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.platformBadgeText}>{post.platform}</Text>
              </View>
            </View>

            <Text style={[styles.gameName, { color: colors.text }]}>{post.game}</Text>
            <Text style={[styles.description, { color: colors.text }]}>{post.description}</Text>

            <View style={styles.detailsContainer}>
              <View style={styles.detailItem}>
                <Ionicons name="trophy" size={16} color={colors.primary} />
                <Text style={[styles.detailText, { color: colors.text }]}>{post.skillLevel}</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="time" size={16} color={colors.primary} />
                <Text style={[styles.detailText, { color: colors.text }]}>{post.schedule}</Text>
              </View>
            </View>

            <View style={styles.tagsContainer}>
              {post.tags.map((tag) => (
                <View key={tag} style={[styles.tag, { backgroundColor: colors.card }]}>
                  <Text style={[styles.tagText, { color: colors.text }]}>{tag}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity 
              style={[styles.contactButton, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.contactButtonText}>Contact Player</Text>
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  platformContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  platformButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  platformButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  platformButtonActive: {
    backgroundColor: '#6366f1',
  },
  platformButtonText: {
    fontSize: 14,
  },
  platformButtonTextActive: {
    color: 'white',
  },
  skillContainer: {
    marginBottom: 16,
  },
  skillButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  skillButtonActive: {
    backgroundColor: '#6366f1',
  },
  skillButtonText: {
    fontSize: 14,
  },
  skillButtonTextActive: {
    color: 'white',
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
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  platformBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  platformBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  gameName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
  },
  detailsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    marginLeft: 4,
    fontSize: 14,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
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