# Local Weather Dashboard

## This is the Local Weather Dashboard created by Preetham Anugu

A simple web application that displays current weather information based on user-provided zip codes. This project is Assignment 2 of 3 for the course project.

## Features

- Clean, user-friendly interface
- Real-time weather data from OpenWeatherMap API
- Displays temperature, weather conditions, and "feels like" temperature
- Mobile-responsive design
- Error handling for invalid zip codes and API failures

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Node.js with Express.js
- **API**: WeatherAPI (free tier available)
- **Deployment**: Heroku with GitHub integration

## Local Development Setup

1. Clone the repository:
   ```bash
   git clone [your-repo-url]
   cd local-weather-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your WeatherAPI key:
   ```
   WEATHERAPI_KEY=your_weatherapi_key_here
   ```

4. Run the application:
   ```bash
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Environment Variables

- `WEATHERAPI_KEY`: Your WeatherAPI key (required)
- `PORT`: Server port (optional, defaults to 3000)

## Deployment to Heroku

1. Create a new Heroku app
2. Connect the app to your GitHub repository
3. Enable automatic deployments from the main branch
4. Set the `WEATHERAPI_KEY` config variable in Heroku Settings
5. Deploy the application

## API Key Setup

1. Sign up for a free account at [WeatherAPI](https://www.weatherapi.com/)
2. Generate an API key from your dashboard (free tier includes 1M calls/month)
3. Add the API key to your environment variables as shown above

## Live Demo

[Add your Heroku app URL here after deployment]

## Project Structure

```
local-weather-dashboard/
├── public/              # Static frontend files
│   ├── index.html      # Main HTML page
│   ├── style.css       # Styling
│   └── script.js       # Client-side JavaScript
├── server.js           # Express server
├── package.json        # Dependencies
├── Procfile           # Heroku configuration
├── .gitignore         # Git ignore file
├── CLAUDE.md          # Claude Code instructions
└── README.md          # This file
```
