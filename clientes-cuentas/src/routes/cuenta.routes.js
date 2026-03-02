const express = require('express')
const router = express.Router()
const controller = require('../controllers/cuenta.controller')
const authMiddleware = require('../middlewares/authMiddleware')

router.post('/', authMiddleware, controller.crear)
router.get('/', authMiddleware, controller.listar)
router.put('/:id/saldo', authMiddleware, controller.actualizarSaldo)
router.delete('/:id', authMiddleware, controller.eliminar)

module.exports = router
