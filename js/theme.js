
// Theme management
document.addEventListener('DOMContentLoaded', function() {
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle.querySelector('i');
  
  // Initialize theme
  initializeTheme();
  
  function initializeTheme() {
    const savedTheme = localStorage.getItem('hive-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
      setLightMode();
    } else {
      setDarkMode();
    }
  }
  
  function setDarkMode() {
    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode');
    themeIcon.classList.remove('fa-sun');
    themeIcon.classList.add('fa-moon');
    localStorage.setItem('hive-theme', 'dark');
  }
  
  function setLightMode() {
    document.body.classList.remove('dark-mode');
    document.body.classList.add('light-mode');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
    localStorage.setItem('hive-theme', 'light');
  }
  
  themeToggle.addEventListener('click', function() {
    if (document.body.classList.contains('dark-mode')) {
      setLightMode();
    } else {
      setDarkMode();
    }
  });
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
    if (!localStorage.getItem('hive-theme')) {
      if (e.matches) {
        setDarkMode();
      } else {
        setLightMode();
      }
    }
  });
});
