const checkAuth = (req, res, next) => {
  // Miejsce na  logikę sprawdzającą poprawność tokenu JWT 
  // poprawność sprawdzana w nagłówku Authorization

  const token = req.headers.authorization;

  if (!token) {
    // Jeśli brak tokenu - zwróć błąd "Unauthorized"
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Miejsce na przeprowadzenie dalszej weryfikacji tokenu

  // Jeśli autoryzacja jest pomyślna, przechodzimy do kolejnego middleware 
  next();
};

module.exports = {
  checkAuth
};
