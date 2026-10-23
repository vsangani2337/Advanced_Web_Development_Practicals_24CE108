// Global error handler - turns Mongoose ValidationErrors (and everything else)
// into a clean, structured JSON response instead of leaking raw error objects.
function errorHandler(err, req, res, next) {
  console.error(err.stack);

  // Mongoose validation error -> 400 with field-level messages
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: 'Validation failed', details: messages });
  }

  // Invalid ObjectId format -> 400
  if (err.name === 'CastError') {
    return res.status(400).json({ error: `Invalid id format: ${err.value}` });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ error: err.message || 'Something went wrong' });
}

function notFoundHandler(req, res) {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
}

module.exports = { errorHandler, notFoundHandler };
