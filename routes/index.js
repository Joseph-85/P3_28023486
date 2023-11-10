require ('dotenv').config();
var express = require('express');
var router = express.Router();

const VJ = require ('../db/base')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Login' });
});

router.post('/login', function(req, res, next){
  const {user, password} = req.body;
  if ((process.env.USER == user) && (process.env.PASSWORD == password)) {
    res.render('admin');
  } else{
    res.render('loginfail', {title: 'Login Fail'});
  }
});

router.get('/home', function(req, res, next){
  res.render('admin');
});

router.get('/productos', function(req, res, next){
  VJ
  .obtenerprd()
  .then(productos =>{
    res.render('productos', {productos: productos});
  })
  .catch(err =>{
    return res.status(500).send("Error buscando producto");
  })
});

router.get('/categorias', function(req, res, next){
  VJ
  .obtenerctg()
  .then(categorias =>{
    res.render('categorias', {categorias: categorias});
  })
  .catch(err =>{
    return res.status(500).send("Error buscando categorias");
  })
});

router.get('/imagenes', function(req, res, next){
  VJ
  .obtenerimg()
  .then(imagenes =>{
    res.render('imagenes', {imagenes: imagenes});
  })
  .catch(err =>{
    return res.status(500).send("Error buscando imagenes");
  })
});




router.get('/catA', function(req, res, next){
  res.render('cat1');
})

router.get('/pA', function(req, res, next){
  VJ
  .obtenerctg()
  .then(categorias=>{
    res.render('prod1', {categorias: categorias});
  })
  .catch(err =>{
    return res.status(500).send("Error a cargar la pagina");
  })
})

router.get('/iA', function(req, res, next){
  VJ
  .obtenerprd()
  .then(productos=>{
    res.render('ima1', {productos: productos});
  })
  .catch(err =>{
    return res.status(500).send("Error a cargar la pagina");
  })
})




router.post('/cat1', function(req, res, next){
  const {nombre} = req.body;
  console.log(nombre);
  VJ
  .insertarctg(nombre)
  .then(idCategoriaInsertado =>{
    res.redirect('/categorias');
  })
  .catch(err =>{
    console.error(err.message);
    return res.status(500).send("Error insertando producto");
  });
})

//agregar producto
router.post('/prod1', function(req, res, next){
  const {nombre, precio, codigo, descripcion, empresa, sexo, categoria_id} = req.body;
  VJ
  .insertarprd(nombre, precio, codigo, descripcion, empresa, sexo, categoria_id)
  .then(idProductoInsertado =>{
    res.redirect('/productos');
  })
  .catch(err =>{
    console.error(err.message);
    return res.status(500).send("Error insertando producto");
  })
});

router.post('/ima1', function(req, res, next){
  const {url, destacado, producto_id} = req.body;
  VJ
  .insertarimg(url, destacado, producto_id)
  .then(idImagenInsertada=>{
    res.redirect('/imagenes');
  })
  .catch(err=>{
    console.error(err.message);
    return res.status(500).send('Error insertando imagen');
  })
});






router.get('/prodAc/:id', function(req,res,next){
  const id=req.params.id;
  VJ
  .obtenerprdPorId(id)
  .then(productos=>{
    res.render('prod2', {productos: productos});
  })
  .catch(err=>{
    console.error(err.message);
    return res.status(500).send('Error buscando el producto')
  })
});

router.get('/catAc/:id', function(req,res,next){
  const id=req.params.id;
  VJ
  .obtenerctgPorId(id)
  .then(categorias=>{
    res.render('cat2', {categorias: categorias});
  })
  .catch(err=>{
    console.error(err.message);
    return res.status(500).send('Error buscando la categoria')
  })
});

router.get('/imAc/:id', function(req,res,next){
  const id=req.params.id;
  VJ
  .obtenerimgPorId(id)
  .then(imagenes=>{
    res.render('ima2', {imagenes: imagenes});
  })
  .catch(err=>{
    console.error(err.message);
    return res.status(500).send('Error buscando la imagen')
  })
});




//Update productos page
router.post('/Actualyprod/:id', function(req, res, nexte){
  const id= req.params.id;
  const {nombre, precio, codigo, descripcion, empresa, sexo} = req.body;
  VJ
  .actualizarprd(nombre, precio, codigo, descripcion, empresa, sexo, id)
  .then(()=>{
    res.redirect('/productos');
  })
  .catch(err =>{
    console.error(err.message);
    res.status(500).send('Error actualizando el producto');
  })
});

//Update categorias page
router.post ('/Actualy/:id', function(req, res, next){
  const id = req.params.id;
  const {nombre} = req.body;
  VJ
  .actualizarctg(nombre, id)
  .then(()=>{
    res.redirect('/categorias');
  })
  .catch(err =>{
    console.error(err.message);
    res.status(500).send('Error actualizando la categoria');
  })
});

//Update imagenes page
router.post('/Actuayimg/:id', function(req, res, next){
  const id = req.params.id;
  const {url, destacado} = req.body;
  VJ
  .actualzarimg(url, destacado, id)
  .then(()=>{
    res.redirect('/imagenes');
  })
  .catch(err =>{
    console.error(err.message);
    res.status(500).send('Error actualizando la imagen');
  })
});

//Get productos page delete
router.get('/prodE/:id', function(req,res,next){
  const id=req.params.id;
  VJ
  .obtenerprdPorId(id)
  .then(productos=>{
    res.render('prod3', {productos: productos});
  })
  .catch(err=>{
    console.error(err.message);
    return res.status(500).send('Error buscando el producto')
  })
});

//Get categorias page delete
router.get('/catE/:id', function(req,res,next){
  const id=req.params.id;
  VJ
  .obtenerctgPorId(id)
  .then(categorias=>{
    res.render('cat3', {categorias: categorias});
  })
  .catch(err=>{
    console.error(err.message);
    return res.status(500).send('Error buscando la categoria')
  })
});

//Get imagenes page delete
router.get('/imE/:id', function(req,res,next){
  const id=req.params.id;
  VJ
  .obtenerimgPorId(id)
  .then(imagenes=>{
    res.render('ima3', {imagenes: imagenes});
  })
  .catch(err=>{
    console.error(err.message);
    return res.status(500).send('Error buscando la imagen')
  })
});

//Delete productos page
router.get('/elimyprod/:id', function(req,res,next){
  const id = req.params.id;
  VJ
  .eliminarprd(id)
  .then(()=>{
    res.redirect('/productos');
  })
  .catch(err=>{
    console.error(err.message);
    return res.status(500).send('Error elimando el producto')
  })
});

//Delete categorias page
router.get('/elimy/:id', function(req,res,next){
  const id = req.params.id;
  VJ
  .eliminarctg(id)
  .then(()=>{
    res.redirect('/categorias');
  })
  .catch(err=>{
    console.error(err.message);
    return res.status(500).send('Error elimando la categoria')
  })
});

//Delete imagenes page
router.get('/elimyimg/:id', function(req,res,next){
  const id = req.params.id;
  VJ
  .eliminarimg(id)
  .then(()=>{
    res.redirect('/imagenes');
  })
  .catch(err=>{
    console.error(err.message);
    return res.status(500).send('Error elimando la imagen')
  })
});


module.exports = router;

