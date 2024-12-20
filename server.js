const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Servidor funcionando correctamente');
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

// Configuración de la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Beto',
    database: 'apuestasloterias'
});

db.connect((err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err);
    } else {
        console.log('Conectado a la base de datos');
    }
});

// Ruta para registrar usuarios
app.post('/register', (req, res) => {
    const { nombre, apellidos, cedula, fechaNacimiento, telefono, email, contrasena } = req.body;

    const query = `INSERT INTO usuarios (nombres, apellidos, cedula, fechaNacimiento, telefono, email, contrasena) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const values = [nombre, apellidos, cedula, fechaNacimiento, telefono, email, contrasena];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error al registrar usuario:', err);
            res.status(500).json({ error: 'Error al registrar el usuario' });
        } else {
            res.json({ message: 'Usuario registrado exitosamente' });
        }
    });
});

// Ruta para iniciar sesión
app.post('/login', (req, res) => {
    const { usuario, contrasena } = req.body;

    const query = `SELECT * FROM usuarios WHERE email = ? AND contrasena = ?`;
    const values = [usuario, contrasena];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error en el inicio de sesión:', err);
            res.status(500).json({ error: 'Error en el inicio de sesión' });
        } else if (result.length === 0) {
            res.status(401).json({ error: 'Credenciales incorrectas' });
        } else {
            res.json({ message: 'Inicio de sesión exitoso', user: result[0] });
        }
    });
});
