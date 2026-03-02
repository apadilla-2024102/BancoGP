const mongoose = require('mongoose')

const ClienteSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    dpi: { type: String, required: true, unique: true },
    direccion: { type: String, required: true },
    telefono: { type: String, required: true },
    email: { type: String, required: true }
}, { timestamps: true })

module.exports = mongoose.model('Cliente', ClienteSchema)
