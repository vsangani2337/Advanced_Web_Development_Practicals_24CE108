// Server-side input validation - runs before requests reach the controller,
// even though the frontend may validate the same fields.

function validateRegisterInput(req, res, next) {
  const { email, password } = req.body || {};
  const errors = [];

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    errors.push('A valid email is required');
  }
  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }
  next();
}

function validateLoginInput(req, res, next) {
  const { email, password } = req.body || {};
  const errors = [];

  if (!email) errors.push('email is required');
  if (!password) errors.push('password is required');

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }
  next();
}

function validateTaskInput(req, res, next) {
  const { title } = req.body || {};
  const errors = [];

  // Only require title on create (POST); PUT may send partial updates
  if (req.method === 'POST' && (!title || !title.trim())) {
    errors.push('title is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }
  next();
}

module.exports = { validateRegisterInput, validateLoginInput, validateTaskInput };
