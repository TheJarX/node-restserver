const express = require('express');

const bcrypt = require('bcrypt');
const saltRounds = 12;

const _ = require('underscore');

const app = express();

const Usuario = require('../models/usuario');
const { verificarToken, verificarAdminRole } = require('../middlewares/auth');


app.get('/usuario', verificarToken, async function(req, res) {

    let from =  req.query.from || 0;

    let limit = req.query.limit || 5;

    let count = await Usuario.countDocuments({estado: true}, (err, total) => {

        if(err) return 0;

        return Number( total );

    }) || 0;

    //Podemos agregar un segundo argumento al find(), este argumento es un String
    //con el nombre de los campos que queremos traer separados por un espacio
    // Usuarios.find( {}, 'nombre email' );
    Usuario.find( {estado: true} )
            .skip( Number(from) )
            .limit( Number(limit) )
            .exec( (err, users) => {

                if(err) res.status(400).send(
                    {
                        ok:false,
                        err
                    }
                );

                res.json({
                    ok: true,
                    users,
                    count
                });

            });
    
});

app.post('/usuario', [verificarToken, verificarAdminRole], function(req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, saltRounds ),
        role: body.role
    });
    usuario.save(  (err, usuarioDb) =>{

        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }

        res.json({
            ok:true,
            usuarioDb
        });

    });


    

});


app.put('/usuario/:id', [verificarToken, verificarAdminRole], function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre','email','imagen','role','estado']);  


    console.log('update');

    Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true},(err, usuarioDb)=>{

        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }

        res.json({
                ok:true,
                usuario: usuarioDb
            });
    });

   
});

app.delete('/usuario/:id?', [verificarToken, verificarAdminRole], function(req, res) {
   
    let id= req.params.id;

    let setFalse = {estado:false};

    if(id){

        Usuario.findByIdAndUpdate(id,setFalse,{new: true}, (err, usuario) => {

            if(err) return res.status(400).json({
                ok:false,
                err
            });
            
            res.json({
                ok:true,
                usuario
            });

            ;

        });

        // Usuario.findByIdAndRemove(id, (err, usuario) => {

        //     if(err) return res.status(400).json({
        //         ok: false,
        //         msg:'Ha ocurrido un error'
        //     });

            // if(!usuario) return res.status(400).json({
            //     ok: false,
            //     msg:'Este usuario no existe'
            // });

        //     res.json({
        //         ok:true,
        //         usuario
        //     }); 

        // });

    }else{
        res.json({
            ok:false,
            msg:'El id no se ha introducio o es invalido'
        });

    }

});

module.exports = app;