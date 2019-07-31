const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({

    descripcion: {
        type: String,
        required: [true,'Se requiere una descripcion'],
    },
    usuario: {
        type: Schema.Types.ObjectId, ref: 'Usuario'
    }

});

module.exports = mongoose.model('Categoria', categoriaSchema);