/**
 * Mock Weather API responses for testing
 */

const mockWeatherResponses = {
    '10001': {
        location: {
            name: 'New York',
            region: 'New York'
        },
        current: {
            temp_f: 72,
            feelslike_f: 70,
            condition: {
                text: 'Clear',
                icon: '//cdn.weatherapi.com/weather/64x64/day/113.png'
            }
        }
    },
    '90210': {
        location: {
            name: 'Beverly Hills',
            region: 'California'
        },
        current: {
            temp_f: 85,
            feelslike_f: 87,
            condition: {
                text: 'Sunny',
                icon: '//cdn.weatherapi.com/weather/64x64/day/113.png'
            }
        }
    },
    '60601': {
        location: {
            name: 'Chicago',
            region: 'Illinois'
        },
        current: {
            temp_f: 45,
            feelslike_f: 38,
            condition: {
                text: 'Rainy',
                icon: '//cdn.weatherapi.com/weather/64x64/day/296.png'
            }
        }
    }
};

// Mock axios for weather API calls
const createMockAxios = () => {
    return {
        get: jest.fn((url) => {
            // Extract zipcode from URL
            const zipcodeMatch = url.match(/q=(\d{5})/);
            
            if (!zipcodeMatch) {
                return Promise.reject(new Error('Invalid URL format'));
            }
            
            const zipcode = zipcodeMatch[1];
            const mockData = mockWeatherResponses[zipcode];
            
            if (!mockData) {
                return Promise.reject({
                    response: {
                        status: 400,
                        data: { error: { message: 'No matching location found.' } }
                    }
                });
            }
            
            return Promise.resolve({
                data: mockData,
                status: 200
            });
        })
    };
};

// Mock weather data generator for testing
const generateMockWeatherData = (overrides = {}) => {
    return {
        location: 'Test City, TS',
        temperature: 72,
        feelsLike: 70,
        description: 'partly cloudy',
        icon: '//cdn.weatherapi.com/weather/64x64/day/116.png',
        ...overrides
    };
};

// Mock impact report generator
const generateMockImpactReport = (overrides = {}) => {
    return {
        id: Math.floor(Math.random() * 1000),
        zipcode: '10001',
        location: 'New York, NY',
        weather_condition: 'clear',
        activity_type: 'outdoor_sports',
        impact_severity: 2,
        impact_description: 'Perfect weather for running',
        user_name: 'Test User',
        report_timestamp: new Date().toISOString(),
        ...overrides
    };
};

module.exports = {
    mockWeatherResponses,
    createMockAxios,
    generateMockWeatherData,
    generateMockImpactReport
};