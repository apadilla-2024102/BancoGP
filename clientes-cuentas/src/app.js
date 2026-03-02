const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const clienteRoutes = require('./routes/cliente.routes')
const cuentaRoutes = require('./routes/cuenta.routes')
const errorHandler = require('./middlewares/errorHandler')

const app = express()

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

app.use('/api/clientes', clienteRoutes)
app.use('/api/cuentas', cuentaRoutes)

app.use(errorHandler)

module.exports = app
