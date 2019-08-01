const jwt = require('jsonwebtoken');

/**
 * Verificar Token
 */

let verificarToken = (req, res, next) => {

    // Para poder leer los headers del request usamos req.get();
    let token = req.get('token');

    jwt.verify(token, process.env.TOKEN_SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

        req.usuario = decoded.usuario;

        next();

    })


};

/**
 * Verificar el role de admin
 */
let verificarAdminRole = (req, res, next) => {

    let usuario = req.usuario;
    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            msg: 'No cuenta con permisos suficientes'
        });
    }

};

/**
 * Verificar el token de la imagen por ulr
 */
let verificarUrlToken = (req, res, next) => {

    let token = req.query.img_token;

    jwt.verify(token, process.env.TOKEN_SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

        req.usuario = decoded.usuario;

        next();

    })


}
module.exports = {
    verificarToken,
    verificarAdminRole,
    verificarUrlToken
}