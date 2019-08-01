const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
let rolesValidos = {
    values:['ADMIN_ROLE','USER_ROLE'],
    message:'{VALUE} no es un rol disponible!'
}
let Schema = mongoose.Schema; 

let usuarioSchema = new Schema({
    nombre : {
        type : String,
        required :[true,'Este campo es necesario!'],
    },
    email:{
        type: String,
        unique: true,
        required: [true,'el correo es necesario'],
    },
    password:{
        type: String,
        required: true
    },
    img:{
        type: String,
        default:''
    },
    role:{
        type: String,
        required: true,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado:{
        type: Boolean,
        default: true    
    },
    google:{
        type: Boolean,
        required: false,
        default: false
    }
});

usuarioSchema.methods.toJSON = function() {

    let user = this;    
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
    
}

usuarioSchema.plugin(uniqueValidator, {message:'{PATH} ya existente!'});

module.exports = mongoose.model('Usuario', usuarioSchema);