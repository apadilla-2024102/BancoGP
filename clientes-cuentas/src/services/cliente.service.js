const Cliente = require('../models/cliente.model')
const { validarCliente } = require('../validators/cliente.validator')

class ClienteService {

    async crear(data) {
        validarCliente(data)

        const existe = await Cliente.findOne({ dpi: data.dpi })
        if (existe) {
            throw new Error('El cliente ya existe con ese DPI')
        }

        const nuevoCliente = new Cliente(data)
        return await nuevoCliente.save()
    }

    async listar() {
        return await Cliente.find().sort({ createdAt: -1 })
    }

    async obtenerPorId(id) {
        const cliente = await Cliente.findById(id)
        if (!cliente) {
            throw new Error('Cliente no encontrado')
        }
        return cliente
    }

    async actualizar(id, data) {
        const cliente = await Cliente.findByIdAndUpdate(id, data, { new: true })
        if (!cliente) {
            throw new Error('Cliente no encontrado para actualizar')
        }
        return cliente
    }

    async eliminar(id) {
        const cliente = await Cliente.findByIdAndDelete(id)
        if (!cliente) {
            throw new Error('Cliente no encontrado para eliminar')
        }
        return cliente
    }
}

module.exports = new ClienteService()
