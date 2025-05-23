
// Authentication management
document.addEventListener('DOMContentLoaded', function() {
  const authBtn = document.getElementById('authBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const heroAuth = document.getElementById('heroAuth');
  const heroLoginBtn = document.getElementById('heroLoginBtn');
  const authForm = document.getElementById('authForm');
  const authMessage = document.getElementById('authMessage');
  const loginTab = document.getElementById('loginTab');
  const signupTab = document.getElementById('signupTab');
  const authSubmitBtn = document.getElementById('authSubmitBtn');
  const usernameGroup = document.getElementById('usernameGroup');

  let isLoginMode = true;

  // Initialize auth
  initAuth();

  // Auth state listener
  addAuthListener((user, session) => {
    updateAuthUI(user);
  });

  function updateAuthUI(user) {
    if (user) {
      authBtn.style.display = 'none';
      logoutBtn.style.display = 'block';
      heroAuth.style.display = 'none';
      
      // Redirect to home if on auth page
      if (getCurrentPage() === 'auth') {
        navigateToPage('home');
      }
    } else {
      authBtn.style.display = 'block';
      logoutBtn.style.display = 'none';
      heroAuth.style.display = 'block';
    }
  }

  // Tab switching
  loginTab.addEventListener('click', () => {
    isLoginMode = true;
    loginTab.classList.add('active');
    signupTab.classList.remove('active');
    usernameGroup.style.display = 'none';
    authSubmitBtn.textContent = 'Login';
    clearAuthMessage();
  });

  signupTab.addEventListener('click', () => {
    isLoginMode = false;
    signupTab.classList.add('active');
    loginTab.classList.remove('active');
    usernameGroup.style.display = 'block';
    authSubmitBtn.textContent = 'Sign Up';
    clearAuthMessage();
  });

  // Auth form submission
  authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const username = document.getElementById('username').value;

    if (!email || !password) {
      showAuthMessage('Please fill in all required fields', 'error');
      return;
    }

    setAuthLoading(true);
    clearAuthMessage();

    try {
      let result;
      
      if (isLoginMode) {
        result = await signIn(email, password);
      } else {
        result = await signUp(email, password, username);
      }

      if (result.error) {
        showAuthMessage(result.error.message, 'error');
      } else {
        if (isLoginMode) {
          showAuthMessage('Successfully logged in!', 'success');
          setTimeout(() => navigateToPage('home'), 1000);
        } else {
          showAuthMessage('Account created successfully! Please check your email for verification.', 'success');
        }
      }
    } catch (error) {
      showAuthMessage('An unexpected error occurred', 'error');
    } finally {
      setAuthLoading(false);
    }
  });

  // Logout handler
  logoutBtn.addEventListener('click', async () => {
    try {
      await signOut();
      showToast('Successfully logged out', 'success');
      navigateToPage('home');
    } catch (error) {
      showToast('Error logging out', 'error');
    }
  });

  // Auth button handlers
  authBtn.addEventListener('click', () => navigateToPage('auth'));
  heroLoginBtn.addEventListener('click', () => navigateToPage('auth'));

  function setAuthLoading(loading) {
    authSubmitBtn.disabled = loading;
    authSubmitBtn.classList.toggle('loading', loading);
  }

  function showAuthMessage(message, type) {
    authMessage.textContent = message;
    authMessage.className = `auth-message ${type}`;
    authMessage.style.display = 'block';
  }

  function clearAuthMessage() {
    authMessage.style.display = 'none';
    authMessage.textContent = '';
    authMessage.className = 'auth-message';
  }
});
