
// Main application logic
document.addEventListener('DOMContentLoaded', function() {
  // Load storage utilities
  const storageScript = document.createElement('script');
  storageScript.src = 'js/storage.js';
  document.head.appendChild(storageScript);
  
  // Initialize settings page
  initializeSettings();
  
  // Toast notification system
  window.showToast = function(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    toastContainer.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => {
      toast.classList.add('show');
    }, 100);
    
    // Auto remove
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 3000);
  };

  // Settings page functionality
  function initializeSettings() {
    const profileForm = document.getElementById('profileForm');
    const profileEmail = document.getElementById('profileEmail');
    const profileUsername = document.getElementById('profileUsername');
    const profileAvatar = document.getElementById('profileAvatar');
    const avatarPreview = document.getElementById('avatarPreview');
    const avatarImg = document.getElementById('avatarImg');
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    const signOutBtn = document.getElementById('signOutBtn');

    // Load profile data when user changes
    addAuthListener(async (user, session) => {
      if (user && getCurrentPage() === 'settings') {
        await loadProfileData();
      }
    });

    async function loadProfileData() {
      if (!currentUser) return;

      profileEmail.value = currentUser.email || '';
      saveProfileBtn.disabled = true;
      saveProfileBtn.textContent = 'Loading...';

      try {
        const { data, error } = await getProfile();
        
        if (error && error.message !== 'Not authenticated') {
          showToast('Error loading profile: ' + error.message, 'error');
        } else if (data) {
          profileUsername.value = data.username || '';
          profileAvatar.value = data.avatar_url || '';
          updateAvatarPreview(data.avatar_url);
        }
      } catch (error) {
        showToast('Error loading profile', 'error');
      } finally {
        saveProfileBtn.disabled = false;
        saveProfileBtn.textContent = 'Save Changes';
      }
    }

    function updateAvatarPreview(url) {
      if (url) {
        avatarImg.src = url;
        avatarImg.onerror = () => {
          avatarImg.src = 'https://via.placeholder.com/150';
        };
        avatarPreview.style.display = 'block';
      } else {
        avatarPreview.style.display = 'none';
      }
    }

    // Avatar URL input handler
    profileAvatar.addEventListener('input', (e) => {
      updateAvatarPreview(e.target.value);
    });

    // Profile form submission
    if (profileForm) {
      profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!currentUser) {
          showToast('Please log in first', 'error');
          return;
        }

        const username = profileUsername.value;
        const avatarUrl = profileAvatar.value;

        saveProfileBtn.disabled = true;
        saveProfileBtn.textContent = 'Saving...';

        try {
          const { error } = await updateProfile({
            username: username,
            avatar_url: avatarUrl
          });

          if (error) {
            showToast('Error updating profile: ' + error.message, 'error');
          } else {
            showToast('Profile updated successfully!', 'success');
          }
        } catch (error) {
          showToast('Error updating profile', 'error');
        } finally {
          saveProfileBtn.disabled = false;
          saveProfileBtn.textContent = 'Save Changes';
        }
      });
    }

    // Sign out button
    if (signOutBtn) {
      signOutBtn.addEventListener('click', async () => {
        try {
          await signOut();
          showToast('Successfully logged out', 'success');
          navigateToPage('home');
        } catch (error) {
          showToast('Error logging out', 'error');
        }
      });
    }

    // Load profile data if already on settings page
    if (getCurrentPage() === 'settings' && currentUser) {
      loadProfileData();
    }
  }

  // Handle mobile navigation
  function handleMobileNav() {
    const nav = document.querySelector('.navbar .container');
    const existingBtn = document.querySelector('.mobile-menu-btn');
    
    if (window.innerWidth <= 768) {
      if (!existingBtn) {
        const mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.className = 'mobile-menu-btn';
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        nav.insertBefore(mobileMenuBtn, document.querySelector('.nav-actions'));
        
        mobileMenuBtn.addEventListener('click', () => {
          document.getElementById('navLinks').classList.toggle('show');
        });
      }
    } else {
      if (existingBtn) {
        existingBtn.remove();
      }
      document.getElementById('navLinks').classList.remove('show');
    }
  }
  
  handleMobileNav();
  window.addEventListener('resize', handleMobileNav);

  // Add fade-in animation to feature cards
  const featureCards = document.querySelectorAll('.feature-card');
  featureCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
    card.style.animation = 'fadeIn 0.6s ease forwards';
  });

  // Highlight current page in navigation
  function updateNavigation() {
    const currentPageName = getCurrentPage();
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
      const linkPage = link.getAttribute('data-page');
      if (linkPage === currentPageName) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Update navigation on page change
  const observer = new MutationObserver(() => {
    updateNavigation();
  });

  document.querySelectorAll('.page').forEach(page => {
    observer.observe(page, { attributes: true, attributeFilter: ['class'] });
  });

  // Initialize navigation
  updateNavigation();
});
