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

type ShoppingItem = {
  id: string;
  name: string;
  quantity: string;
  addedBy: string;
  isCompleted: boolean;
  category: string;
};

export default function ShoppingScreen() {
  const { colors } = useTheme();
  const [items, setItems] = useState<ShoppingItem[]>([
    {
      id: '1',
      name: 'Milk',
      quantity: '2 gallons',
      addedBy: 'Alex',
      isCompleted: false,
      category: 'Dairy',
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    category: '',
  });

  const categories = ['Groceries', 'Household', 'Electronics', 'Other'];

  const handleAddItem = () => {
    if (!formData.name || !formData.quantity) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      ...formData,
      addedBy: 'You', // In a real app, this would come from user authentication
      isCompleted: false,
    };

    setItems([newItem, ...items]);
    setShowForm(false);
    setFormData({ name: '', quantity: '', category: '' });
  };

  const toggleItemCompletion = (id: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
      )
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: colors.primary }]}
        onPress={() => setShowForm(!showForm)}
      >
        <Ionicons name={showForm ? 'close' : 'add'} size={24} color="white" />
        <Text style={styles.addButtonText}>
          {showForm ? 'Cancel' : 'Add Shopping Item'}
        </Text>
      </TouchableOpacity>

      {showForm && (
        <View style={[styles.form, { backgroundColor: colors.card }]}>
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            placeholder="Item Name"
            placeholderTextColor="#6b7280"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            placeholder="Quantity"
            placeholderTextColor="#6b7280"
            value={formData.quantity}
            onChangeText={(text) => setFormData({ ...formData, quantity: text })}
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
            <Text style={styles.submitButtonText}>Add Item</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.items}>
        {items.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.itemCard, 
              { backgroundColor: colors.card },
              item.isCompleted && styles.itemCardCompleted
            ]}
            onPress={() => toggleItemCompletion(item.id)}
          >
            <View style={styles.itemHeader}>
              <View style={styles.itemTitleContainer}>
                <Ionicons
                  name={item.isCompleted ? 'checkmark-circle' : 'ellipse-outline'}
                  size={24}
                  color={item.isCompleted ? '#10b981' : colors.primary}
                />
                <Text
                  style={[
                    styles.itemName,
                    { color: colors.text },
                    item.isCompleted && styles.itemNameCompleted,
                  ]}
                >
                  {item.name}
                </Text>
              </View>
              <Text style={[styles.quantity, { color: colors.text }]}>{item.quantity}</Text>
            </View>
            <View style={styles.itemFooter}>
              <Text style={[styles.addedBy, { color: colors.text }]}>Added by {item.addedBy}</Text>
              {item.category && (
                <View style={[styles.categoryTag, { backgroundColor: colors.card }]}>
                  <Text style={[styles.categoryTagText, { color: colors.text }]}>{item.category}</Text>
                </View>
              )}
            </View>
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
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#6366f1',
  },
  categoryButtonText: {
    fontSize: 14,
  },
  categoryButtonTextActive: {
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
  items: {
    padding: 16,
  },
  itemCard: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  itemCardCompleted: {
    opacity: 0.7,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  itemNameCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  quantity: {
    fontSize: 16,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  addedBy: {
    fontSize: 14,
  },
  categoryTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryTagText: {
    fontSize: 12,
  },
}); 