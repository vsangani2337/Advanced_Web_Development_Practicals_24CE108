import { Router } from "express";
import Task from "../models/Task.js";
import { requireAuth } from "../middleware/auth.js";
import { validateTaskInput } from "../middleware/validateTask.js";
import cache from "../cache.js";
import taskEvents from "../events.js";

const router = Router();
router.use(requireAuth);

function getTasksCacheKey(userId) {
  return `tasks:${userId}`;
}

// GET /tasks/cache/stats - Supplementary endpoint to inspect cache health
router.get("/cache/stats", (_request, response) => {
  return response.status(200).json({
    stats: cache.getStats(),
    keysCount: cache.keys().length,
    keys: cache.keys(),
  });
});

// GET /tasks - Fetch tasks with in-memory caching (60s TTL)
router.get("/", async (request, response, next) => {
  try {
    const cacheKey = getTasksCacheKey(request.user.id);
    const cachedTasks = cache.get(cacheKey);

    if (cachedTasks) {
      console.log(`[cache] HIT: Serving tasks from memory cache (${cacheKey})`);
      return response.status(200).json(cachedTasks);
    }

    console.log(`[cache] MISS: Querying MongoDB for tasks (${cacheKey})`);
    const tasks = await Task.find({ userId: request.user.id })
      .sort({ createdAt: -1 })
      .lean();

    cache.set(cacheKey, tasks);
    return response.status(200).json(tasks);
  } catch (error) {
    return next(error);
  }
});

// POST /tasks - Create task & invalidate cache
router.post("/", validateTaskInput, async (request, response, next) => {
  try {
    const { title, description, completed } = request.body;
    const task = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : "",
      completed: Boolean(completed),
      userId: request.user.id,
    });

    const cacheKey = getTasksCacheKey(request.user.id);
    cache.del(cacheKey);
    console.log(`[cache] INVALIDATED: '${cacheKey}' cache cleared after POST`);

    // Log response timestamp BEFORE sending response
    console.log(`[API] Response being sent at ${new Date().toISOString()} for task "${task.title}"`);

    // Send HTTP response immediately - client gets this right away
    response.status(201).json(task);

    // Emit event AFTER responding - does NOT block the client
    // EventEmitter.emit() is synchronous but listener uses setTimeout
    // so background work runs asynchronously after client is unblocked
    taskEvents.emit("task-created", task, request.user);
    return;
  } catch (error) {
    return next(error);
  }
});

// PUT /tasks/:id - Update task & invalidate cache
router.put("/:id", validateTaskInput, async (request, response, next) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: request.params.id, userId: request.user.id },
      request.body,
      { new: true, runValidators: true }
    );
    if (!task) {
      return response.status(404).json({ message: "Task not found." });
    }

    const cacheKey = getTasksCacheKey(request.user.id);
    cache.del(cacheKey);
    console.log(`[cache] INVALIDATED: '${cacheKey}' cache cleared after PUT`);

    return response.status(200).json(task);
  } catch (error) {
    return next(error);
  }
});

// DELETE /tasks/:id - Delete task & invalidate cache
router.delete("/:id", async (request, response, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: request.params.id,
      userId: request.user.id,
    });
    if (!task) {
      return response.status(404).json({ message: "Task not found." });
    }

    const cacheKey = getTasksCacheKey(request.user.id);
    cache.del(cacheKey);
    console.log(`[cache] INVALIDATED: '${cacheKey}' cache cleared after DELETE`);

    return response.status(200).json({ message: "Task deleted successfully.", id: request.params.id });
  } catch (error) {
    return next(error);
  }
});

export default router;
