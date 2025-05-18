
document.addEventListener('DOMContentLoaded', () => {
  // Link roommate finder CSS
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '../css/roommate-finder.css';
  document.head.appendChild(link);
  
  // Elements
  const roommateForm = document.getElementById('roommate-form');
  const profileFormCard = document.getElementById('profile-form-card');
  const profileViewCard = document.getElementById('profile-view-card');
  const profileDetails = document.getElementById('profile-details');
  const editProfileBtn = document.getElementById('edit-profile-btn');
  const filterCard = document.getElementById('filter-card');
  const matchesContainer = document.getElementById('matches-container');
  
  // Filter elements
  const filterLocation = document.getElementById('filter-location');
  const budgetMinSlider = document.getElementById('budget-min');
  const budgetMaxSlider = document.getElementById('budget-max');
  const minBudgetDisplay = document.getElementById('min-budget');
  const maxBudgetDisplay = document.getElementById('max-budget');
  const filterGender = document.getElementById('filter-gender');
  
  // Mock data
  const mockUsers = [
    {
      id: '1',
      name: 'Alex Johnson',
      age: 24,
      gender: 'Male',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      about: 'Grad student in Computer Science. Clean and quiet roommate who enjoys cooking and occasional gaming sessions.'
    },
    {
      id: '2',
      name: 'Emma Wilson',
      age: 26,
      gender: 'Female',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      about: 'Working professional in marketing. I love yoga, hiking, and trying new restaurants in the area.'
    },
    {
      id: '3',
      name: 'Michael Chen',
      age: 23,
      gender: 'Male',
      avatar: 'https://randomuser.me/api/portraits/men/52.jpg',
      about: 'Medical student who studies a lot. Looking for a quiet place. I enjoy running and watching documentaries.'
    },
    {
      id: '4',
      name: 'Sofia Rodriguez',
      age: 27,
      gender: 'Female',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      about: 'Artist and part-time barista. I\'m creative, respectful of space, and love having plants around.'
    },
    {
      id: '5',
      name: 'Jordan Taylor',
      age: 25,
      gender: 'Non-binary',
      avatar: 'https://randomuser.me/api/portraits/lego/3.jpg',
      about: 'Software developer who works remotely. I enjoy video games, board games, and keeping my living space organized.'
    }
  ];
  
  const mockPreferences = [
    {
      userId: '1',
      location: 'Downtown',
      budget: 1200,
      interests: ['Reading', 'Cooking', 'Gaming', 'Movies'],
      prefers: ['Clean', 'Quiet', 'Non-smoker']
    },
    {
      userId: '2',
      location: 'University Area',
      budget: 950,
      interests: ['Yoga', 'Hiking', 'Photography', 'Cooking'],
      prefers: ['Eco-friendly', 'Active', 'Early riser']
    },
    {
      userId: '3',
      location: 'Suburbs',
      budget: 800,
      interests: ['Running', 'Documentaries', 'Reading', 'Chess'],
      prefers: ['Quiet', 'Studious', 'Clean']
    },
    {
      userId: '4',
      location: 'Downtown',
      budget: 1100,
      interests: ['Art', 'Music', 'Plants', 'Coffee'],
      prefers: ['Creative', 'Respectful', 'Plant lover']
    },
    {
      userId: '5',
      location: 'Riverside',
      budget: 1000,
      interests: ['Gaming', 'Board games', 'Technology', 'Movies'],
      prefers: ['Tech-savvy', 'Organized', 'Night owl']
    }
  ];
  
  // Combine user and preference data
  const roommates = mockUsers.map(user => {
    const preference = mockPreferences.find(pref => pref.userId === user.id);
    return { ...user, ...preference };
  });
  
  // Check for saved profile
  const savedProfile = getFromLocalStorage(STORAGE_KEYS.USER_PROFILE, null);
  if (savedProfile) {
    displayProfile(savedProfile);
    findMatches(savedProfile);
  }
  
  // Form submission
  roommateForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {
      name: document.getElementById('name').value,
      age: parseInt(document.getElementById('age').value),
      gender: document.getElementById('gender').value,
      budget: parseInt(document.getElementById('budget').value),
      location: document.getElementById('location').value,
      interests: document.getElementById('interests').value,
      about: document.getElementById('about').value
    };
    
    // Save to localStorage
    saveToLocalStorage(STORAGE_KEYS.USER_PROFILE, formData);
    
    // Display profile and find matches
    displayProfile(formData);
    findMatches(formData);
    
    showToast('Profile saved successfully!', 'success');
  });
  
  // Edit profile button
  editProfileBtn.addEventListener('click', () => {
    profileViewCard.style.display = 'none';
    filterCard.style.display = 'none';
    profileFormCard.style.display = 'block';
    
    // Fill form with existing data
    const profile = getFromLocalStorage(STORAGE_KEYS.USER_PROFILE);
    if (profile) {
      document.getElementById('name').value = profile.name;
      document.getElementById('age').value = profile.age;
      document.getElementById('gender').value = profile.gender;
      document.getElementById('budget').value = profile.budget;
      document.getElementById('location').value = profile.location;
      document.getElementById('interests').value = profile.interests;
      document.getElementById('about').value = profile.about;
    }
  });
  
  // Filter change handlers
  filterLocation.addEventListener('change', applyFilters);
  filterGender.addEventListener('change', applyFilters);
  
  // Budget slider events
  budgetMinSlider.addEventListener('input', (e) => {
    const minVal = parseInt(e.target.value);
    const maxVal = parseInt(budgetMaxSlider.value);
    
    if (minVal > maxVal) {
      budgetMaxSlider.value = minVal;
      maxBudgetDisplay.textContent = '$' + minVal;
    }
    
    minBudgetDisplay.textContent = '$' + minVal;
    applyFilters();
  });
  
  budgetMaxSlider.addEventListener('input', (e) => {
    const maxVal = parseInt(e.target.value);
    const minVal = parseInt(budgetMinSlider.value);
    
    if (maxVal < minVal) {
      budgetMinSlider.value = maxVal;
      minBudgetDisplay.textContent = '$' + maxVal;
    }
    
    maxBudgetDisplay.textContent = '$' + maxVal;
    applyFilters();
  });
  
  // Display profile function
  function displayProfile(profile) {
    profileFormCard.style.display = 'none';
    profileViewCard.style.display = 'block';
    filterCard.style.display = 'block';
    
    profileDetails.innerHTML = `
      <div class="profile-item">
        <span class="profile-label">Name</span>
        <span class="profile-value">${profile.name}</span>
      </div>
      
      <div class="profile-row">
        <div class="profile-item">
          <span class="profile-label">Age</span>
          <span class="profile-value">${profile.age}</span>
        </div>
        
        <div class="profile-item">
          <span class="profile-label">Gender</span>
          <span class="profile-value">${profile.gender}</span>
        </div>
      </div>
      
      <div class="profile-row">
        <div class="profile-item">
          <span class="profile-label">Budget</span>
          <span class="profile-value">$${profile.budget}/month</span>
        </div>
        
        <div class="profile-item">
          <span class="profile-label">Location</span>
          <span class="profile-value">${profile.location}</span>
        </div>
      </div>
      
      <div class="profile-item">
        <span class="profile-label">Interests</span>
        <div class="interests-list">
          ${profile.interests.split(',').map(interest => 
            `<span class="interest-item">${interest.trim()}</span>`
          ).join('')}
        </div>
      </div>
      
      <div class="profile-item">
        <span class="profile-label">About</span>
        <p class="profile-value">${profile.about}</p>
      </div>
    `;
  }
  
  // Find matches function
  function findMatches(profile) {
    // Simple matching algorithm
    const matched = roommates.filter(roommate => {
      // Match by budget range (±20%)
      const budgetMatch = Math.abs(roommate.budget - profile.budget) / profile.budget <= 0.2;
      
      // Match by location
      const locationMatch = roommate.location.toLowerCase() === profile.location.toLowerCase();
      
      // Match by at least one common interest
      const userInterests = profile.interests.toLowerCase().split(',').map(i => i.trim());
      const commonInterests = roommate.interests.some(interest => 
        userInterests.some(userInterest => interest.toLowerCase().includes(userInterest.toLowerCase()))
      );
      
      return budgetMatch && locationMatch && commonInterests;
    });
    
    displayMatches(matched);
  }
  
  // Display matches function
  function displayMatches(matches) {
    if (matches.length === 0) {
      matchesContainer.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-search empty-icon"></i>
          <h2>No matches found</h2>
          <p>Try adjusting your filters or updating your profile information.</p>
        </div>
      `;
      return;
    }
    
    matchesContainer.innerHTML = `
      <h2>Your Matches (${matches.length})</h2>
      <div class="matches-grid">
        ${matches.map(match => `
          <div class="card match-card">
            <div class="match-image">
              <img src="${match.avatar}" alt="${match.name}">
            </div>
            <div class="match-details">
              <div class="match-title">
                <h3 class="match-name">${match.name}, ${match.age}</h3>
              </div>
              <div class="match-location-budget">
                <span>${match.location}</span>
                <span>$${match.budget}/month</span>
              </div>
              <div class="match-tags">
                ${match.interests.map(interest => `
                  <span class="match-tag">${interest}</span>
                `).join('')}
              </div>
              <p class="match-info">${match.about}</p>
              <div class="match-tags">
                ${match.prefers.map(pref => `
                  <span class="match-tag match-pref-tag">${pref}</span>
                `).join('')}
              </div>
            </div>
            <div class="card-footer">
              <button class="btn btn-secondary contact-btn" data-id="${match.id}">
                Contact ${match.name.split(' ')[0]}
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    
    // Add event listeners to contact buttons
    document.querySelectorAll('.contact-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const matchId = btn.getAttribute('data-id');
        const match = roommates.find(r => r.id === matchId);
        showToast(`Contact request sent to ${match.name}`, 'success');
      });
    });
  }
  
  // Apply filters function
  function applyFilters() {
    const profile = getFromLocalStorage(STORAGE_KEYS.USER_PROFILE);
    if (!profile) return;
    
    const locationFilter = filterLocation.value;
    const minBudget = parseInt(budgetMinSlider.value);
    const maxBudget = parseInt(budgetMaxSlider.value);
    const genderFilter = filterGender.value;
    
    let filteredMatches = roommates.filter(roommate => {
      // Match by budget range (±20%)
      const budgetMatch = Math.abs(roommate.budget - profile.budget) / profile.budget <= 0.2;
      
      // Additional filters
      const locationMatch = locationFilter === 'all' || roommate.location === locationFilter;
      const budgetInRange = roommate.budget >= minBudget && roommate.budget <= maxBudget;
      const genderMatch = genderFilter === 'any' || roommate.gender === genderFilter;
      
      // Match by at least one common interest
      const userInterests = profile.interests.toLowerCase().split(',').map(i => i.trim());
      const commonInterests = roommate.interests.some(interest => 
        userInterests.some(userInterest => interest.toLowerCase().includes(userInterest.toLowerCase()))
      );
      
      return budgetMatch && locationMatch && budgetInRange && genderMatch && commonInterests;
    });
    
    displayMatches(filteredMatches);
  }
});
