import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASS,
});

export default redis;
