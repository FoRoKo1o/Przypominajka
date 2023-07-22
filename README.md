# Przypominajka
This is a Node.js application that provides login and registration features with the ability to add reminders to a list and send them as Windows notifications to the respective user.

## Dependencies
The application uses the following Node.js modules:

- Express: A web framework for Node.js to handle HTTP requests and responses.
- JWT: A library to generate and verify JSON Web Tokens for authentication.
- @replit/database: A key-value store for storing user data during registration.

- ## Features

- User Registration: New users can create an account by providing a username and password.
- User Login: Existing users can log in with their credentials.
- JWT Authentication: The application uses JSON Web Tokens for secure authentication and authorization.
- Access Control: Certain routes and pages are protected and can only be accessed by authenticated users with valid tokens.
- Reminder List: Authenticated users can add reminders to their list.
- Windows Notifications: The application sends reminders as Windows notifications to the respective user.
