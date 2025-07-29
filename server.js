const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();
const { 
    saveWeatherData, 
    getRecentSearches, 
    getSearchesByZipcode,
    saveImpactReport,
    getImpactReportsByZipcode,
    getAllImpactReports
} = require('./database');
const DataAnalyzer = require('./dataAnalyzer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
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

        // Save to database
        try {
            await saveWeatherData(zipcode, weatherData);
            console.log('Weather data saved to database');
        } catch (dbError) {
            console.error('Database save error:', dbError);
            // Continue even if database save fails
        }

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

// API endpoint to get recent weather searches
app.get('/api/weather/history/recent', async (req, res) => {
    try {
        const recentSearches = await getRecentSearches();
        res.json(recentSearches);
    } catch (error) {
        console.error('Error fetching recent searches:', error);
        res.status(500).json({ error: 'Unable to fetch weather history.' });
    }
});

// API endpoint to get weather searches by zipcode
app.get('/api/weather/history/:zipcode', async (req, res) => {
    const { zipcode } = req.params;
    
    try {
        const searches = await getSearchesByZipcode(zipcode);
        res.json(searches);
    } catch (error) {
        console.error('Error fetching zipcode history:', error);
        res.status(500).json({ error: 'Unable to fetch weather history for this zipcode.' });
    }
});

// API endpoint to submit impact report
app.post('/api/impact/report', async (req, res) => {
    try {
        const reportData = req.body;
        
        // Validate required fields
        if (!reportData.zipcode || !reportData.activityType || !reportData.impactDescription) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        // Save impact report
        const result = await saveImpactReport(reportData);
        res.json({ success: true, id: result.id });
    } catch (error) {
        console.error('Error saving impact report:', error);
        res.status(500).json({ error: 'Unable to save impact report.' });
    }
});

// API endpoint to get recent impact reports
app.get('/api/impact/recent', async (req, res) => {
    try {
        const reports = await getAllImpactReports();
        res.json(reports);
    } catch (error) {
        console.error('Error fetching impact reports:', error);
        res.status(500).json({ error: 'Unable to fetch impact reports.' });
    }
});

// API endpoint to get impact reports by zipcode
app.get('/api/impact/:zipcode', async (req, res) => {
    const { zipcode } = req.params;
    
    try {
        const reports = await getImpactReportsByZipcode(zipcode);
        res.json(reports);
    } catch (error) {
        console.error('Error fetching zipcode impact reports:', error);
        res.status(500).json({ error: 'Unable to fetch impact reports for this zipcode.' });
    }
});

// Analytics API endpoints
app.get('/api/analytics/summary', async (req, res) => {
    try {
        const stats = await DataAnalyzer.generateSummaryStats();
        const summary = {
            totalSearches: stats.totalSearches.count,
            totalReports: stats.totalReports.count,
            avgSeverity: stats.avgSeverity.avg,
            uniqueLocations: stats.uniqueLocations.count
        };
        res.json(summary);
    } catch (error) {
        console.error('Error generating summary stats:', error);
        res.status(500).json({ error: 'Unable to generate summary statistics.' });
    }
});

app.post('/api/analytics/recommendations', async (req, res) => {
    try {
        const { weatherCondition, temperature } = req.body;
        const recommendations = await DataAnalyzer.getActivityRecommendations(weatherCondition, temperature);
        res.json(recommendations);
    } catch (error) {
        console.error('Error getting recommendations:', error);
        res.status(500).json({ error: 'Unable to generate recommendations.' });
    }
});

app.get('/api/analytics/trends', async (req, res) => {
    try {
        const trends = await DataAnalyzer.calculateImpactTrends();
        res.json(trends);
    } catch (error) {
        console.error('Error calculating trends:', error);
        res.status(500).json({ error: 'Unable to calculate trends.' });
    }
});

app.get('/api/analytics/most-impacted', async (req, res) => {
    try {
        const activities = await DataAnalyzer.getMostImpactedActivities();
        res.json(activities);
    } catch (error) {
        console.error('Error getting most impacted activities:', error);
        res.status(500).json({ error: 'Unable to get most impacted activities.' });
    }
});

// Start server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;