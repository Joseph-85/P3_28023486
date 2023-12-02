const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbname = path.join(__dirname,'../db','DB.db');
const db = new sqlite3.Database(dbname,{verbose:true,charset:'utf8'},err=>{
  if(err) return console.error(err.message);
  console.log('Conexion Exitosa con la Base de Datos')
});



function filtrar(req,res){

    const busqueda = req.body.busqueda;
    console.log(busqueda,"dato filtrar----");
    
    const sql = `SELECT productos.*, imagenes.url
    FROM productos
    LEFT JOIN imagenes ON productos.producto_id = imagenes.productoID WHERE nombre = ? OR descripcion = ? OR categoria_id = ? OR sexo = ? OR empresa = ?`;
    
    db.all(sql,[busqueda,busqueda,busqueda,busqueda,busqueda],(err,rows)=>{
      console.log(rows,'base de datos desde la peticion del cliente');
    
      if(err){
         console.error(err.message);
          res.status(500).send('Error en el servidor');
          return;
      }
    
     res.json({producto:rows});
    })  
      
    }
    
    function filtrar2(req,res){
    
    const busqueda = req.query.busqueda;
    
    const sql = `SELECT productos.*, imagenes.url
    FROM productos
    LEFT JOIN imagenes ON productos.producto_id = imagenes.productoID WHERE nombre = ? OR descripcion = ? OR categoria_id = ? OR sexo = ? OR empresa = ?`;
    
    db.all(sql,[busqueda,busqueda,busqueda,busqueda,busqueda],(err,rows)=>{
      console.log(rows,'base de datos');
    
      if(err){
         console.error(err.message);
          res.status(500).send('Error en el servidor');
          return;
      }
    
     res.json({producto:rows})
    
    })  
      
    }
  
    function ClientesGET(req,res){
    
      const sql =`SELECT p.*, i.url AS imagen_url
                 FROM productos p
                 LEFT JOIN imagenes i ON p.producto_id = i.productoID
                 WHERE i.destacado = 1
                 GROUP BY p.producto_id`;
    
      db.all(sql,[],(err, rowsProduct) => {
        console.log(rowsProduct,'....+..+....');
      
           if (err){
          console.error(err.message);
          res.status(500).send('Error en el servidor');
          return;
        } 
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
    
          res.render('clientes.ejs',{
            producto:rowsProduct
          });
          
    
    
        });
    
    }
    
    function detalles(req,res){
      const id = req.params.id;
      const sql = `SELECT url FROM imagenes WHERE productoID = ?`;
      db.all(sql,[id],(err,rowsImagenes)=>{
        console.log(rowsImagenes);
         if (err){
          console.error(err.message);
          res.status(500).send('Error en el servidor');
          return;
        } 
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
    
          res.render('detalles.ejs',{
            imagenes:rowsImagenes
          });
    
      });
    }
    function deleteCategoriaGET(req,res){
    const id = req.params.id;
    const sql = ` DELETE FROM categorias WHERE id = ?`;
     db.run(sql, [id], err => {
        if (err) {
          res.status(500).send({ error: err.message });
          return console.error(err.message);
        }
        console.log('Categoria eliminada');
        res.redirect('/categorias');
      });
    }
  
  module.exports = { 
    filtrar,
    filtrar2,
    ClientesGET,
    detalles,
    deleteCategoriaGET
  }