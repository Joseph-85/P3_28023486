const { Sequelize, DataTypes } = require('sequelize');
// Configuración de la base de datos SQLite
// Desactivar logging para evitar que Sequelize imprima consultas en la consola
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite', // Nombre del archivo de la base de datos
    logging: false
});

// Definición del modelo User
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

// No ejecutar sequelize.sync() aquí: mejor hacerlo al arrancar la app
// Exportamos tanto el objeto `sequelize` como el modelo `User` para control desde el entrypoint
module.exports = { sequelize, User };
