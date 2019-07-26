require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// Para habilitar la carpeta public
// path.resolve() convierte sus argumentos en una ruta
// Lo que hizo es una especie de merge con las coincidencias entre las 2 rutas
// dirname: .../server y ../public: .../public; reemplazando server por public
app.use(express.static(path.resolve(__dirname, '../public')));

// parse application/json
app.use(bodyParser.json())

// Configuracion de rutas
app.use( require('./routes/index') );




mongoose.connect(process.env.URLDB,{useNewUrlParser: true}, (err, res)=>{

    if(err) throw err;

    console.log('DB ONLINE');

});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});