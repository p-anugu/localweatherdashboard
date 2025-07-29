const { 
    saveWeatherData, 
    getRecentSearches, 
    getSearchesByZipcode,
    saveImpactReport,
    getImpactReportsByZipcode,
    getAllImpactReports
} = require('../../database');

describe('Database Functions', () => {
    
    describe('saveWeatherData', () => {
        test('should save weather data successfully', async () => {
            const weatherData = {
                location: 'Test City, NY',
                temperature: 72,
                feelsLike: 70,
                description: 'clear sky'
            };
            
            const result = await saveWeatherData('10001', weatherData);
            expect(result).toHaveProperty('id');
            expect(typeof result.id).toBe('number');
        });

        test('should handle missing data gracefully', async () => {
            const incompleteData = {
                location: 'Test City',
                temperature: 72
                // Missing feelsLike and description
            };
            
            await expect(saveWeatherData('10001', incompleteData))
                .rejects.toThrow();
        });
    });

    describe('getRecentSearches', () => {
        test('should return array of recent searches', async () => {
            const searches = await getRecentSearches();
            expect(Array.isArray(searches)).toBe(true);
            
            if (searches.length > 0) {
                expect(searches[0]).toHaveProperty('id');
                expect(searches[0]).toHaveProperty('zipcode');
                expect(searches[0]).toHaveProperty('location');
                expect(searches[0]).toHaveProperty('temperature');
            }
        });

        test('should respect limit parameter', async () => {
            const searches = await getRecentSearches(5);
            expect(searches.length).toBeLessThanOrEqual(5);
        });
    });

    describe('getSearchesByZipcode', () => {
        test('should return searches for specific zipcode', async () => {
            const zipcode = '10001';
            const searches = await getSearchesByZipcode(zipcode);
            
            expect(Array.isArray(searches)).toBe(true);
            searches.forEach(search => {
                expect(search.zipcode).toBe(zipcode);
            });
        });
    });

    describe('saveImpactReport', () => {
        test('should save impact report successfully', async () => {
            const reportData = {
                zipcode: '10001',
                location: 'New York, NY',
                weatherCondition: 'clear sky',
                activityType: 'outdoor_sports',
                impactSeverity: 2,
                impactDescription: 'Great weather for outdoor activities',
                userName: 'Test User'
            };
            
            const result = await saveImpactReport(reportData);
            expect(result).toHaveProperty('id');
            expect(typeof result.id).toBe('number');
        });

        test('should handle anonymous users', async () => {
            const reportData = {
                zipcode: '10001',
                location: 'New York, NY',
                weatherCondition: 'rain',
                activityType: 'commute',
                impactSeverity: 4,
                impactDescription: 'Heavy traffic due to rain'
                // No userName provided
            };
            
            const result = await saveImpactReport(reportData);
            expect(result).toHaveProperty('id');
        });

        test('should validate impact severity range', async () => {
            const reportData = {
                zipcode: '10001',
                location: 'New York, NY',
                weatherCondition: 'snow',
                activityType: 'work',
                impactSeverity: 6, // Invalid: should be 1-5
                impactDescription: 'Office closed due to snow'
            };
            
            await expect(saveImpactReport(reportData))
                .rejects.toThrow();
        });
    });

    describe('getImpactReportsByZipcode', () => {
        test('should return impact reports for specific zipcode', async () => {
            const zipcode = '10001';
            const reports = await getImpactReportsByZipcode(zipcode);
            
            expect(Array.isArray(reports)).toBe(true);
            reports.forEach(report => {
                expect(report.zipcode).toBe(zipcode);
            });
        });
    });

    describe('getAllImpactReports', () => {
        test('should return array of impact reports', async () => {
            const reports = await getAllImpactReports();
            expect(Array.isArray(reports)).toBe(true);
            
            if (reports.length > 0) {
                expect(reports[0]).toHaveProperty('id');
                expect(reports[0]).toHaveProperty('zipcode');
                expect(reports[0]).toHaveProperty('activity_type');
                expect(reports[0]).toHaveProperty('impact_severity');
            }
        });

        test('should respect limit parameter', async () => {
            const reports = await getAllImpactReports(10);
            expect(reports.length).toBeLessThanOrEqual(10);
        });
    });
});