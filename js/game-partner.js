
document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const playersContainer = document.getElementById('players-container');
  const playerCount = document.getElementById('player-count');
  const gameSearch = document.getElementById('game-search');
  const gameType = document.getElementById('game-type');
  const skillLevel = document.getElementById('skill-level');
  const availabilityCheckboxes = document.querySelectorAll('input[name="availability"]');
  const applyFiltersBtn = document.getElementById('apply-filters');
  const resetFiltersBtn = document.getElementById('reset-filters');
  const toggleProfileFormBtn = document.getElementById('toggle-profile-form');
  const profileFormContainer = document.getElementById('profile-form-container');
  const gameProfileForm = document.getElementById('game-profile-form');
  
  // Sample data for game partners
  const mockPlayers = [
    {
      id: 'player-1',
      name: 'Alex Johnson',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      games: ['Chess', 'Poker', 'Settlers of Catan'],
      gameTypes: ['board', 'card', 'board'],
      skillLevel: 'advanced',
      availability: ['weekday-evening', 'weekend-day', 'weekend-evening'],
      bio: 'Chess enthusiast with a passion for strategy games. Always looking for worthy opponents!'
    },
    {
      id: 'player-2',
      name: 'Emma Wilson',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      games: ['Dungeons & Dragons', 'Magic: The Gathering', 'Pandemic'],
      gameTypes: ['tabletop', 'card', 'board'],
      skillLevel: 'intermediate',
      availability: ['weekend-day', 'weekend-evening'],
      bio: 'Experienced D&D Dungeon Master. I run weekly campaigns and always welcome new players to join our adventures.'
    },
    {
      id: 'player-3',
      name: 'Michael Chen',
      avatar: 'https://randomuser.me/api/portraits/men/52.jpg',
      games: ['FIFA', 'Call of Duty', 'Fortnite'],
      gameTypes: ['video', 'video', 'video'],
      skillLevel: 'expert',
      availability: ['weekday-evening', 'weekend-evening'],
      bio: 'Competitive gamer focusing on FPS and sports games. Looking for teammates for online tournaments.'
    },
    {
      id: 'player-4',
      name: 'Sofia Rodriguez',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      games: ['Scrabble', 'Monopoly', 'Trivial Pursuit'],
      gameTypes: ['board', 'board', 'board'],
      skillLevel: 'beginner',
      availability: ['weekday-day', 'weekend-day'],
      bio: 'Casual board game player looking for fun game nights. I bring snacks!'
    },
    {
      id: 'player-5',
      name: 'Jordan Taylor',
      avatar: 'https://randomuser.me/api/portraits/lego/3.jpg',
      games: ['Mario Kart', 'Minecraft', 'Among Us'],
      gameTypes: ['video', 'video', 'video'],
      skillLevel: 'intermediate',
      availability: ['weekday-evening', 'weekend-day', 'weekend-evening'],
      bio: 'Video game enthusiast who enjoys both competitive and cooperative gameplay. Voice chat preferred.'
    }
  ];
  
  // Load players from localStorage or use mock data
  let players = getFromLocalStorage(STORAGE_KEYS.GAME_PARTNERS, mockPlayers);
  
  // Display all players on page load
  displayPlayers(players);
  
  // Check for user profile
  const userProfile = getFromLocalStorage(STORAGE_KEYS.GAME_PROFILE, null);
  if (userProfile) {
    populateProfileForm(userProfile);
  }
  
  // Toggle profile form
  toggleProfileFormBtn.addEventListener('click', () => {
    if (profileFormContainer.style.display === 'none' || !profileFormContainer.style.display) {
      profileFormContainer.style.display = 'block';
      toggleProfileFormBtn.textContent = 'Cancel';
    } else {
      profileFormContainer.style.display = 'none';
      toggleProfileFormBtn.textContent = userProfile ? 'Edit Profile' : 'Create Profile';
    }
  });
  
  // Profile form submission
  gameProfileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('profile-name').value;
    const games = document.getElementById('profile-games').value.split(',').map(game => game.trim());
    const skill = document.getElementById('profile-skill').value;
    const bio = document.getElementById('profile-bio').value;
    
    // Get selected availability
    const availability = [];
    document.querySelectorAll('input[name="profile-availability"]:checked').forEach(checkbox => {
      availability.push(checkbox.value);
    });
    
    // Create profile object
    const profile = {
      id: userProfile ? userProfile.id : 'player-' + Date.now(),
      name,
      avatar: 'https://randomuser.me/api/portraits/lego/1.jpg', // Default avatar
      games,
      gameTypes: games.map(() => guessGameType(games[0])),
      skillLevel: skill,
      availability,
      bio
    };
    
    // Save profile to localStorage
    saveToLocalStorage(STORAGE_KEYS.GAME_PROFILE, profile);
    
    // Add to players array if not already there
    if (!userProfile) {
      players = [profile, ...players];
      saveToLocalStorage(STORAGE_KEYS.GAME_PARTNERS, players);
    } else {
      // Update existing profile
      players = players.map(player => player.id === profile.id ? profile : player);
      saveToLocalStorage(STORAGE_KEYS.GAME_PARTNERS, players);
    }
    
    // Update UI
    displayPlayers(players);
    profileFormContainer.style.display = 'none';
    toggleProfileFormBtn.textContent = 'Edit Profile';
    
    // Show success message
    showToast('Profile saved successfully!', 'success');
  });
  
  // Apply filters
  applyFiltersBtn.addEventListener('click', () => {
    const searchTerm = gameSearch.value.toLowerCase();
    const selectedType = gameType.value;
    const selectedSkill = skillLevel.value;
    
    // Get selected availability
    const selectedAvailability = [];
    availabilityCheckboxes.forEach(checkbox => {
      if (checkbox.checked) {
        selectedAvailability.push(checkbox.value);
      }
    });
    
    // Filter players
    const filteredPlayers = players.filter(player => {
      // Search term filter
      const matchesSearch = searchTerm === '' || 
        player.name.toLowerCase().includes(searchTerm) ||
        player.games.some(game => game.toLowerCase().includes(searchTerm)) ||
        player.bio.toLowerCase().includes(searchTerm);
      
      // Game type filter
      const matchesType = selectedType === 'all' || 
        player.gameTypes.some(type => type === selectedType);
      
      // Skill level filter
      const matchesSkill = selectedSkill === 'all' || 
        player.skillLevel === selectedSkill;
      
      // Availability filter
      const matchesAvailability = selectedAvailability.length === 0 ||
        player.availability.some(avail => selectedAvailability.includes(avail));
      
      return matchesSearch && matchesType && matchesSkill && matchesAvailability;
    });
    
    displayPlayers(filteredPlayers);
  });
  
  // Reset filters
  resetFiltersBtn.addEventListener('click', () => {
    gameSearch.value = '';
    gameType.value = 'all';
    skillLevel.value = 'all';
    
    // Uncheck all availability checkboxes
    availabilityCheckboxes.forEach(checkbox => {
      checkbox.checked = false;
    });
    
    displayPlayers(players);
  });
  
  // Display players function
  function displayPlayers(playersToDisplay) {
    playerCount.textContent = `${playersToDisplay.length} ${playersToDisplay.length === 1 ? 'Player' : 'Players'}`;
    
    if (playersToDisplay.length === 0) {
      playersContainer.innerHTML = `
        <div class="empty-players">
          <i class="fas fa-gamepad"></i>
          <h3>No players found</h3>
          <p>No game partners match your criteria. Try adjusting your filters or add your own profile.</p>
        </div>
      `;
      return;
    }
    
    playersContainer.innerHTML = playersToDisplay.map(player => {
      // Format availability for display
      const availabilityIcons = {
        'weekday-day': 'sun',
        'weekday-evening': 'moon',
        'weekend-day': 'calendar-day',
        'weekend-evening': 'calendar-week'
      };
      
      const availabilityLabels = {
        'weekday-day': 'Weekday Daytime',
        'weekday-evening': 'Weekday Evening',
        'weekend-day': 'Weekend Daytime',
        'weekend-evening': 'Weekend Evening'
      };
      
      return `
        <div class="player-card">
          <div class="player-header">
            <div class="player-avatar">
              ${player.avatar ? `<img src="${player.avatar}" alt="${player.name}">` : 
                `<i class="fas fa-user"></i>`}
            </div>
            <div class="player-info">
              <h3>${player.name}</h3>
              <span class="player-skill">${capitalize(player.skillLevel)} Player</span>
            </div>
          </div>
          
          <div class="player-content">
            <div class="player-games">
              <h4>Games</h4>
              <div class="game-tags">
                ${player.games.map((game, index) => `
                  <span class="game-tag">${game}</span>
                `).join('')}
              </div>
            </div>
            
            <div class="player-availability">
              <h4>Availability</h4>
              <div class="availability-tags">
                ${player.availability.map(avail => `
                  <span class="availability-tag">
                    <i class="fas fa-${availabilityIcons[avail]}"></i>
                    ${availabilityLabels[avail]}
                  </span>
                `).join('')}
              </div>
            </div>
            
            ${player.bio ? `<div class="player-bio">${player.bio}</div>` : ''}
          </div>
          
          <div class="player-footer">
            <button class="btn btn-sm btn-outline">Message</button>
            <button class="btn btn-sm btn-primary connect-btn" data-id="${player.id}">Connect</button>
          </div>
        </div>
      `;
    }).join('');
    
    // Add event listeners to connect buttons
    document.querySelectorAll('.connect-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const playerId = btn.getAttribute('data-id');
        const player = players.find(p => p.id === playerId);
        showToast(`Connection request sent to ${player.name}!`, 'success');
      });
    });
  }
  
  // Populate profile form with existing data
  function populateProfileForm(profile) {
    document.getElementById('profile-name').value = profile.name;
    document.getElementById('profile-games').value = profile.games.join(', ');
    document.getElementById('profile-skill').value = profile.skillLevel;
    document.getElementById('profile-bio').value = profile.bio;
    
    // Check the appropriate availability checkboxes
    document.querySelectorAll('input[name="profile-availability"]').forEach(checkbox => {
      checkbox.checked = profile.availability.includes(checkbox.value);
    });
    
    toggleProfileFormBtn.textContent = 'Edit Profile';
  }
  
  // Helper function to guess game type based on name
  function guessGameType(gameName) {
    const gameLower = gameName.toLowerCase();
    
    if (gameLower.includes('chess') || gameLower.includes('monopoly') || 
        gameLower.includes('catan') || gameLower.includes('scrabble')) {
      return 'board';
    } else if (gameLower.includes('magic') || gameLower.includes('poker') || 
              gameLower.includes('uno')) {
      return 'card';
    } else if (gameLower.includes('dungeons') || gameLower.includes('d&d') || 
              gameLower.includes('pathfinder')) {
      return 'tabletop';
    } else if (gameLower.includes('football') || gameLower.includes('frisbee') || 
              gameLower.includes('soccer')) {
      return 'outdoor';
    } else {
      return 'video'; // Default to video games
    }
  }
  
  // Helper function to capitalize first letter
  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
});
