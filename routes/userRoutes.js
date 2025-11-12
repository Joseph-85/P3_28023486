const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../models/database');
const express = require('express');

// Use a Router rather than creating a new express app instance
const routerUser = express.Router();
routerUser.use(express.json());

const SECRET_KEY = 'your_secret_key'; // Cambia esto por una clave secreta más segura

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ status: 'fail', message: 'Token requerido' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(401).json({ status: 'fail', message: 'Token inválido' });
        req.user = user;
        next();
    });
};
// Registro del usuario
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName: 
 *                 type: string
 *                 format: text
 *                 example: "" 
 *               email: 
 *                 type: string 
 *                 format: email
 *                 example: ""
 *               password: 
 *                 type: string
 *                 format: password
 *                 example: ""   
 *             required:
 *               - fullName
 *               - email
 *               - password           
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Email ya registrado
 */
routerUser.post('/api/auth/register', async (req, res) => {
    const { fullName, email, password } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ status: 'fail', message: 'Email ya registrado' });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await User.create({ fullName, email, passwordHash });
        res.status(201).json({ status: 'success', data: newUser }); 
});
// Inicio de sesión
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Inicia sesión y devuelve un token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ""
 *               password:
 *                 type: string
 *                 format: password
 *                 example: ""
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       401:
 *         description: Credenciales inválidas
 */
routerUser.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        return res.status(401).json({ status: 'fail', message: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ id: user.id }, SECRET_KEY);
    res.json({ status: 'success', token });
});
// CRUD para usuarios
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestión de usuarios.
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtener una lista de usuarios.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: [] 
 *     responses:
 *       200:
 *         description: Lista de usuarios devuelta exitosamente.
 *       401:
 *         description: Acceso no autorizado, token inválido.
 */
routerUser.get('/api/users', authenticateToken, async (req, res) => {
    try {
        const users = await User.findAll({ attributes: { exclude: ['passwordHash'] } });
        res.status(200).json({ status: 'success', data: users });
    } catch (error) {
        res.status(401).json({ status: 'error', message: 'Error del servidor' });
    }
});
// Crear un nuevo usuario
/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crear un nuevo usuario.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName: 
 *                 type: string
 *                 format: text
 *                 example: "" 
 *               email: 
 *                 type: string 
 *                 format: email
 *                 example: ""
 *               password: 
 *                 type: string
 *                 format: password
 *                 example: ""   
 *             required:
 *               - fullName
 *               - email
 *               - password 
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente.
 *       400:
 *         description: Petición mal formada.
 */
routerUser.post('/api/users', authenticateToken, async (req, res) => {
    const { fullName, email, password } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ status: 'fail', message: 'Email ya registrado' });
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await User.create({ fullName, email, passwordHash });
        res.status(201).json({ status: 'success', data: newUser });
    
});
// Obtener un usuario por ID
/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obtener un usuario por ID.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del usuario a obtener.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario devuelto exitosamente.
 *       404:
 *         description: Usuario no encontrado.
 *       401:
 *         description: Acceso no autorizado, token inválido.
 */
routerUser.get('/api/users/:id', authenticateToken, async (req, res) => {
    try {
    const user = await User.findByPk(req.params.id, { attributes: { exclude: ['passwordHash'] } });
    if (!user) return res.status(404).json({ status: 'fail', message: 'Usuario no encontrado' });
    res.json({ status: 'success', data: user });
    } catch (error) {
        res.status(401).json({ status: 'error', message: 'Error del servidor' });
    }
});
// Actualizar el usuario
/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Actualizar un usuario existente.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del usuario a actualizar.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName: 
 *                 type: string
 *                 format: text
 *                 example: "" 
 *               email: 
 *                 type: string 
 *                 format: email
 *                 example: ""
 *               password: 
 *                 type: string
 *                 format: password
 *                 example: ""   
 *             required:
 *               - fullName
 *               - email
 *               - password 
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente.
 *       404:
 *         description: Usuario no encontrado.
 */
routerUser.put('/api/users/:id', authenticateToken, async (req, res) => {
    const { fullName, email, password } = req.body;

        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ status: 'fail', message: 'Usuario no encontrado' });

        const passwordHash = password ? await bcrypt.hash(password, 10) : user.passwordHash;

        await user.update({ fullName, email, passwordHash });
        res.status(200).json({ status: 'success', data: user });

});
// Eliminar el usuario
/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Eliminar un usuario por ID.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del usuario a eliminar.
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Usuario eliminado exitosamente.
 *       404:
 *         description: Usuario no encontrado.
 */

routerUser.delete('/api/users/:id', authenticateToken, async (req, res) => {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ status: 'fail', message: 'Usuario no encontrado' });

        await user.destroy();
        res.status(204).json({ status: 'success', message: 'Usuario eliminado' });

});
module.exports = routerUser;