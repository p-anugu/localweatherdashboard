const request = require('supertest');
const express = require('express');
const { createMockAxios } = require('../mocks/weatherApiMock');

// Mock the database module
jest.mock('../../database', () => ({
    saveWeatherData: jest.fn().mockResolvedValue({ id: 1 }),
    getRecentSearches: jest.fn().mockResolvedValue([]),
    getSearchesByZipcode: jest.fn().mockResolvedValue([]),
    saveImpactReport: jest.fn().mockResolvedValue({ id: 1 }),
    getImpactReportsByZipcode: jest.fn().mockResolvedValue([]),
    getAllImpactReports: jest.fn().mockResolvedValue([])
}));

// Mock the data analyzer
jest.mock('../../dataAnalyzer', () => ({
    generateSummaryStats: jest.fn().mockResolvedValue({
        totalSearches: { count: 100 },
        totalReports: { count: 50 },
        avgSeverity: { avg: 2.5 },
        uniqueLocations: { count: 10 }
    }),
    getActivityRecommendations: jest.fn().mockResolvedValue([]),
    calculateImpactTrends: jest.fn().mockResolvedValue([]),
    getMostImpactedActivities: jest.fn().mockResolvedValue([])
}));

// Mock axios
jest.mock('axios');
const axios = require('axios');

describe('API Endpoints', () => {
    let app;
    
    beforeEach(() => {
        // Clear all mocks
        jest.clearAllMocks();
        
        // Set up mock axios
        const mockAxios = createMockAxios();
        axios.get = mockAxios.get;
        
        // Set up test environment
        process.env.WEATHERAPI_KEY = 'test_api_key';
        
        // Require server after mocks are set up
        delete require.cache[require.resolve('../../server')];
        app = require('../../server');
    });
    
    describe('GET /api/weather/:zipcode', () => {
        test('should return weather data for valid zipcode', async () => {
            const response = await request(app)
                .get('/api/weather/10001')
                .expect(200);
            
            expect(response.body).toHaveProperty('location');
            expect(response.body).toHaveProperty('temperature');
            expect(response.body).toHaveProperty('feelsLike');
            expect(response.body).toHaveProperty('description');
        });
        
        test('should return 400 for invalid zipcode format', async () => {
            const response = await request(app)
                .get('/api/weather/123')
                .expect(400);
            
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toContain('Invalid zip code format');
        });
        
        test('should return 404 for non-existent zipcode', async () => {
            const response = await request(app)
                .get('/api/weather/99999')
                .expect(404);
            
            expect(response.body).toHaveProperty('error');
        });
    });
    
    describe('GET /api/weather/history/recent', () => {
        test('should return recent weather searches', async () => {
            const mockSearches = [
                { id: 1, zipcode: '10001', location: 'New York, NY' },
                { id: 2, zipcode: '90210', location: 'Beverly Hills, CA' }
            ];
            
            require('../../database').getRecentSearches.mockResolvedValue(mockSearches);
            
            const response = await request(app)
                .get('/api/weather/history/recent')
                .expect(200);
            
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body).toHaveLength(2);
        });
    });
    
    describe('POST /api/impact/report', () => {
        test('should save impact report successfully', async () => {
            const reportData = {
                zipcode: '10001',
                location: 'New York, NY',
                weatherCondition: 'clear',
                activityType: 'outdoor_sports',
                impactSeverity: 2,
                impactDescription: 'Great weather for running'
            };
            
            const response = await request(app)
                .post('/api/impact/report')
                .send(reportData)
                .expect(200);
            
            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('id');
        });
        
        test('should return 400 for missing required fields', async () => {
            const incompleteData = {
                zipcode: '10001',
                activityType: 'outdoor_sports'
                // Missing other required fields
            };
            
            const response = await request(app)
                .post('/api/impact/report')
                .send(incompleteData)
                .expect(400);
            
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toContain('Missing required fields');
        });
    });
    
    describe('GET /api/analytics/summary', () => {
        test('should return summary statistics', async () => {
            const response = await request(app)
                .get('/api/analytics/summary')
                .expect(200);
            
            expect(response.body).toHaveProperty('totalSearches', 100);
            expect(response.body).toHaveProperty('totalReports', 50);
            expect(response.body).toHaveProperty('avgSeverity', 2.5);
            expect(response.body).toHaveProperty('uniqueLocations', 10);
        });
    });
    
    describe('POST /api/analytics/recommendations', () => {
        test('should return activity recommendations', async () => {
            const mockRecommendations = [
                {
                    activity: 'outdoor sports',
                    severity: 2,
                    status: 'Good',
                    message: 'Generally favorable conditions'
                }
            ];
            
            require('../../dataAnalyzer').getActivityRecommendations
                .mockResolvedValue(mockRecommendations);
            
            const response = await request(app)
                .post('/api/analytics/recommendations')
                .send({
                    weatherCondition: 'clear',
                    temperature: 72
                })
                .expect(200);
            
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body).toHaveLength(1);
            expect(response.body[0]).toHaveProperty('activity');
            expect(response.body[0]).toHaveProperty('status');
        });
    });
});