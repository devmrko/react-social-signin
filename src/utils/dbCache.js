import { cacheDBResult, getCachedDBResult } from './redisClient';
import { fetchData } from '../components/ApiService';

export const fetchWithCache = async (endpoint, params, cacheType) => {
  try {
    // Create cache parameters with type
    const cacheParams = { 
      type: cacheType,
      ...params 
    };

    // Try to get from cache first
    const cachedResult = await getCachedDBResult(cacheParams);
    if (cachedResult) {
      console.log(`Cache hit for ${cacheType}:`, params);
      return cachedResult;
    }

    // If not in cache, fetch from DB
    console.log(`Cache miss for ${cacheType}, fetching from DB:`, params);
    const result = await fetchData(endpoint, params);

    // Cache the DB result if it's valid
    if (result && (Array.isArray(result) ? result.length > 0 : true)) {
      await cacheDBResult(cacheParams, result);
      console.log(`Cached ${cacheType} result:`, params);
    }

    return result;
  } catch (error) {
    console.error(`Error in fetchWithCache for ${cacheType}:`, error);
    throw error;
  }
}; 