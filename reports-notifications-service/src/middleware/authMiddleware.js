const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      if (process.env.NODE_ENV === 'development') {
        req.token = 'dev-token';
        return next();
      }
      return res.status(401).json({ error: 'Token not provided' });
    }

    // TODO: Validate JWT token with auth-service
    // For now, just pass through
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};

module.exports = authMiddleware;
