const REDIS_HOST = process.env.REACT_APP_REDIS_HOST;
const REDIS_PORT = process.env.REACT_APP_REDIS_PORT;
const REDIS_PASSWORD = process.env.REACT_APP_REDIS_PASSWORD;

// Create a reusable headers object
const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Basic ${btoa(`:${REDIS_PASSWORD}`)}`
});

export const cacheDBResult = async (params, data) => {
    const cacheKey = generateCacheKey(params);
    
    try {
        const response = await fetch(`http://${REDIS_HOST}:${REDIS_PORT}/cache`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({
                key: cacheKey,
                value: JSON.stringify(data),
                expirationInSeconds: 3600 // 1 hour cache
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Cache error response:', errorData);
            throw new Error('Failed to cache DB result');
        }

        console.log('Successfully cached DB result for:', cacheKey);
        return true;
    } catch (error) {
        console.error('Redis caching error:', error);
        return false;
    }
};

export const getCachedDBResult = async (params) => {
    const cacheKey = generateCacheKey(params);
    
    try {
        const response = await fetch(`http://${REDIS_HOST}:${REDIS_PORT}/cache/${cacheKey}`, {
            headers: getHeaders()
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Cache error response:', errorData);
            return null;
        }

        const data = await response.json();
        if (data) {
            console.log('Cache hit for:', cacheKey);
            return JSON.parse(data);
        }

        console.log('Cache miss for:', cacheKey);
        return null;
    } catch (error) {
        console.error('Redis fetch error:', error);
        return null;
    }
};

// Helper function to generate consistent cache keys
function generateCacheKey(params) {
    const sortedParams = Object.keys(params)
        .sort()
        .reduce((acc, key) => {
            acc[key] = params[key];
            return acc;
        }, {});
    
    return `db_query_${JSON.stringify(sortedParams)}`;
} 