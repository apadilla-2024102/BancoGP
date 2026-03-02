exports.validarCliente = (data) => {
    const { nombre, dpi, direccion, telefono, email } = data

    if (!nombre || !dpi || !direccion || !telefono || !email) {
        throw new Error('Todos los campos del cliente son obligatorios')
    }

    if (dpi.length < 5) {
        throw new Error('DPI inválido')
    }

    if (!email.includes('@')) {
        throw new Error('Correo electrónico inválido')
    }
}
