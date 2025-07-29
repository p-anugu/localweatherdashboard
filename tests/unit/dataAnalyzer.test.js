const DataAnalyzer = require('../../dataAnalyzer');

describe('DataAnalyzer', () => {
    
    describe('analyzeWeatherPatterns', () => {
        test('should analyze weather patterns for a zipcode', async () => {
            const zipcode = '10001';
            const patterns = await DataAnalyzer.analyzeWeatherPatterns(zipcode);
            
            expect(Array.isArray(patterns)).toBe(true);
            
            if (patterns.length > 0) {
                expect(patterns[0]).toHaveProperty('avg_temp');
                expect(patterns[0]).toHaveProperty('min_temp');
                expect(patterns[0]).toHaveProperty('max_temp');
                expect(patterns[0]).toHaveProperty('description');
            }
        });
    });

    describe('analyzeImpactByActivity', () => {
        test('should analyze impact by activity type', async () => {
            const analysis = await DataAnalyzer.analyzeImpactByActivity();
            
            expect(Array.isArray(analysis)).toBe(true);
            
            if (analysis.length > 0) {
                expect(analysis[0]).toHaveProperty('activity_type');
                expect(analysis[0]).toHaveProperty('avg_severity');
                expect(analysis[0]).toHaveProperty('report_count');
            }
        });

        test('should filter by zipcode when provided', async () => {
            const zipcode = '10001';
            const analysis = await DataAnalyzer.analyzeImpactByActivity(zipcode);
            
            expect(Array.isArray(analysis)).toBe(true);
        });
    });

    describe('getActivityRecommendations', () => {
        test('should return activity recommendations', async () => {
            const weatherCondition = 'clear sky';
            const temperature = 72;
            
            const recommendations = await DataAnalyzer.getActivityRecommendations(
                weatherCondition, 
                temperature
            );
            
            expect(Array.isArray(recommendations)).toBe(true);
            
            recommendations.forEach(rec => {
                expect(rec).toHaveProperty('activity');
                expect(rec).toHaveProperty('severity');
                expect(rec).toHaveProperty('status');
                expect(rec).toHaveProperty('message');
                expect(['Excellent', 'Good', 'Caution', 'Not Recommended'])
                    .toContain(rec.status);
            });
        });
    });

    describe('calculateImpactTrends', () => {
        test('should calculate impact trends for default period', async () => {
            const trends = await DataAnalyzer.calculateImpactTrends();
            
            expect(Array.isArray(trends)).toBe(true);
            
            if (trends.length > 0) {
                expect(trends[0]).toHaveProperty('report_date');
                expect(trends[0]).toHaveProperty('avg_severity');
                expect(trends[0]).toHaveProperty('report_count');
            }
        });

        test('should calculate trends for custom period', async () => {
            const trends = await DataAnalyzer.calculateImpactTrends(30);
            
            expect(Array.isArray(trends)).toBe(true);
        });
    });

    describe('getMostImpactedActivities', () => {
        test('should return most impacted activities', async () => {
            const activities = await DataAnalyzer.getMostImpactedActivities();
            
            expect(Array.isArray(activities)).toBe(true);
            expect(activities.length).toBeLessThanOrEqual(10);
            
            if (activities.length > 0) {
                expect(activities[0]).toHaveProperty('activity_type');
                expect(activities[0]).toHaveProperty('weather_condition');
                expect(activities[0]).toHaveProperty('avg_severity');
                expect(activities[0]).toHaveProperty('report_count');
            }
        });
    });

    describe('generateSummaryStats', () => {
        test('should generate summary statistics', async () => {
            const stats = await DataAnalyzer.generateSummaryStats();
            
            expect(stats).toHaveProperty('totalSearches');
            expect(stats).toHaveProperty('totalReports');
            expect(stats).toHaveProperty('avgSeverity');
            expect(stats).toHaveProperty('uniqueLocations');
            
            expect(stats.totalSearches).toHaveProperty('count');
            expect(stats.totalReports).toHaveProperty('count');
            expect(stats.uniqueLocations).toHaveProperty('count');
        });
    });
});