export function validateTaskInput(request, response, next) {
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
    return response.status(400).json({
      error: "Validation failed.",
      details: [...new Map(details.map((detail) => [detail.field, detail])).values()],
    });
  }
  return next();
}
