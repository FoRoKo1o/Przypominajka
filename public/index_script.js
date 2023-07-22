const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.SECRET_KEY;

document.getElementById('loginForm').addEventListener('submit', (event) => {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Wysyłamy dane logowania do serwera w celu weryfikacji
  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // Weryfikacja powiodła się - przekieruj na stronę /secret.html
        window.location.href = `/secret.html?token=${data.token}`;
      } else {
        // Weryfikacja nie powiodła się - wyświetl powiadomienie o błędzie na stronie logowania
        const errorMessage = document.getElementById('errorMessage');
        errorMessage.style.display = 'block';
        errorMessage.textContent = data.message;
      }
    })
    .catch((error) => {
      console.error('Błąd weryfikacji danych logowania:', error);
      const errorMessage = document.getElementById('errorMessage');
      errorMessage.style.display = 'block';
      errorMessage.textContent = 'Wystąpił błąd podczas weryfikacji danych logowania.';
    });
});

// Funkcja do generowania tokenu JWT
function generateToken(username) {
  const token = jwt.sign({ username: username }, secretKey, { expiresIn: '1h' });
  return token;
}
