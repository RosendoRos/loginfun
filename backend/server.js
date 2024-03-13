const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Tu contraseña de MySQL
  database: 'usuarios'
});

connection.connect(err => {
  if (err) {
    console.error('Error de conexión: ', err);
    return;
  }
  console.log('Conexión a la base de datos establecida');
});

// Ruta para registrar un usuario
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  connection.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (error, results, fields) => {
    if (error) {
      console.error('Error al registrar usuario: ', error);
      res.status(500).json({ message: 'Error al registrar usuario' });
      return;
    }
    res.status(200).json({ message: 'Usuario registrado exitosamente' });
  });
});

// Ruta para iniciar sesión
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (error, results, fields) => {
    if (error) {
      console.error('Error al iniciar sesión: ', error);
      res.status(500).json({ message: 'Error al iniciar sesión' });
      return;
    }
    if (results.length === 0) {
      res.status(401).json({ message: 'Credenciales inválidas' });
      return;
    }
    res.status(200).json({ message: 'Inicio de sesión exitoso' });
  });
});

// Ruta para obtener todos los usuarios
app.get('/users', (req, res) => {
  connection.query('SELECT * FROM users', (error, results, fields) => {
    if (error) {
      console.error('Error al obtener usuarios: ', error);
      res.status(500).json({ message: 'Error al obtener usuarios' });
      return;
    }
    res.status(200).json(results); // Envía la lista de usuarios como respuesta
  });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
