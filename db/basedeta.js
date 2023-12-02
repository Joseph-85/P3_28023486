const sqlite3 = require ('sqlite3').verbose();
const path = require ('path');

const fs = require('fs');



//Conection Data Base
const db_name = path.join(__dirname, '../db/DB.db');
const db = new sqlite3.Database(db_name, err =>{
    if (err) { 
        console.error(err.message);
    }else {
        console.log('conexion a la Base de Datos Exitosa!!!');
    }
});

db.serialize(() =>{
const sql_create="CREATE TABLE categorias ( id INTEGER PRIMARY KEY  AUTOINCREMENT, nombre varchar (10) NOT NULL);";
db.run(sql_create, err =>{
  if (err) {
    console.error (err.message);
  } else {
    console.log("Anexada de la tabla categorias exitosa!!!");
  }
})
const sql_create2="CREATE TABLE productos ( id INTEGER PRIMARY KEY AUTOINCREMENT, nombre varchar (10) NOT NULL, precio double NOT NULL, codigo int NOT NULL UNIQUE, descripcion varchar (50) NULL DEFAULT 'Sin descripcion', empresa varchar (15) NOT NULL, sexo TEXT NOT NULL, categoria_id int, FOREIGN KEY (categoria_id) REFERENCES categorias (id));";
db.run(sql_create2, err =>{

  if (err) {
    console.error (err.message);
  } else {
    console.log("Anexada de la tabla productos exitosa!!!");
  }
})
const sql_create3="CREATE TABLE imagenes ( id INTEGER PRIMARY KEY AUTOINCREMENT, url varchar (200) NOT NULL, destacado VARCHAR (20) NOT NULL, producto_id INT, FOREIGN KEY (producto_id) REFERENCES productos (id));";
db.run(sql_create3, err =>{
  if (err) {
    console.error (err.message);
  } else {
    console.log("Anexada de la tabla imagenes exitosa!!!");
  }
});
})




 module.exports = db;

 
