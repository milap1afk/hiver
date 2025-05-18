
document.addEventListener('DOMContentLoaded', () => {
  // Highlight current page in navigation
  const currentPage = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (currentPage.includes(linkPath) && linkPath !== 'index.html') {
      link.classList.add('active');
    } else if (currentPage.endsWith('/') || currentPage.endsWith('index.html')) {
      if (linkPath === 'index.html') {
        link.classList.add('active');
      }
    }
  });
  
  // Add animations to feature cards
  const featureCards = document.querySelectorAll('.feature-card');
  featureCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
    card.classList.add('animate-fade-in');
  });
});

// Helper function to show toast notifications
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  
  const toastContainer = document.querySelector('.toast-container') || createToastContainer();
  toastContainer.appendChild(toast);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

// Create toast container if it doesn't exist
function createToastContainer() {
  const container = document.createElement('div');
  container.className = 'toast-container';
  document.body.appendChild(container);
  return container;
}

// Local storage helpers
const STORAGE_KEYS = {
  ROOMMATES: 'hive_roommates',
  CART_ITEMS: 'hive_cart_items',
  RENT_ITEMS: 'hive_rent_items',
  AUTO_SHARES: 'hive_auto_shares',
  GAME_PARTNERS: 'hive_game_partners',
  USER_PROFILE: 'hive_user_profile'
};

function saveToLocalStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error saving to localStorage: ${error}`);
    return false;
  }
}

function getFromLocalStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error getting from localStorage: ${error}`);
    return defaultValue;
  }
}

function removeFromLocalStorage(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage: ${error}`);
    return false;
  }
}
