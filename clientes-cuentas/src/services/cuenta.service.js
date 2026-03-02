const Cuenta = require('../models/cuenta.model')
const Cliente = require('../models/cliente.model')

class CuentaService {

    async crear(data) {
        const { numeroCuenta, cliente } = data

        const existeCuenta = await Cuenta.findOne({ numeroCuenta })
        if (existeCuenta) {
            throw new Error('El número de cuenta ya existe')
        }

        const clienteExiste = await Cliente.findById(cliente)
        if (!clienteExiste) {
            throw new Error('El cliente no existe')
        }

        const nuevaCuenta = new Cuenta(data)
        return await nuevaCuenta.save()
    }

    async listar() {
        return await Cuenta.find()
            .populate('cliente')
            .sort({ createdAt: -1 })
    }

    async actualizarSaldo(id, monto) {
        const cuenta = await Cuenta.findById(id)
        if (!cuenta) {
            throw new Error('Cuenta no encontrada')
        }

        cuenta.saldo += monto
        if (cuenta.saldo < 0) {
            throw new Error('Saldo insuficiente')
        }

        return await cuenta.save()
    }

    async eliminar(id) {
        const cuenta = await Cuenta.findByIdAndDelete(id)
        if (!cuenta) {
            throw new Error('Cuenta no encontrada')
        }
        return cuenta
    }
}

module.exports = new CuentaService()
