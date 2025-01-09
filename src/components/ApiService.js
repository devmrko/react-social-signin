// const { createClient } = require('redis');
// const Redis = require('ioredis');


const BASE_URL = process.env.REACT_APP_API_BASE_URL;

// const client = createClient({
//     socket: {
//         host: '152.70.236.77',
//         port: 6379, // Default Redis port
//     },
//     password: 'oracle',
// });

// Redis cache helper functions
// const generateCacheKey = (endpoint, params = {}) => {
//   const queryString = new URLSearchParams(params).toString();
//   return `api:${endpoint}${queryString ? `:${queryString}` : ''}`;
// };

// const getFromCache = async (key) => {
//   try {
//     await client.connect();
//     const value = await client.get(key);
//     await client.disconnect(); 
//     return value;
//   } catch (error) {
//     console.warn('Cache retrieval failed:', error);
//     return null;
//   }
// };

// const setToCache = async (key, data, ttl = 3600) => {
//   try {
//     await client.connect();
//     await client.set(key, data);
//     await client.disconnect();
//   } catch (error) {
//     console.warn('Cache setting failed:', error);
//   }
// };

export const fetchData = async (endpoint, params = {}) => {
//   const cacheKey = generateCacheKey(endpoint, params);
  
  // Try to get from cache first
//   const cachedData = await getFromCache(cacheKey);
//   if (cachedData) {
//     console.log('Cache hit:', cacheKey);
//     return cachedData;
//   }

  // If not in cache, fetch from API
  const queryString = new URLSearchParams(params).toString();
  const url = `${BASE_URL}${endpoint}${queryString ? `?${queryString}` : ''}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    
    // Store in cache
    // await setToCache(cacheKey, data);
    
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
  
export const postData = async (endpoint, body) => {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

export const fetchYears = async () => {
//   const cacheKey = generateCacheKey('/year');
  
  // Try to get from cache first
//   const cachedData = await getFromCache(cacheKey);
//   if (cachedData) {
//     console.log('Cache hit: years');
//     return cachedData;
//   }

  try {
    const response = await fetch(`${BASE_URL}/year`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    
    // Store in cache
    // await setToCache(cacheKey, data);
    
    return data;
  } catch (error) {
    console.error('Error fetching years:', error);
    throw error;
  }
};