
// Navigation management
document.addEventListener('DOMContentLoaded', function() {
  const navLinks = document.querySelectorAll('.nav-link');
  const featureCards = document.querySelectorAll('.feature-card');
  const pages = document.querySelectorAll('.page');

  // Navigation event listeners
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = link.getAttribute('data-page');
      navigateToPage(page);
    });
  });

  // Feature card navigation
  featureCards.forEach(card => {
    card.addEventListener('click', () => {
      const page = card.getAttribute('data-page');
      navigateToPage(page);
    });
  });

  // Navigation function
  window.navigateToPage = function(pageName) {
    // Check if user is authenticated for protected pages
    if (pageName !== 'home' && pageName !== 'auth' && !currentUser) {
      navigateToPage('auth');
      // Fix: Use toast utility function instead of direct showToast call
      if (window.showToast) {
        window.showToast('Please log in to access this feature', 'info');
      } else {
        console.warn('Toast notification system not available');
      }
      return;
    }

    // Hide all pages
    pages.forEach(page => {
      page.classList.remove('active');
    });

    // Show target page
    const targetPage = document.getElementById(pageName + 'Page');
    if (targetPage) {
      targetPage.classList.add('active');
    }

    // Update active nav link
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-page') === pageName) {
        link.classList.add('active');
      }
    });

    // Update URL without page reload
    const newUrl = pageName === 'home' ? '/' : `/${pageName}`;
    history.pushState({ page: pageName }, '', newUrl);
  };

  // Get current page
  window.getCurrentPage = function() {
    const activePage = document.querySelector('.page.active');
    if (activePage) {
      return activePage.id.replace('Page', '');
    }
    return 'home';
  };

  // Handle browser back/forward
  window.addEventListener('popstate', (e) => {
    const page = e.state?.page || 'home';
    navigateToPage(page);
  });

  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinksContainer = document.getElementById('navLinks');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinksContainer.classList.toggle('show');
    });
  }

  // Close mobile menu when clicking nav links
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinksContainer.classList.remove('show');
    });
  });

  // Initialize page based on URL
  const path = window.location.pathname;
  const initialPage = path === '/' ? 'home' : path.substring(1);
  if (['home', 'auth', 'settings', 'roommate', 'cart', 'rental', 'auto', 'game'].includes(initialPage)) {
    navigateToPage(initialPage);
  } else {
    navigateToPage('home');
  }
});
