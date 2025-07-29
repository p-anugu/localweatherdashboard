// Get DOM elements
const weatherForm = document.getElementById('weatherForm');
const zipcodeInput = document.getElementById('zipcode');
const loadingDiv = document.getElementById('loading');
const weatherResults = document.getElementById('weatherResults');
const errorMessage = document.getElementById('errorMessage');

// Weather display elements
const locationName = document.getElementById('locationName');
const tempElement = document.getElementById('temp');
const descriptionElement = document.getElementById('description');
const feelsLikeElement = document.getElementById('feelsLike');

// Handle form submission
weatherForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const zipcode = zipcodeInput.value.trim();
    
    // Validate zip code format
    if (!/^\d{5}$/.test(zipcode)) {
        showError('Please enter a valid 5-digit zip code.');
        return;
    }
    
    // Clear previous results and show loading
    hideAllSections();
    showLoading();
    
    try {
        // Fetch weather data from server API
        const response = await fetch(`/api/weather/${zipcode}`);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch weather data');
        }
        
        // Display weather data
        displayWeather(data);
        
    } catch (error) {
        showError(error.message || 'An error occurred while fetching weather data.');
    } finally {
        hideLoading();
    }
});

// Display weather data
function displayWeather(data) {
    locationName.textContent = data.location;
    tempElement.textContent = data.temperature;
    descriptionElement.textContent = data.description;
    feelsLikeElement.textContent = data.feelsLike;
    
    weatherResults.classList.remove('hidden');
    
    // Store weather data for impact reporting
    sessionStorage.setItem('currentWeather', JSON.stringify(data));
    sessionStorage.setItem('currentZipcode', zipcodeInput.value);
}

// Show loading state
function showLoading() {
    loadingDiv.classList.remove('hidden');
}

// Hide loading state
function hideLoading() {
    loadingDiv.classList.add('hidden');
}

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}

// Hide all sections
function hideAllSections() {
    weatherResults.classList.add('hidden');
    errorMessage.classList.add('hidden');
    loadingDiv.classList.add('hidden');
}

// Allow only numeric input in zip code field
zipcodeInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^\d]/g, '');
});