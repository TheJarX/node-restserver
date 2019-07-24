const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 12;
const _ = require('underscore');
const Usuario = require('../models/usuario');
const app = express();


app.post('/login',(req, res) => {

    let body = req.body;

    Usuario.findOne({email: body.email}, (err, usuarioDb) => {

        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if(!usuarioDb){
            return res.status(400).json({
               ok:false,
               err:{
                   message: "-Usuario o clave incorrectas!"
               }
            });
        }

        if( !bcrypt.compareSync(body.password, usuarioDb.password) ){
            return  res.json({
                ok:false,
               err:{
                   message: "Usuario o -clave incorrectas!"
               }
            })
        }

        // En expiresIn viene lo siquiente, ms*min*hrs*days 
        let token = jwt.sign({
            usuario: usuarioDb,
        }, process.env.TOKEN_SEED, { expiresIn: process.env.EXPIRES_TOKEN });

        res.json({
                ok:true,
                msg:usuarioDb,
                token
            });


    });

    
});


module.exports = app;