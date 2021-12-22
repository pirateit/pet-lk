import * as redis from 'redis';
import { promisify } from 'util';

// Redis for session storage and SMS codes
export const redisClient = redis.createClient({ legacyMode: true });
export const setAsync = promisify(redisClient.set).bind(redisClient);
export const getAsync = promisify(redisClient.get).bind(redisClient);
redisClient.on('connect', () => console.log('Redis client connected to server.'));
redisClient.on('ready', () => console.log('Redis server is ready.'));
redisClient.on('error', err => console.error('Redis error', err));
redisClient.connect();
