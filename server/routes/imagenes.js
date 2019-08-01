const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const { verificarUrlToken } = require('../middlewares/auth');

app.get('/imagen/:tipo/:img', verificarUrlToken,(req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;
    let imgPath = path.resolve(__dirname ,`../../uploads/${tipo}/${img}`);
    
    if(fs.existsSync(imgPath)) {
        res.sendFile(imgPath);
    } else {
        let noImgPath = path.resolve(__dirname,'../assets/no-image.jpg');
        res.sendFile(noImgPath);
    }

});

module.exports = app;