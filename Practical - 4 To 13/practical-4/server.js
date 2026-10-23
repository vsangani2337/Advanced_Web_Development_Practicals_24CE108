import express from "express";

const app = express();
const port = Number(process.env.PORT || 5000);
let nextId = 3;
const tasks = [
  { id: 1, title: "Learn Express", description: "Build a REST API", completed: false },
  { id: 2, title: "Test endpoints", description: "Check each HTTP method", completed: false },
];

app.use((request, _response, next) => {
  console.log(`${request.method} ${request.originalUrl} ${new Date().toISOString()}`);
  next();
});
app.use(express.json());

function validateTask(request, response, next) {
  const { title, description, completed } = request.body || {};
  const details = [];

  if (request.method === "POST" && (typeof title !== "string" || !title.trim())) {
    details.push({ field: "title", message: "Task title is required." });
  }
  if (title !== undefined && (typeof title !== "string" || !title.trim())) {
    details.push({ field: "title", message: "Task title must be a non-empty string." });
  }
  if (description !== undefined && typeof description !== "string") {
    details.push({ field: "description", message: "Description must be a string." });
  }
  if (completed !== undefined && typeof completed !== "boolean") {
    details.push({ field: "completed", message: "Completed must be a boolean." });
  }

  if (details.length > 0) {
    return response.status(400).json({ error: "Validation failed.", details });
  }
  return next();
}

app.get("/tasks", (_request, response) => response.status(200).json(tasks));

app.get("/tasks/:id", (request, response) => {
  const task = tasks.find((item) => item.id === Number(request.params.id));
  if (!task) return response.status(404).json({ message: "Task not found." });
  return response.status(200).json(task);
});

app.post("/tasks", validateTask, (request, response) => {
  const task = {
    id: nextId++,
    title: request.body.title.trim(),
    description: request.body.description?.trim() || "",
    completed: request.body.completed ?? false,
  };
  tasks.push(task);
  return response.status(201).json(task);
});

app.put("/tasks/:id", validateTask, (request, response) => {
  const task = tasks.find((item) => item.id === Number(request.params.id));
  if (!task) return response.status(404).json({ message: "Task not found." });
  Object.assign(task, request.body, {
    ...(request.body.title === undefined ? {} : { title: request.body.title.trim() }),
    ...(request.body.description === undefined ? {} : { description: request.body.description.trim() }),
  });
  return response.status(200).json(task);
});

app.delete("/tasks/:id", (request, response) => {
  const taskIndex = tasks.findIndex((item) => item.id === Number(request.params.id));
  if (taskIndex === -1) return response.status(404).json({ message: "Task not found." });
  const [deletedTask] = tasks.splice(taskIndex, 1);
  return response.status(200).json(deletedTask);
});

app.use((_request, response) => response.status(404).json({ message: "Route not found." }));

app.use((error, _request, response, _next) => {
  console.error("[server] request failed", error);
  return response.status(500).json({ error: "Something went wrong." });
});

app.listen(port, () => console.log(`Practical 4 API listening on http://localhost:${port}`));
