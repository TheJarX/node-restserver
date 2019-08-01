const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');

app.use(fileUpload({
    useTempFiles: true,
    // tempFileDir: 'tmp/'
}));


app.put('/upload/:type/:id', (req, res) => {

    let tipo = req.params.type;
    let id = req.params.id;


    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                msg: 'No files were uploaded'
            }
        });
    }

    // Validar tipo
    let tiposPermitidos = ['usuarios', 'productos'];
    if (tiposPermitidos.indexOf(tipo) < 0) {

        return res.status(400).json({
            ok: false,
            err: {
                msg: `La imagen solo puede ser para ${tiposPermitidos.join(' - ')}`
            }
        });

    }

    let extensionesPermitidas = ['image/png', 'image/jpg', 'image/gif']
    let archivo = req.files.archivo;


    // Validar extensionaes
    if (extensionesPermitidas.indexOf(archivo.mimetype) < 0) {

        return res.status(400).json({
            ok: false,
            err: {
                msg: `Las extensiones validas son ${extensionesPermitidas.join(',')}`
            },
            ext: archivo.mimetype,
            encoding: archivo.encoding,
            size: (archivo.size / 1000) / 1000 + 'MB'
        });

    }

    // Cambiar el nombre del archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${archivo.mimetype.split('/')[1]}`

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        guardarImagen(tipo, nombreArchivo, id);

    });

    /**
     * Guarda o actualiza el nombre de la imagen en el usuario o producto, dependiendo
     * de __tipoImg__
     * @param {string} tipoImg Usuarios o Productos, no es case sensitive
     * @param {string} nombreImg El nombre que se genera antes
     * @param {string} id El id que se recoge por medio de la url
     */

    function guardarImagen(tipoImg, nombreImg, id) {

        // Nos aseguramos que sean minusculas
        tipoImg = tipoImg.toLowerCase();

        if(tipoImg == 'usuarios') {
            imagenUsuario(id, nombreImg);
        } else if(tipoImg == 'productos') {
            imagenProducto(id, nombreImg);
        }

    }

    /**
     * Guarda en la DB el nombre de la imagen del usuario
     * @param {string} id 
     * @param {string} nombreImg el nombre que se genera antes
     */
    function imagenUsuario(id, nombreImg) {

        Usuario.findById(id, (err, usuarioDb) => {

            if (err) {

                borraImagen(nombreImg, 'usuarios');     

                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!usuarioDb) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        msg: 'Id no existente'
                    }
                });
            }

            borraImagen(usuarioDb.img,'usuarios');     

            usuarioDb.img = nombreImg;

            usuarioDb.save((err, usuarioSaved) => {
                res.json({
                    ok: true,
                    usuario: usuarioSaved,
                    img: nombreImg,
                });
            });
        });

    }

    function imagenProducto(id, nombreImg) {

        Producto.findById(id, (err, productoDb) => {

            if(err) {
                borraImagen(nombreImg,'productos')
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


            borraImagen(productoDb.img,'productos')
            
            productoDb.img = nombreImg;


            productoDb.save((err, prodcutoSaved) => {

                if(err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    prodcutoSaved
                });

            });

        });

    }
    
    /**
     * Borra el fichero que se haya subido en la direccion ROOT/uploads/usuarios
     * @param {string} nombreImg El nombre que se genera antes
     * @param {string} tipoImg Usuarios o Productos, no es case sensitive
     */
    function borraImagen(nombreImg, tipoImg) {

        let pathImage = path.resolve(__dirname,
            `../../uploads/${ tipoImg }/${ nombreImg }`);

        if(fs.existsSync(pathImage)) {
            fs.unlinkSync(pathImage);
        }   

    }

});

module.exports = app;