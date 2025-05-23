
// Supabase client initialization
const SUPABASE_URL = "https://zsfbythbnhnypqqjetdy.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzZmJ5dGhibmhueXBxcWpldGR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxOTgxODMsImV4cCI6MjA1OTc3NDE4M30.YQatQBxy3SHhVNRDVXHqsvtbxiia-9EQlcEWT0lBbu4";

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Global auth state
let currentUser = null;
let currentSession = null;

// Auth state listeners
const authListeners = [];

function addAuthListener(callback) {
  authListeners.push(callback);
}

function notifyAuthListeners() {
  authListeners.forEach(callback => callback(currentUser, currentSession));
}

// Initialize auth state
async function initAuth() {
  // Set up auth state listener
  supabase.auth.onAuthStateChange((event, session) => {
    currentSession = session;
    currentUser = session?.user ?? null;
    notifyAuthListeners();
  });

  // Check for existing session
  const { data: { session } } = await supabase.auth.getSession();
  currentSession = session;
  currentUser = session?.user ?? null;
  notifyAuthListeners();
}

// Auth functions
async function signUp(email, password, username = '') {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: username
      }
    }
  });
  
  return { data, error };
}

async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  return { data, error };
}

async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

// Profile functions
async function updateProfile(profileData) {
  if (!currentUser) return { error: { message: 'Not authenticated' } };
  
  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...profileData,
      updated_at: new Date().toISOString()
    })
    .eq('id', currentUser.id);
    
  return { data, error };
}

async function getProfile() {
  if (!currentUser) return { data: null, error: { message: 'Not authenticated' } };
  
  const { data, error } = await supabase
    .from('profiles')
    .select('username, avatar_url')
    .eq('id', currentUser.id)
    .single();
    
  return { data, error };
}
