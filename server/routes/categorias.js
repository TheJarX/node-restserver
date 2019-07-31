const express = require('express');
let { verificarToken, verificarAdminRole } = require('../middlewares/auth');

let app = express();

let Categoria = require('../models/categoria');





app.get('/categoria', (req, res) => {


    Categoria.find({})
        // Pauta de  ordenamiento
        .sort('descripcion')
        // Es como una relacion, el segundo parametro son los campos que queremos
        .populate('usuario','nombre email')
        .exec((err, categorias) => {

        if(err) {
            return res.status(400).send(
                {
                    ok:false,
                    err
                }
            );
        }

        res.json({
            ok: true,
            categorias
        });

    });

});

/**
 * Crear categoria
 */
app.post('/categoria', verificarToken, (req, res) => {

    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: body.usuario_id
    });

    categoria.save((err, categoriaDb) => {

        if(err) {
            return res.status(500).json({
                    ok:false,
                    err
            });
        }

        if(!categoriaDb) {

            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoriaDb
        });

    });

});


/**
 * Actualizar categoria
 */

app.put('/categoria/:id',verificarToken ,(req, res) => {

    let id = req.params.id;
    let desc = req.body.descripcion
    let newCat = {
        descripcion: desc
    }

    Categoria.findByIdAndUpdate(id, newCat, {new: true, runValidators: true},
        
        (err, categoriaDb) => {

            if(err) {
                return res.status(500).json({
                        ok:false,
                        err
                });
            }
    
            if(!categoriaDb) {
    
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
    
            res.json({
                ok: true,
                categoriaDb
            });

        }
    );

});

/**
 * Eliminar categoria, solo el admin puede hacerlo
 */
app.delete('/categoria/:id', [verificarToken, verificarAdminRole], (req, res) => {

    let id = req.params.id;
    let cat = new Categoria();
    cat.findByIdAndDelete(id, (err, categoriaDel) => {

        
        if(err) {
            return res.status(500).json({
                    ok:false,
                    err
            });
        }

        if(!categoriaDel) {

            return res.status(400).json({
                ok: false,
                err: {
                    msg: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Completado!'
        });

    });

    res.json({
        ok: true
    });

});

/**
* Categoria por id
*/

app.get('/categoria/:id', (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDb) => {

        if(err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!categoriaDb) {
            return res.status(400).json({
                ok: false,
                err: {
                    msg: 'Id no existente'
                }
            });                
        }

        res.json({
            ok: true,
            categoria: categoriaDb
        });

    });

});

    
/**
 * Buscar categoria por Id v2, mas actual
 */

//  app.get('/categoria/:id', verificarToken, (req, res) => {

//     // let categoria = new Categoria();
//     let id = req.params.id
//     Categoria.findOne({_id: id}, (err, categoriaDb) => {

//         if(err) {
//             return res.status(500).json({
//                     ok:false,
//                     err
//             });
//         }

//         if(!categoriaDb) {
//             return res.status(400).json({
//                 ok: false,
//                 err: {
//                     msg: 'Id no existente'
//                 }
//             });
//         }

//         res.json({
//             ok: true,
//             categoriaDb
//         });



//     });

//  });



module.exports = app;