const checkAuth = (req, res, next) => {
  // Miejsce na  logikę sprawdzającą poprawność tokenu JWT 
  // poprawność sprawdzana w nagłówku Authorization

  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Sprawdź poprawność tokenu JWT
  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Jeśli autoryzacja jest pomyślna, przechodzimy do kolejnego middleware
    next();
  });
};

module.exports = {
  checkAuth
};
