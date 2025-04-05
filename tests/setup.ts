import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongod: MongoMemoryServer;

// Increase timeout for all tests
jest.setTimeout(30000);

beforeAll(async () => {
  // Set test environment
  process.env.NODE_ENV = "test";
  process.env.JWT_SECRET = "test-secret";

  // Create a new MongoDB memory server instance
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  // Close any existing connections
  await mongoose.disconnect();

  // Connect to the memory server
  await mongoose.connect(uri);
});

afterAll(async () => {
  // Close the mongoose connection
  await mongoose.disconnect();

  // Stop the MongoDB memory server
  await mongod.stop();
});

afterEach(async () => {
  // Clear all collections after each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});
