const mongoose = require('mongoose')

const CuentaSchema = new mongoose.Schema({
    numeroCuenta: { type: String, required: true, unique: true },
    tipoCuenta: {
        type: String,
        enum: ['AHORRO', 'MONETARIA'],
        required: true
    },
    saldo: { type: Number, default: 0, min: 0 },
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cliente',
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Cuenta', CuentaSchema)
