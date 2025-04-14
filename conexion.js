// conexion.js
const mysql = require('mysql2');

const database = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'sakila',
    port: '3308',
});

database.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to sakila database!');
    logTable(); // Log initial table state
});

// Helper function to log the usuarios table
function logTable() {
    database.query('SELECT * FROM usuarios', (err, results) => {
        if (err) {
            console.error('Error executing table query:', err);
            return;
        }
        console.log('Datos de la tabla usuarios:');
        console.table(results);
    });
}

function getUsuarios(callback) {
    database.query('SELECT * FROM usuarios', (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            callback(err, null);
            return;
        }
        callback(null, results);
    });
}

function createUsuario(usuario, callback) {
    const query = 'INSERT INTO usuarios (Nombre, carrera, semestre) VALUES (?, ?, ?)';
    database.query(query, [usuario.Nombre, usuario.carrera, usuario.semestre], (err, results) => {
        if (err) {
            console.error('Error creating user:', err);
            callback(err, null);
            return;
        }
        logTable(); // Refresh table after creating
        callback(null, results);
    });
}

function updateUsuario(id, usuario, callback) {
    const query = 'UPDATE usuarios SET Nombre = ?, carrera = ?, semestre = ? WHERE id = ?';
    database.query(query, [usuario.Nombre, usuario.carrera, usuario.semestre, id], (err, results) => {
        if (err) {
            console.error('Error updating user:', err);
            callback(err, null);
            return;
        }
        if (results.affectedRows > 0) logTable(); // Refresh table after updating
        callback(null, results);
    });
}

function patchUsuario(id, campos, callback) {
    const query = 'UPDATE usuarios SET ? WHERE id = ?';
    database.query(query, [campos, id], (err, results) => {
        if (err) {
            console.error('Error patching user:', err);
            callback(err, null);
            return;
        }
        if (results.affectedRows > 0) logTable(); // Refresh table after patching
        callback(null, results);
    });
}

function deleteUsuario(id, callback) {
    const query = 'DELETE FROM usuarios WHERE id = ?';
    database.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error deleting user:', err);
            callback(err, null);
            return;
        }
        if (results.affectedRows > 0) logTable(); // Refresh table after deleting
        callback(null, results);
    });
}

module.exports = { getUsuarios, createUsuario, updateUsuario, patchUsuario, deleteUsuario };