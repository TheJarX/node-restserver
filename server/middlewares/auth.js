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

module.exports = {
    verificarToken,
    verificarAdminRole
}