
document.addEventListener('DOMContentLoaded', () => {
  // Link item renting CSS
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '../css/item-renting.css';
  document.head.appendChild(link);
  
  // Elements
  const addItemBtn = document.getElementById('add-item-btn');
  const cancelAddItemBtn = document.getElementById('cancel-add-item');
  const addItemForm = document.getElementById('add-item-form');
  const itemForm = document.getElementById('item-form');
  const searchInput = document.getElementById('search-input');
  const resetFiltersBtn = document.getElementById('reset-filters');
  const itemsContainer = document.getElementById('items-container');
  const itemsCountBadge = document.getElementById('items-count').querySelector('span');
  
  // Filter elements
  const filterCategory = document.getElementById('filter-category');
  const priceMinSlider = document.getElementById('price-min');
  const priceMaxSlider = document.getElementById('price-max');
  const minPriceDisplay = document.getElementById('min-price');
  const maxPriceDisplay = document.getElementById('max-price');
  const filterCondition = document.getElementById('filter-condition');
  const availableOnlyCheckbox = document.getElementById('available-only');
  
  // Mock data for rent items
  const mockRentItems = [
    {
      id: '1',
      name: 'Electric Drill',
      ownerId: 'user-1',
      ownerName: 'Robert Chen',
      category: 'Tools',
      condition: 'Good',
      rentAmount: 10,
      rentDuration: 'Day',
      description: 'Cordless drill with two batteries and charger. Perfect for DIY projects.',
      imageUrl: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      available: true
    },
    {
      id: '2',
      name: 'Mountain Bike',
      ownerId: 'user-2',
      ownerName: 'Alice Johnson',
      category: 'Sports',
      condition: 'Very Good',
      rentAmount: 25,
      rentDuration: 'Day',
      description: 'Trek mountain bike, great for trail riding. Helmet included.',
      imageUrl: 'https://images.unsplash.com/photo-1593764592116-bfb2a97c642a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      available: true
    },
    {
      id: '3',
      name: 'Projector',
      ownerId: 'user-3',
      ownerName: 'Mike Wilson',
      category: 'Electronics',
      condition: 'Excellent',
      rentAmount: 30,
      rentDuration: 'Day',
      description: 'HD projector with HDMI and USB ports. Great for movie nights.',
      imageUrl: 'https://images.unsplash.com/photo-1626737023766-0b671a03e062?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      available: false
    },
    {
      id: '4',
      name: 'Camping Tent',
      ownerId: 'user-4',
      ownerName: 'Sarah Miller',
      category: 'Outdoors',
      condition: 'Good',
      rentAmount: 15,
      rentDuration: 'Weekend',
      description: '4-person tent, easy to set up. Waterproof and includes carry bag.',
      imageUrl: 'https://images.unsplash.com/photo-1563299796-17596ed6b017?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      available: true
    },
    {
      id: '5',
      name: 'Stand Mixer',
      ownerId: 'user-5',
      ownerName: 'David Brown',
      category: 'Kitchen',
      condition: 'Very Good',
      rentAmount: 20,
      rentDuration: 'Weekend',
      description: 'KitchenAid stand mixer with multiple attachments. Perfect for baking.',
      imageUrl: 'https://images.unsplash.com/photo-1558138818-d44c4dea7a6a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      available: true
    },
    {
      id: '6',
      name: 'DSLR Camera',
      ownerId: 'user-6',
      ownerName: 'Emma Davis',
      category: 'Electronics',
      condition: 'Excellent',
      rentAmount: 40,
      rentDuration: 'Day',
      description: 'Canon EOS camera with 18-55mm lens. Great for photography enthusiasts.',
      imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      available: true
    }
  ];
  
  // Initialize items array from localStorage or mock data
  let items = getFromLocalStorage(STORAGE_KEYS.RENT_ITEMS, mockRentItems);
  
  // Event listeners
  addItemBtn.addEventListener('click', () => {
    addItemForm.style.display = 'block';
  });
  
  cancelAddItemBtn.addEventListener('click', () => {
    addItemForm.style.display = 'none';
    itemForm.reset();
  });
  
  itemForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addNewItem();
  });
  
  searchInput.addEventListener('input', applyFilters);
  filterCategory.addEventListener('change', applyFilters);
  filterCondition.addEventListener('change', applyFilters);
  availableOnlyCheckbox.addEventListener('change', applyFilters);
  
  // Price range sliders
  priceMinSlider.addEventListener('input', (e) => {
    const minVal = parseInt(e.target.value);
    const maxVal = parseInt(priceMaxSlider.value);
    
    if (minVal > maxVal) {
      priceMaxSlider.value = minVal;
      maxPriceDisplay.textContent = '$' + minVal;
    }
    
    minPriceDisplay.textContent = '$' + minVal;
    applyFilters();
  });
  
  priceMaxSlider.addEventListener('input', (e) => {
    const maxVal = parseInt(e.target.value);
    const minVal = parseInt(priceMinSlider.value);
    
    if (maxVal < minVal) {
      priceMinSlider.value = maxVal;
      minPriceDisplay.textContent = '$' + maxVal;
    }
    
    maxPriceDisplay.textContent = '$' + maxVal;
    applyFilters();
  });
  
  resetFiltersBtn.addEventListener('click', resetFilters);
  
  // Initialize page
  displayItems(items);
  
  // Functions
  function addNewItem() {
    const name = document.getElementById('item-name').value;
    const ownerName = document.getElementById('owner-name').value;
    const category = document.getElementById('category').value;
    const condition = document.getElementById('condition').value;
    const rentAmount = parseFloat(document.getElementById('rent-amount').value);
    const rentDuration = document.getElementById('duration').value;
    const description = document.getElementById('description').value;
    let imageUrl = document.getElementById('image-url').value;
    
    // Validate required fields
    if (!name || !ownerName || !category) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }
    
    // If no image URL provided, use a placeholder
    if (!imageUrl) {
      const placeholders = {
        'Electronics': 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        'Tools': 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        'Sports': 'https://images.unsplash.com/photo-1593764592116-bfb2a97c642a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        'Outdoors': 'https://images.unsplash.com/photo-1563299796-17596ed6b017?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        'Kitchen': 'https://images.unsplash.com/photo-1558138818-d44c4dea7a6a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        'Furniture': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        'Books': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        'Other': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
      };
      
      imageUrl = placeholders[category] || placeholders['Other'];
    }
    
    const newItem = {
      id: Date.now().toString(),
      name,
      ownerId: 'user-' + Date.now(),
      ownerName,
      category,
      condition,
      rentAmount,
      rentDuration,
      description,
      imageUrl,
      available: true
    };
    
    // Add to items array
    items.unshift(newItem);
    
    // Save to localStorage
    saveToLocalStorage(STORAGE_KEYS.RENT_ITEMS, items);
    
    // Reset form and hide it
    itemForm.reset();
    addItemForm.style.display = 'none';
    
    // Update display
    displayItems(items);
    
    showToast(`${name} has been added to the rental marketplace.`, 'success');
  }
  
  function displayItems(itemsToDisplay) {
    if (itemsToDisplay.length === 0) {
      itemsContainer.innerHTML = `
        <div class="empty-container">
          <i class="fas fa-box empty-icon"></i>
          <h3 class="item-title">No items found</h3>
          <p>No items match your search criteria. Try adjusting your filters or add a new item.</p>
        </div>
      `;
      itemsCountBadge.textContent = '0';
      return;
    }
    
    itemsCountBadge.textContent = itemsToDisplay.length;
    
    itemsContainer.innerHTML = itemsToDisplay.map(item => `
      <div class="card item-card">
        <div class="item-image">
          <img src="${item.imageUrl}" alt="${item.name}">
          <span class="item-category">${item.category}</span>
          ${!item.available ? `
            <div class="item-unavailable">
              <span class="unavailable-badge">Currently Rented</span>
            </div>
          ` : ''}
        </div>
        
        <div class="item-details">
          <div class="item-header">
            <h3 class="item-title">${item.name}</h3>
            <span class="badge outline item-condition">${item.condition}</span>
          </div>
          
          <p class="item-price">$${item.rentAmount} per ${item.rentDuration}</p>
          
          <p class="item-description">${item.description || 'No description provided.'}</p>
          
          <p class="item-owner">Owner: <strong>${item.ownerName}</strong></p>
        </div>
        
        <div class="item-footer">
          <button class="btn ${item.available ? '' : 'btn-secondary'}" 
                  data-id="${item.id}" 
                  onclick="toggleItemAvailability('${item.id}')">
            ${item.available ? 'Rent Now' : 'Mark as Returned'}
          </button>
          <button class="btn btn-secondary" onclick="contactOwner('${item.id}')">
            Contact Owner
          </button>
        </div>
      </div>
    `).join('');
  }
  
  function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const categoryFilter = filterCategory.value;
    const minPrice = parseInt(priceMinSlider.value);
    const maxPrice = parseInt(priceMaxSlider.value);
    const conditionFilter = filterCondition.value;
    const availableOnly = availableOnlyCheckbox.checked;
    
    const filtered = items.filter(item => {
      // Apply search filter
      if (searchTerm && !item.name.toLowerCase().includes(searchTerm) && 
          !item.description.toLowerCase().includes(searchTerm)) {
        return false;
      }
      
      // Apply category filter
      if (categoryFilter !== 'all' && item.category !== categoryFilter) {
        return false;
      }
      
      // Apply price filter
      if (item.rentAmount < minPrice || item.rentAmount > maxPrice) {
        return false;
      }
      
      // Apply condition filter
      if (conditionFilter !== 'any' && item.condition !== conditionFilter) {
        return false;
      }
      
      // Apply availability filter
      if (availableOnly && !item.available) {
        return false;
      }
      
      return true;
    });
    
    displayItems(filtered);
  }
  
  function resetFilters() {
    searchInput.value = '';
    filterCategory.value = 'all';
    filterCondition.value = 'any';
    priceMinSlider.value = 0;
    priceMaxSlider.value = 100;
    minPriceDisplay.textContent = '$0';
    maxPriceDisplay.textContent = '$100';
    availableOnlyCheckbox.checked = true;
    
    applyFilters();
  }
  
  // Expose these functions globally for the onclick handlers
  window.toggleItemAvailability = function(itemId) {
    const item = items.find(i => i.id === itemId);
    if (item) {
      item.available = !item.available;
      
      // Save to localStorage
      saveToLocalStorage(STORAGE_KEYS.RENT_ITEMS, items);
      
      // Show toast
      if (item.available) {
        showToast(`${item.name} is now available for others to rent.`, 'success');
      } else {
        showToast(`Your request to rent ${item.name} has been sent to ${item.ownerName}.`, 'success');
      }
      
      // Update display
      applyFilters();
    }
  };
  
  window.contactOwner = function(itemId) {
    const item = items.find(i => i.id === itemId);
    if (item) {
      showToast(`Message sent to ${item.ownerName} about ${item.name}.`, 'success');
    }
  };
});
