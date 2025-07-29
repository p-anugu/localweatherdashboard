const { db } = require('./database');

/**
 * Data Analyzer Component
 * Analyzes weather patterns and impact reports to generate insights
 */

class DataAnalyzer {
    /**
     * Analyze weather patterns for a specific zipcode
     */
    static async analyzeWeatherPatterns(zipcode) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    AVG(temperature) as avg_temp,
                    MIN(temperature) as min_temp,
                    MAX(temperature) as max_temp,
                    COUNT(*) as total_searches,
                    description,
                    COUNT(description) as condition_count
                FROM weather_searches
                WHERE zipcode = ?
                GROUP BY description
                ORDER BY condition_count DESC
            `;
            
            db.all(query, [zipcode], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    /**
     * Analyze impact severity by activity type
     */
    static async analyzeImpactByActivity(zipcode = null) {
        return new Promise((resolve, reject) => {
            let query = `
                SELECT 
                    activity_type,
                    AVG(impact_severity) as avg_severity,
                    COUNT(*) as report_count,
                    weather_condition
                FROM impact_reports
            `;
            
            const params = [];
            if (zipcode) {
                query += ' WHERE zipcode = ?';
                params.push(zipcode);
            }
            
            query += ' GROUP BY activity_type, weather_condition ORDER BY avg_severity DESC';
            
            db.all(query, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    /**
     * Get activity recommendations based on current weather
     */
    static async getActivityRecommendations(weatherCondition, temperature) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    activity_type,
                    AVG(impact_severity) as avg_severity,
                    COUNT(*) as sample_size
                FROM impact_reports
                WHERE weather_condition LIKE ?
                GROUP BY activity_type
                HAVING sample_size >= 2
                ORDER BY avg_severity ASC
            `;
            
            db.all(query, [`%${weatherCondition}%`], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    // Generate recommendations based on impact data
                    const recommendations = rows.map(row => {
                        let recommendation = {
                            activity: row.activity_type.replace(/_/g, ' '),
                            severity: row.avg_severity,
                            sampleSize: row.sample_size
                        };
                        
                        if (row.avg_severity <= 2) {
                            recommendation.status = 'Excellent';
                            recommendation.message = 'Great conditions for this activity';
                        } else if (row.avg_severity <= 3) {
                            recommendation.status = 'Good';
                            recommendation.message = 'Generally favorable conditions';
                        } else if (row.avg_severity <= 4) {
                            recommendation.status = 'Caution';
                            recommendation.message = 'May experience some difficulties';
                        } else {
                            recommendation.status = 'Not Recommended';
                            recommendation.message = 'Poor conditions for this activity';
                        }
                        
                        return recommendation;
                    });
                    
                    resolve(recommendations);
                }
            });
        });
    }

    /**
     * Calculate weather impact trends over time
     */
    static async calculateImpactTrends(days = 7) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    DATE(report_timestamp) as report_date,
                    AVG(impact_severity) as avg_severity,
                    COUNT(*) as report_count,
                    weather_condition
                FROM impact_reports
                WHERE report_timestamp >= datetime('now', '-${days} days')
                GROUP BY report_date, weather_condition
                ORDER BY report_date DESC
            `;
            
            db.all(query, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    /**
     * Get most impacted activities by weather condition
     */
    static async getMostImpactedActivities() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    activity_type,
                    weather_condition,
                    AVG(impact_severity) as avg_severity,
                    COUNT(*) as report_count
                FROM impact_reports
                GROUP BY activity_type, weather_condition
                HAVING report_count >= 3
                ORDER BY avg_severity DESC
                LIMIT 10
            `;
            
            db.all(query, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    /**
     * Generate summary statistics
     */
    static async generateSummaryStats() {
        return new Promise((resolve, reject) => {
            const queries = {
                totalSearches: 'SELECT COUNT(*) as count FROM weather_searches',
                totalReports: 'SELECT COUNT(*) as count FROM impact_reports',
                avgSeverity: 'SELECT AVG(impact_severity) as avg FROM impact_reports',
                uniqueLocations: 'SELECT COUNT(DISTINCT zipcode) as count FROM weather_searches'
            };
            
            const stats = {};
            let completed = 0;
            
            Object.entries(queries).forEach(([key, query]) => {
                db.get(query, [], (err, row) => {
                    if (err) {
                        reject(err);
                    } else {
                        stats[key] = row;
                        completed++;
                        
                        if (completed === Object.keys(queries).length) {
                            resolve(stats);
                        }
                    }
                });
            });
        });
    }
}

module.exports = DataAnalyzer;