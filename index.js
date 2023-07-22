// server.js

const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');
const bodyParser = require('body-parser');
const auth = require('./utils/auth');
const Database = require("@replit/database");
require('dotenv').config();

const app = express();
const port = 3000;
const secretKey = process.env['secretKey']
const db = new Database();

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});


app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Wyszukujemy dane użytkownika w bazie danych
  db.get(username)
    .then(userData => {
      if (userData && userData.password === password) {
        // Dane logowania są poprawne - wygeneruj token JWT i przekieruj na stronę /secret.html
        const token = jwt.sign({ username: userData.username }, secretKey, { expiresIn: '1h' });
        res.redirect(`/secret.html?token=${token}`);
      } else {
        // Weryfikacja nie powiodła się - zwracamy odpowiedź z błędem
        res.status(401).json({ success: false, message: 'Błędne dane logowania.' });
      }
    })
    .catch(error => {
      console.error('Błąd podczas wyszukiwania użytkownika w bazie danych:', error);
      res.status(500).json({ success: false, message: 'Wystąpił błąd podczas logowania.' });
    });
});


app.post('/verify', (req, res) => {
  const token = req.body.token || '';

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      console.error('Błąd weryfikacji tokena:', err);
      return res.json({ success: false });
    }

    console.log('Poprawnie zweryfikowany token:', decoded.username);
    return res.json({ success: true, username: decoded.username });
  });
});

app.get('/secret.html', auth.requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'secret.html'));
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Sprawdź, czy użytkownik o podanej nazwie już istnieje w bazie danych
    const existingUser = await db.get(username);
    if (existingUser) {
      res.send('Użytkownik o tej nazwie już istnieje. Wybierz inną nazwę.');
    } else {
      // Dodaj nowego użytkownika do bazy danych
      await db.set(username, { password });
      // Przekieruj użytkownika na stronę główną po zakończeniu rejestracji
      res.redirect('/index.html');
    }
  } catch (error) {
    console.error('Błąd podczas rejestracji:', error);
    res.send('Wystąpił błąd podczas rejestracji. Spróbuj ponownie później.');
  }
});

app.get('/unauthorized', (req, res) => {
  res.status(403).send('Unauthorized access.');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
