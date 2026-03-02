const cuentaService = require('../services/cuenta.service')
const ApiResponse = require('../utils/ApiResponse')

class CuentaController {

    async crear(req, res, next) {
        try {
            const cuenta = await cuentaService.crear(req.body)
            return ApiResponse.success(res, 'Cuenta creada correctamente', cuenta, 201)
        } catch (error) {
            next(error)
        }
    }

    async listar(req, res, next) {
        try {
            const cuentas = await cuentaService.listar()
            return ApiResponse.success(res, 'Lista de cuentas obtenida', cuentas)
        } catch (error) {
            next(error)
        }
    }

    async actualizarSaldo(req, res, next) {
        try {
            const cuenta = await cuentaService.actualizarSaldo(req.params.id, req.body.monto)
            return ApiResponse.success(res, 'Saldo actualizado correctamente', cuenta)
        } catch (error) {
            next(error)
        }
    }

    async eliminar(req, res, next) {
        try {
            const cuenta = await cuentaService.eliminar(req.params.id)
            return ApiResponse.success(res, 'Cuenta eliminada', cuenta)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new CuentaController()
