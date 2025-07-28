# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Local Weather Dashboard application (Assignment 2 of 3) that allows users to check current weather conditions by entering a zip code. The application uses the WeatherAPI service to fetch weather data and displays it in a clean, user-friendly interface.

## Tech Stack

- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Backend**: Node.js with Express.js
- **API**: WeatherAPI (free tier available with 1M calls/month)
- **Deployment**: Heroku with GitHub integration

## Common Development Commands

```bash
# Install dependencies
npm install

# Run the development server
npm start
# or
npm run dev

# The server runs on port 3000 locally (or process.env.PORT in production)
```

## Project Structure

```
local-weather-dashboard/
├── package.json          # Node.js dependencies and scripts
├── server.js            # Express server with weather API endpoint
├── .gitignore          # Git ignore file (includes .env, node_modules)
├── README.md           # Project documentation
├── Procfile            # Heroku deployment configuration
├── CLAUDE.md           # This file
└── public/             # Static frontend files
    ├── index.html      # Main HTML page with weather form
    ├── style.css       # Styling for the application
    └── script.js       # Client-side JavaScript for API calls
```

## Architecture Overview

1. **Server Architecture (server.js)**:
   - Express server serving static files from `/public`
   - API endpoint: `GET /api/weather/:zipcode`
   - Fetches weather data from WeatherAPI using the provided zip code
   - Returns weather data as JSON
   - Uses environment variable `WEATHERAPI_KEY` for API authentication

2. **Client Architecture**:
   - **index.html**: Simple form with zip code input and results display area
   - **script.js**: Handles form submission, makes fetch requests to the server API, and displays weather data
   - **style.css**: Provides responsive, weather-themed styling

3. **API Integration**:
   - WeatherAPI endpoint: `https://api.weatherapi.com/v1/current.json`
   - Supports direct zip code queries
   - Weather data includes: location name, temperature, weather description, "feels like" temperature

## Environment Setup

For local development, create a `.env` file:
```
WEATHERAPI_KEY=your_weatherapi_key_here
```

For Heroku deployment, set the config variable in the Heroku dashboard.

## Key Implementation Notes

- The application focuses on US zip codes (5-digit format)
- Error handling is implemented for invalid zip codes and API failures
- The design is mobile-friendly and uses a weather-appropriate color scheme
- WeatherAPI offers a free tier with 1 million API calls per month
- The API key must never be committed to the repository
- This is Assignment 2 - database storage and impact reporting features will be added in future assignments