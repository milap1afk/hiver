import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@react-navigation/native';

type RentalItem = {
  id: string;
  name: string;
  description: string;
  owner: string;
  price: string;
  duration: string;
  imageUri?: string;
  category: string;
  status: 'available' | 'rented';
};

export default function RentingScreen() {
  const { colors } = useTheme();
  const [items, setItems] = useState<RentalItem[]>([
    {
      id: '1',
      name: 'Mountain Bike',
      description: 'High-quality mountain bike, perfect for weekend adventures',
      owner: 'John',
      price: '$20/day',
      duration: 'Daily',
      category: 'Sports',
      status: 'available',
      imageUri: 'https://picsum.photos/200',
    },
    {
      id: '2',
      name: 'DSLR Camera',
      description: 'Professional camera with multiple lenses',
      owner: 'Emma',
      price: '$30/day',
      duration: 'Daily',
      category: 'Electronics',
      status: 'available',
      imageUri: 'https://picsum.photos/201',
    },
    {
      id: '3',
      name: 'Camping Tent',
      description: '4-person tent, perfect for outdoor adventures',
      owner: 'Mike',
      price: '$25/day',
      duration: 'Weekend',
      category: 'Sports',
      status: 'rented',
      imageUri: 'https://picsum.photos/202',
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [refreshing, setRefreshing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    category: '',
    imageUri: '',
  });

  const categories = ['All', 'Electronics', 'Sports', 'Books', 'Tools', 'Others'];

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0].uri) {
      setFormData({ ...formData, imageUri: result.assets[0].uri });
    }
  };

  const handleAddItem = () => {
    if (!formData.name || !formData.price || !formData.duration) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const newItem: RentalItem = {
      id: Date.now().toString(),
      ...formData,
      owner: 'You',
      status: 'available',
    };

    setItems([newItem, ...items]);
    setShowForm(false);
    setFormData({
      name: '',
      description: '',
      price: '',
      duration: '',
      category: '',
      imageUri: '',
    });
  };

  const toggleItemStatus = (id: string) => {
    setItems(
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === 'available' ? 'rented' : 'available',
            }
          : item
      )
    );
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Search and Filter Section */}
      <View style={[styles.searchContainer, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <View style={[styles.searchInputContainer, { backgroundColor: colors.card }]}>
          <Ionicons name="search" size={20} color={colors.text} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search items..."
            placeholderTextColor="#6b7280"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#9ca3af" />
            </TouchableOpacity>
          ) : null}
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={[styles.categoryScroll, { marginTop: 12 }]}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                selectedCategory === category && styles.categoryChipActive,
                { backgroundColor: selectedCategory === category ? colors.primary : colors.card }
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === category && styles.categoryChipTextActive
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: colors.primary }]}
        onPress={() => setShowForm(!showForm)}
      >
        <Ionicons name={showForm ? 'close' : 'add'} size={24} color="white" />
        <Text style={styles.addButtonText}>
          {showForm ? 'Cancel' : 'Add Item for Rent'}
        </Text>
      </TouchableOpacity>

      {showForm && (
        <View style={[styles.form, { backgroundColor: colors.card }]}>
          <TouchableOpacity style={styles.imagePickerButton} onPress={handleImagePick}>
            {formData.imageUri ? (
              <Image source={{ uri: formData.imageUri }} style={styles.imagePreview} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="camera" size={32} color="#6b7280" />
                <Text style={styles.imagePlaceholderText}>Add Photo</Text>
              </View>
            )}
          </TouchableOpacity>

          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            placeholder="Item Name"
            placeholderTextColor="#6b7280"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
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
            placeholder="Price (e.g., $20/day)"
            placeholderTextColor="#6b7280"
            value={formData.price}
            onChangeText={(text) => setFormData({ ...formData, price: text })}
          />
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            placeholder="Duration (e.g., Daily, Weekly)"
            placeholderTextColor="#6b7280"
            value={formData.duration}
            onChangeText={(text) => setFormData({ ...formData, duration: text })}
          />

          <View style={styles.categoryContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  { backgroundColor: colors.card },
                  formData.category === category && [styles.categoryButtonActive, { backgroundColor: colors.primary }],
                ]}
                onPress={() => setFormData({ ...formData, category })}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    { color: colors.text },
                    formData.category === category && styles.categoryButtonTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity 
            style={[styles.submitButton, { backgroundColor: colors.primary }]} 
            onPress={handleAddItem}
          >
            <Text style={styles.submitButtonText}>List Item</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.items}>
        {filteredItems.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: colors.card }]}>
            <Ionicons name="cube-outline" size={48} color={colors.primary} />
            <Text style={[styles.emptyStateTitle, { color: colors.text }]}>No items found</Text>
            <Text style={styles.emptyStateDesc}>
              Try adjusting your search or filters to find what you're looking for
            </Text>
          </View>
        ) : (
          filteredItems.map((item) => (
            <View key={item.id} style={[styles.itemCard, { backgroundColor: colors.card }]}>
              {item.imageUri && (
                <Image source={{ uri: item.imageUri }} style={styles.itemImage} />
              )}
              <View style={styles.itemContent}>
                <View style={styles.itemHeader}>
                  <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      item.status === 'rented' && styles.statusBadgeRented,
                      { backgroundColor: item.status === 'rented' ? '#fee2e2' : '#dcfce7' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        item.status === 'rented' && styles.statusTextRented,
                        { color: item.status === 'rented' ? '#dc2626' : '#059669' },
                      ]}
                    >
                      {item.status}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.itemDescription, { color: colors.text }]}>{item.description}</Text>

                <View style={styles.itemDetails}>
                  <View style={styles.detailRow}>
                    <Ionicons name="cash-outline" size={16} color={colors.primary} />
                    <Text style={[styles.detailText, { color: colors.text }]}>{item.price}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="time-outline" size={16} color={colors.primary} />
                    <Text style={[styles.detailText, { color: colors.text }]}>{item.duration}</Text>
                  </View>
                  {item.category && (
                    <View style={styles.categoryTag}>
                      <Text style={[styles.categoryTagText, { color: colors.text }]}>{item.category}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.itemFooter}>
                  <Text style={styles.owner}>Owner: {item.owner}</Text>
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      item.status === 'rented' && styles.returnButton,
                    ]}
                    onPress={() => toggleItemStatus(item.id)}
                  >
                    <Text style={styles.actionButtonText}>
                      {item.status === 'available' ? 'Rent Now' : 'Return'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  categoryScroll: {
    marginTop: 12,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: '#6366f1',
  },
  categoryChipText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: 'white',
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
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  imagePickerButton: {
    width: '100%',
    height: 200,
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
  },
  imagePlaceholderText: {
    marginTop: 8,
    color: '#6b7280',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  categoryButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#e5e7eb',
  },
  categoryButtonText: {
    color: '#4b5563',
    fontSize: 14,
  },
  categoryButtonTextActive: {
    color: 'black',
  },
  submitButton: {
    backgroundColor: '#6366f1',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  items: {
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    borderRadius: 12,
    marginHorizontal: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateDesc: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  itemCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: 200,
  },
  itemContent: {
    padding: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 20,
    fontWeight: '600',
    color: 'black',
  },
  statusBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeRented: {
    backgroundColor: '#fee2e2',
  },
  statusText: {
    color: '#059669',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  statusTextRented: {
    color: '#dc2626',
  },
  itemDescription: {
    fontSize: 16,
    color: '#4b5563',
    marginBottom: 12,
  },
  itemDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 16,
    color: 'black',
  },
  categoryTag: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  categoryTagText: {
    fontSize: 12,
    color: '#4b5563',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  owner: {
    fontSize: 14,
    color: '#6b7280',
  },
  actionButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  returnButton: {
    backgroundColor: '#dc2626',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
}); 