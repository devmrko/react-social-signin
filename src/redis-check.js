const testRedisConnection = async () => {
  const REDIS_HOST = '152.70.236.77';
  const REDIS_PORT = 6379;
  const REDIS_PASSWORD = 'oracle';
  const AUTH_HEADER = `Basic ${Buffer.from(`:${REDIS_PASSWORD}`).toString('base64')}`;

  // Test 1: Basic connection
  try {
    const response = await fetch(`http://${REDIS_HOST}:${REDIS_PORT}/ping`, {
      headers: {
        'Authorization': AUTH_HEADER
      }
    });
    console.log('Connection test:', response.ok ? 'SUCCESS' : 'FAILED');
    if (!response.ok) {
      console.error('Connection response:', await response.text());
    }
  } catch (error) {
    console.error('Connection test failed:', error.message);
  }

  // Test 2: Set cache
  try {
    const response = await fetch(`http://${REDIS_HOST}:${REDIS_PORT}/cache`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': AUTH_HEADER
      },
      body: JSON.stringify({
        key: 'test_key',
        value: 'test_value',
        expirationInSeconds: 60
      })
    });
    console.log('Cache SET test:', response.ok ? 'SUCCESS' : 'FAILED');
    if (!response.ok) {
      console.error('Cache SET response:', await response.text());
    }
  } catch (error) {
    console.error('Cache SET test failed:', error.message);
  }

  // Test 3: Get cache
  try {
    const response = await fetch(`http://${REDIS_HOST}:${REDIS_PORT}/cache/test_key`, {
      headers: {
        'Authorization': AUTH_HEADER
      }
    });
    console.log('Cache GET test:', response.ok ? 'SUCCESS' : 'FAILED');
    if (response.ok) {
      const data = await response.json();
      console.log('Retrieved value:', data);
    } else {
      console.error('Cache GET response:', await response.text());
    }
  } catch (error) {
    console.error('Cache GET test failed:', error.message);
  }
};

testRedisConnection(); 