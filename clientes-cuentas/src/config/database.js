const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('Base de datos conectada correctamente')
    } catch (error) {
        console.error('Error de conexión:', error.message)
        throw error
    }
}

module.exports = connectDB
