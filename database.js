const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database connection
const db = new sqlite3.Database(path.join(__dirname, 'weather.db'));

// Initialize database schema
function initializeDatabase() {
    db.serialize(() => {
        // Create weather_searches table
        db.run(`
            CREATE TABLE IF NOT EXISTS weather_searches (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                zipcode TEXT NOT NULL,
                location TEXT NOT NULL,
                temperature INTEGER NOT NULL,
                feels_like INTEGER NOT NULL,
                description TEXT NOT NULL,
                search_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) {
                console.error('Error creating weather_searches table:', err);
            } else {
                console.log('Weather searches table ready');
            }
        });

        // Create impact_reports table
        db.run(`
            CREATE TABLE IF NOT EXISTS impact_reports (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                zipcode TEXT NOT NULL,
                location TEXT NOT NULL,
                weather_condition TEXT NOT NULL,
                activity_type TEXT NOT NULL,
                impact_severity INTEGER NOT NULL CHECK (impact_severity >= 1 AND impact_severity <= 5),
                impact_description TEXT NOT NULL,
                user_name TEXT,
                report_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) {
                console.error('Error creating impact_reports table:', err);
            } else {
                console.log('Impact reports table ready');
            }
        });
    });
}

// Save weather data to database
function saveWeatherData(zipcode, weatherData) {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO weather_searches (zipcode, location, temperature, feels_like, description)
            VALUES (?, ?, ?, ?, ?)
        `;
        
        db.run(query, [
            zipcode,
            weatherData.location,
            weatherData.temperature,
            weatherData.feelsLike,
            weatherData.description
        ], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve({ id: this.lastID });
            }
        });
    });
}

// Get recent weather searches
function getRecentSearches(limit = 10) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT * FROM weather_searches
            ORDER BY search_timestamp DESC
            LIMIT ?
        `;
        
        db.all(query, [limit], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

// Get weather searches by zipcode
function getSearchesByZipcode(zipcode) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT * FROM weather_searches
            WHERE zipcode = ?
            ORDER BY search_timestamp DESC
        `;
        
        db.all(query, [zipcode], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

// Save impact report to database
function saveImpactReport(reportData) {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO impact_reports (zipcode, location, weather_condition, activity_type, impact_severity, impact_description, user_name)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        db.run(query, [
            reportData.zipcode,
            reportData.location,
            reportData.weatherCondition,
            reportData.activityType,
            reportData.impactSeverity,
            reportData.impactDescription,
            reportData.userName || 'Anonymous'
        ], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve({ id: this.lastID });
            }
        });
    });
}

// Get impact reports by zipcode
function getImpactReportsByZipcode(zipcode) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT * FROM impact_reports
            WHERE zipcode = ?
            ORDER BY report_timestamp DESC
        `;
        
        db.all(query, [zipcode], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

// Get all impact reports
function getAllImpactReports(limit = 20) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT * FROM impact_reports
            ORDER BY report_timestamp DESC
            LIMIT ?
        `;
        
        db.all(query, [limit], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

// Initialize database on module load
initializeDatabase();

module.exports = {
    db,
    saveWeatherData,
    getRecentSearches,
    getSearchesByZipcode,
    saveImpactReport,
    getImpactReportsByZipcode,
    getAllImpactReports
};