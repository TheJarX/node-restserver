const express = require('express');
const app = express();
const { verificarToken } = require('../middlewares/auth');
const Producto = require('../models/producto');



/**
 * Crear un producto
 */

 app.post('/producto', verificarToken, (req, res) => {

    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precio,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: body.usuario
    });

    producto.save((err, productoDb) => {

        if(err) {
            return res.status(500).json({
                    ok:false,
                    err
            });
        }

        if(!productoDb) {

            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            productoDb
        });

    });


 });

/**
 * Obtener todos los productos
 */

 app.get('/producto', verificarToken, (req, res) => {

    let from =  req.query.from || 0;

    let limit = req.query.limit || 5;

    Producto.find({disponible: true})
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .sort('nombre')
        .skip(Number(from))
        .limit(Number(limit))
        .exec((err, productos) => {

            if(err) {
                return res.status(500).json({
                    ok:false,
                    err
                });
            }


            res.json({
                ok: true,
                productos
            })


        });

});

/**
 * Obtener un producto por id
 */

 app.get('/producto/:id', verificarToken,(req, res) => {

    let id = req.params.id;

    Producto.findById(id, (err, productoDb) => {

        if(err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoDb) {
            return res.status(400).json({
                ok: false,
                err: {
                    msg: 'Id no existente'
                }
            });                
        }

        res.json({
            ok: true,
            producto: productoDb
        });

    });

 });


 app.get('/producto/search/:query', verificarToken, (req, res) => {


        let query  = req.params.query;
        let rex = new RegExp(query, 'i');
        Producto.find({nombre : rex})
            .populate('categoria', 'nombre')
            .exec((err, productos) => {

                if(err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    productos
                });

            });

 });

 /**
  * Actualizar un producto
  */

app.put('/producto/:id', verificarToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Producto.findByIdAndUpdate(id, body,{new:true,runValidators:true},(err, productoDb) => {

        if(err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoDb) {
            return res.status(400).json({
                ok: false,
                err: {
                    msg: 'Id no existente'
                }
            });                
        }

        res.json({
            ok: true,
            producto: productoDb
        });

    });

});


/**
 * Eliminar un producto
 */

 app.delete('/producto/:id', (req, res) => {

    let id = req.params.id;

    Producto.findByIdAndUpdate(id,{disponible: false}, (err, productoDb) => {

        if(err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoDb) {
            return res.status(400).json({
                ok: false,
                err: {
                    msg: 'Id no existente'
                }
            });                
        }

        res.json({
            ok: true,
            msg: 'Producto eliminado!'
        });


    });

 });


module.exports = app;