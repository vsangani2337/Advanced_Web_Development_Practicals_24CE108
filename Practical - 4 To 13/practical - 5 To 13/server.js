import "dotenv/config";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import cors from "cors";
import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "./models/User.js";
import taskRoutes from "./routes/taskRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import { requireAuth } from "./middleware/auth.js";
import "./listeners.js";

const app = express();
const port = Number(process.env.PORT || 5000);
const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/taskdb";
const jwtSecret = process.env.JWT_SECRET || "supersecretjwtkey_practical_charusat_24ce108";
const allowedOrigins = new Set(["http://localhost:5173", "http://127.0.0.1:5173"]);

// Request logger
app.use((request, _response, next) => {
  console.log(`${request.method} ${request.originalUrl} ${new Date().toISOString()}`);
  next();
});

// CORS
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin)) return callback(null, true);
    return callback(new Error("Origin is not allowed by the task API."));
  },
  credentials: true,
}));

app.use(express.json());

// API health and metadata
app.get("/", (_request, response) => response.status(200).json({
  message: "Task API is running.",
  endpoints: ["/health", "/register", "/login", "/me", "/tasks"],
}));

app.get("/health", (_request, response) => response.status(200).json({ message: "Task API is running." }));

// POST /register - Register user
app.post("/register", async (request, response, next) => {
  try {
    const { email, password } = request.body || {};
    console.log("[auth] register request", { email });

    if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
      return response.status(400).json({
        error: "Validation failed.",
        details: [{ field: "email/password", message: "Email and password are required." }],
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return response.status(409).json({ message: "An account with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email: normalizedEmail, password: hashedPassword });
    console.log("[auth] register success", { email: user.email });
    return response.status(201).json({ id: user._id, email: user.email });
  } catch (error) {
    if (error.name === "ValidationError") {
      return response.status(400).json({
        error: "Validation failed.",
        details: Object.values(error.errors).map((e) => ({ field: e.path, message: e.message })),
      });
    }
    return next(error);
  }
});

// POST /login - User login & JWT issuance
app.post("/login", async (request, response, next) => {
  try {
    const { email, password } = request.body || {};
    console.log("[auth] login request", { email });

    if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
      return response.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");
    if (!user) {
      return response.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return response.status(401).json({ message: "Invalid email or password." });
    }

    if (!jwtSecret) {
      return next(new Error("JWT_SECRET is not configured."));
    }

    const token = jwt.sign({ id: user._id.toString(), email: user.email }, jwtSecret, {
      expiresIn: "1h",
    });

    console.log("[auth] login success", { email: user.email });
    return response.status(200).json({ token, user: { id: user._id, email: user.email } });
  } catch (error) {
    return next(error);
  }
});

// GET /me - Authenticated user info
app.get("/me", requireAuth, async (request, response, next) => {
  try {
    const user = await User.findById(request.user.id);
    if (!user) {
      return response.status(404).json({ message: "User not found." });
    }
    return response.status(200).json({ id: user._id, email: user.email });
  } catch (error) {
    return next(error);
  }
});

// Protected Task and AI Routes
app.use("/tasks", taskRoutes);
app.use("/api/ai", aiRoutes);

// 404 handler
app.use((_request, response) => response.status(404).json({ message: "Route not found." }));

// Global error handler
app.use((error, _request, response, _next) => {
  console.error("[server] request failed", error);
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return response.status(400).json({ error: "Validation failed.", message: "Request body must be valid JSON." });
  }
  if (error.message === "Origin is not allowed by the task API.") {
    return response.status(403).json({ message: error.message });
  }
  if (error.name === "ValidationError") {
    return response.status(400).json({
      error: "Validation failed.",
      details: Object.values(error.errors).map(({ path, message }) => ({ field: path, message })),
    });
  }
  if (error.name === "CastError") return response.status(404).json({ message: "Resource not found." });
  if (error.code === 11000) return response.status(409).json({ message: "Duplicate key error." });
  return response.status(500).json({ error: error.message || "Something went wrong." });
});

export async function startServer() {
  if (!mongoUri || !jwtSecret) {
    throw new Error("MONGO_URI and JWT_SECRET must be configured.");
  }
  console.log("[server] Connecting to MongoDB...");
  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
  console.log("MongoDB connected");
  return app.listen(port, () => console.log(`Task API listening on http://localhost:${port}`));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  startServer().catch((error) => {
    console.error("Unable to start server:", error.message);
    process.exitCode = 1;
  });
}

export { app };
