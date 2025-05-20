
/**
 * Utility functions to manage the theme across the application
 */

// Initialize theme based on localStorage or system preference
export const initializeTheme = (): void => {
  // Check localStorage first
  const savedTheme = localStorage.getItem("hive-theme");
  
  if (savedTheme === "dark" || 
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

// Set theme to dark mode
export const setDarkMode = (): void => {
  document.documentElement.classList.add("dark");
  localStorage.setItem("hive-theme", "dark");
  
  // Remove legacy class names
  document.body.classList.remove("light-mode");
  document.body.classList.add("dark-mode");
};

// Set theme to light mode
export const setLightMode = (): void => {
  document.documentElement.classList.remove("dark");
  localStorage.setItem("hive-theme", "light");
  
  // Remove legacy class names
  document.body.classList.remove("dark-mode");
  document.body.classList.add("light-mode");
};

// Toggle between dark and light mode
export const toggleTheme = (): boolean => {
  const isDarkMode = document.documentElement.classList.contains("dark");
  
  if (isDarkMode) {
    setLightMode();
    return false; // return new state
  } else {
    setDarkMode();
    return true; // return new state
  }
};

// Check if dark mode is active
export const isDarkMode = (): boolean => {
  return document.documentElement.classList.contains("dark");
};
