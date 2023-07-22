const token = new URLSearchParams(window.location.search).get('token');

if (token) {
  // Ukryj zawartość strony do momentu weryfikacji tokenu
  document.getElementById('loader').style.display = 'block';
  document.getElementById('content').style.display = 'none';

  fetch('/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: token }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Response status not OK');
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        console.log('Użytkownik jest zalogowany:', data.username);
        // Pokaż zawartość strony po weryfikacji tokenu
        document.getElementById('loader').style.display = 'none';
        document.getElementById('content').style.display = 'block';

        // Przykładowe operacje lub wyświetlanie danych dla zalogowanego użytkownika
        const welcomeMessage = document.createElement('p');
        welcomeMessage.textContent = `Jesteś zalogowany.`;
        document.getElementById('content').appendChild(welcomeMessage);
      } else {
        console.log('Użytkownik nie jest zalogowany.');
        // Przekierowanie na stronę logowania w przypadku braku autoryzacji
        window.location.href = '/index.html';
      }
    })
    .catch((error) => {
      console.error('Błąd weryfikacji tokena:', error);
      // Przekierowanie na stronę logowania w przypadku błędu weryfikacji tokenu
      window.location.href = '/index.html';
    });
} else {
  // Przekierowanie na stronę logowania, gdy brak tokenu
  window.location.href = '/index.html';
}
