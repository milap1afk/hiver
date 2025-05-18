
document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle.querySelector('i');
  
  // Check for saved theme preference or use default (dark)
  const savedTheme = localStorage.getItem('hive-theme');
  if (savedTheme === 'light') {
    document.body.classList.remove('dark-mode');
    document.body.classList.add('light-mode');
    themeIcon.classList.replace('fa-moon', 'fa-sun');
  }
  
  // Handle theme toggle
  themeToggle.addEventListener('click', () => {
    if (document.body.classList.contains('light-mode')) {
      // Switch to dark mode
      document.body.classList.remove('light-mode');
      document.body.classList.add('dark-mode');
      themeIcon.classList.replace('fa-sun', 'fa-moon');
      localStorage.setItem('hive-theme', 'dark');
    } else {
      // Switch to light mode
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
      themeIcon.classList.replace('fa-moon', 'fa-sun');
      localStorage.setItem('hive-theme', 'light');
    }
  });
  
  // Handle mobile navigation
  const handleMobileNav = () => {
    const nav = document.querySelector('.navbar .container');
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    
    if (window.innerWidth <= 768) {
      if (!document.querySelector('.mobile-menu-btn')) {
        nav.insertBefore(mobileMenuBtn, document.querySelector('.theme-toggle'));
      }
    } else {
      const existingBtn = document.querySelector('.mobile-menu-btn');
      if (existingBtn) {
        existingBtn.remove();
      }
      document.querySelector('.nav-links').classList.remove('show');
    }
  };
  
  handleMobileNav();
  window.addEventListener('resize', handleMobileNav);
  
  // Toggle mobile menu
  document.addEventListener('click', (e) => {
    if (e.target.closest('.mobile-menu-btn')) {
      document.querySelector('.nav-links').classList.toggle('show');
    }
  });
});
