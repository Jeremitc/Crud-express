// server.js
const express = require('express');
const { getUsuarios, createUsuario, updateUsuario, patchUsuario, deleteUsuario } = require('./conexion.js');
const app = express();
const port = 3000;

// Middleware para servir archivos estáticos y parsear JSON
app.use(express.static('public'));
app.use(express.json());

// GET: Obtener todos los usuarios
app.get('/api/usuarios', (req, res) => {
    getUsuarios((err, results) => {
        if (err) {
            console.error('GET /api/usuarios error:', err);
            return res.status(500).json({ error: 'Error al obtener los datos' });
        }
        console.log(`GET: Obtenidos ${results.length} usuarios`);
        res.json(results);
    });
});

// POST: Crear un nuevo usuario
app.post('/api/usuarios', (req, res) => {
    const usuario = req.body;
    // Validar datos de entrada
    if (!usuario.Nombre || !usuario.carrera || !usuario.semestre) {
        console.log('POST: Error - Faltan campos requeridos');
        return res.status(400).json({ error: 'Faltan campos requeridos: Nombre, carrera, semestre' });
    }
    createUsuario(usuario, (err, results) => {
        if (err) {
            console.error('POST /api/usuarios error:', err);
            return res.status(500).json({ error: 'Error al crear el usuario' });
        }
        console.log(`POST: Usuario creado - Nombre: ${usuario.Nombre}, Carrera: ${usuario.carrera}, Semestre: ${usuario.semestre}, ID: ${results.insertId}`);
        res.status(201).json({ message: 'Usuario creado', id: results.insertId });
    });
});

// PUT: Actualizar un usuario completo por ID
app.put('/api/usuarios/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const usuario = req.body;
    // Validar datos de entrada
    if (!usuario.Nombre || !usuario.carrera || !usuario.semestre) {
        console.log(`PUT: Error - Faltan campos requeridos para ID ${id}`);
        return res.status(400).json({ error: 'Faltan campos requeridos: Nombre, carrera, semestre' });
    }
    updateUsuario(id, usuario, (err, results) => {
        if (err) {
            console.error('PUT /api/usuarios error:', err);
            return res.status(500).json({ error: 'Error al actualizar el usuario' });
        }
        if (results.affectedRows === 0) {
            console.log(`PUT: Error - Usuario con ID ${id} no encontrado`);
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        console.log(`PUT: Usuario actualizado - ID: ${id}, Nombre: ${usuario.Nombre}, Carrera: ${usuario.carrera}, Semestre: ${usuario.semestre}`);
        res.json({ message: 'Usuario actualizado' });
    });
});

// PATCH: Actualizar parcialmente un usuario por ID
app.patch('/api/usuarios/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const campos = req.body;
    // Validar que al menos un campo esté presente
    if (Object.keys(campos).length === 0) {
        console.log(`PATCH: Error - No se proporcionaron campos para ID ${id}`);
        return res.status(400).json({ error: 'Se requiere al menos un campo para actualizar' });
    }
    patchUsuario(id, campos, (err, results) => {
        if (err) {
            console.error('PATCH /api/usuarios error:', err);
            return res.status(500).json({ error: 'Error al actualizar el usuario' });
        }
        if (results.affectedRows === 0) {
            console.log(`PATCH: Error - Usuario con ID ${id} no encontrado`);
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        console.log(`PATCH: Usuario actualizado parcialmente - ID: ${id}, Campos: ${JSON.stringify(campos)}`);
        res.json({ message: 'Usuario actualizado parcialmente' });
    });
});

// DELETE: Eliminar un usuario por ID
app.delete('/api/usuarios/:id', (req, res) => {
    const id = parseInt(req.params.id);
    deleteUsuario(id, (err, results) => {
        if (err) {
            console.error('DELETE /api/usuarios error:', err);
            return res.status(500).json({ error: 'Error al eliminar el usuario' });
        }
        if (results.affectedRows === 0) {
            console.log(`DELETE: Error - Usuario con ID ${id} no encontrado`);
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        console.log(`DELETE: Usuario eliminado - ID: ${id}`);
        res.json({ message: 'Usuario eliminado' });
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});