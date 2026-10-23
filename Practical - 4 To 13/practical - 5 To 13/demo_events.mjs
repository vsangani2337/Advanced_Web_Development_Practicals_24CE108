import "dotenv/config";
import mongoose from "mongoose";
import Task from "./models/Task.js";
import cache from "./cache.js";
import "./listeners.js";
import taskEvents from "./events.js";

const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/taskmanager-pr10";

console.log("[Demo] Connecting to MongoDB...");
try {
  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
} catch (err) {
  console.log(`[Demo] MongoDB local connection optional for offline test. (${err.message})`);
}

const fakeUserId = new mongoose.Types.ObjectId();
const task = {
  _id: new mongoose.Types.ObjectId(),
  title: "EventEmitter Asynchronous Processing Demo Task",
  description: "Demonstrates background notification without blocking API response",
  completed: false,
  userId: fakeUserId,
};

const cacheKey = `tasks:${fakeUserId}`;
cache.del(cacheKey);
console.log(`[cache] INVALIDATED: '${cacheKey}' cache cleared after POST`);

// Step 1: Log response timestamp BEFORE sending HTTP 201 response
console.log(`[API] Response being sent at ${new Date().toISOString()} for task "${task.title}"`);
console.log("[API] HTTP 201 response dispatched to client immediately (non-blocking).");

// Step 2: Emit background event AFTER client response is sent
taskEvents.emit("task-created", task, { email: "student@charusat.edu.in", id: fakeUserId });
console.log("[API] emit() returned. API handler exited. Background worker fires in ~1500ms...");

// Wait for the background listener's setTimeout to fire (1500ms)
setTimeout(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.disconnect();
  }
  console.log("[Demo] EventEmitter lifecycle completed successfully.");
  process.exit(0);
}, 2500);
