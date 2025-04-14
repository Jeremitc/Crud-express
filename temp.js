const { getUsuarios } = require('./conexion');

getUsuarios((err, usuarios) => {
    if (err) {
        console.error('Error:', err);
        return;
    }
    console.log('Datos para copiar en index.html:');
    usuarios.forEach(user => {
        console.log(`
            <tr>
                <td>${user.id}</td>
                <td>${user.Nombre}</td>
                <td>${user.carrera}</td>
                <td>${user.semestre}</td>
            </tr>
        `);
    });
});