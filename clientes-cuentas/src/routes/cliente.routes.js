const express = require('express')
const router = express.Router()
const controller = require('../controllers/cliente.controller')
const authMiddleware = require('../middlewares/authMiddleware')

router.post('/', authMiddleware, controller.crear)
router.get('/', authMiddleware, controller.listar)
router.put('/:id', authMiddleware, controller.actualizar)
router.delete('/:id', authMiddleware, controller.eliminar)

module.exports = router
