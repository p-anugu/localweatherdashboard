const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public directory
app.use(express.static('public'));

// Weather API endpoint
app.get('/api/weather/:zipcode', async (req, res) => {
    const { zipcode } = req.params;
    const apiKey = process.env.WEATHERAPI_KEY;

    // Validate zip code format (5 digits)
    if (!/^\d{5}$/.test(zipcode)) {
        return res.status(400).json({ 
            error: 'Invalid zip code format. Please enter a 5-digit US zip code.' 
        });
    }

    if (!apiKey) {
        return res.status(500).json({ 
            error: 'Server configuration error. API key not found.' 
        });
    }

    try {
        // WeatherAPI supports zip code directly
        const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${zipcode}&aqi=no`;
        const response = await axios.get(apiUrl);
        
        // Extract relevant weather data
        const weatherData = {
            location: `${response.data.location.name}, ${response.data.location.region}`,
            temperature: Math.round(response.data.current.temp_f),
            feelsLike: Math.round(response.data.current.feelslike_f),
            description: response.data.current.condition.text.toLowerCase(),
            icon: response.data.current.condition.icon
        };

        res.json(weatherData);
    } catch (error) {
        if (error.response && error.response.status === 400) {
            res.status(404).json({ 
                error: 'Weather data not found for this zip code.' 
            });
        } else {
            console.error('Weather API error:', error.message);
            res.status(500).json({ 
                error: 'Unable to fetch weather data. Please try again later.' 
            });
        }
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});