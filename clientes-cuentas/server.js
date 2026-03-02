require('dotenv').config()
const app = require('./src/app')
const connectDB = require('./src/config/database')

const PORT = process.env.PORT || 4002

const startServer = async () => {
    try {
        await connectDB()
        app.listen(PORT, () => {
            console.log(`Clientes-Cuentas Service ejecutándose en puerto ${PORT}`)
        })
    } catch (error) {
        console.error('Error iniciando servidor:', error.message)
        process.exit(1)
    }
}

startServer()
