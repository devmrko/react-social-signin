const { createClient } = require('redis');

// Configure Redis client
const client = createClient({
    socket: {
        host: '152.70.236.77',
        port: 6379, // Default Redis port
    },
    password: 'oracle',
});

// Handle connection events
client.on('connect', () => {
    console.log('Connected to Redis');
});

client.on('error', (err) => {
    console.error('Redis connection error:', err);
});

// Connect to Redis and test a command
(async () => {
    try {
        await client.connect();

        // Example: Set and Get a key
        await client.set('test-key', 'Hello, Redis!');
        const value = await client.get('test-key');
        console.log('Retrieved value:', value);

        // Disconnect
        await client.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
})();
