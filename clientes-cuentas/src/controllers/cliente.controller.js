const clienteService = require('../services/cliente.service')
const ApiResponse = require('../utils/ApiResponse')

class ClienteController {

    async crear(req, res, next) {
        try {
            const cliente = await clienteService.crear(req.body)
            return ApiResponse.success(res, 'Cliente creado correctamente', cliente, 201)
        } catch (error) {
            next(error)
        }
    }

    async listar(req, res, next) {
        try {
            const clientes = await clienteService.listar()
            return ApiResponse.success(res, 'Lista de clientes obtenida', clientes)
        } catch (error) {
            next(error)
        }
    }

    async actualizar(req, res, next) {
        try {
            const cliente = await clienteService.actualizar(req.params.id, req.body)
            return ApiResponse.success(res, 'Cliente actualizado', cliente)
        } catch (error) {
            next(error)
        }
    }

    async eliminar(req, res, next) {
        try {
            const cliente = await clienteService.eliminar(req.params.id)
            return ApiResponse.success(res, 'Cliente eliminado', cliente)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new ClienteController()
