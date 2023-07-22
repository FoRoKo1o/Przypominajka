const Database = require("@replit/database");
const db = new Database();

const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.SECRET_KEY;

const loginHandler = async (req, res) => {
  const { username, password } = req.body;

  // Pobierz dane logowania z bazy danych
  try {
    const userData = await db.get(username);
    if (userData && userData.password === password) {
      // Dane logowania są poprawne - wygeneruj token JWT
      const token = jwt.sign({ username: userData.username }, secretKey, { expiresIn: '1h' });
      res.redirect(`/secret.html?token=${token}`);
    } else {
      // Błędne dane logowania
      res.send('Błędne dane logowania.');
    }
  } catch (error) {
    // W przypadku błędu, np. brak danych użytkownika w bazie danych
    console.error('Błąd weryfikacji danych logowania:', error);
    res.send('Błędne dane logowania.');
  }
};

// Pozostała część kodu auth.js pozostaje bez zmian
const requireLogin = (req, res, next) => {
  // ...
};

module.exports = {
  loginHandler,
  requireLogin,
};
