const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');
const saltRounds = 12;
const _ = require('underscore');
const Usuario = require('../models/usuario');
const app = express();
// El CLIENT_ID es el id de cliente que te proporciona Google
const client = new OAuth2Client(process.env.CLIENT_ID);



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

// Configuraciones de Google
// Recuerda que una funcion async regresa siempre un Promise
async function verify( token ) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
    
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}


app.post('/google', async (req, res) => {

    let token = req.body.token;

    let googleUser = await verify(token)
    .catch(err => {
        return res.status(403).json({
            ok: false,
            err
        });
    });

    Usuario.findOne({email: googleUser.email}, (err, usuarioDb ) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(usuarioDb) {
            if(!usuarioDb.google) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        msg: "Parece que ya te has registrado antes"
                    }
                });
            } else  {

                let token = jwt.sign({
                    usuario: usuarioDb
                }, process.env.TOKEN_SEED, {expiresIn: process.env.EXPIRES_TOKEN});

                return res.json({
                    ok: true,
                    usuario: usuarioDb,
                    token
                });

            }

        } else { 
            // Si el usuario no existe en nuestra DB
            let usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':D';

            usuario.save( (err, usuarioDb) => {
                
                if(err){
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                let token = jwt.sign({
                    usuario: usuarioDb
                }, process.env.TOKEN_SEED, {expiresIn: process.env.EXPIRES_TOKEN});

                return res.json({
                    ok: true,
                    usuario: usuarioDb,
                    token
                });


            });

        }


    });

})


module.exports = app;