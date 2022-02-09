const express = require('express');
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('./public'))

const productosArr = [
    // (Productos de prueba)
    { id: 1, title: 'Pizza', price: 1100, thumbnail: 'https://cdn3.iconfinder.com/data/icons/street-food-and-food-trucker-1/64/pizza-fast-food-bake-bread-128.png' },
    { id: 2, title: 'Pollo', price: 600, thumbnail: 'https://cdn3.iconfinder.com/data/icons/street-food-and-food-trucker-1/64/fried-chicken-thigh-fast-food-128.png' },
    { id: 3, title: 'Hamburguesa', price: 800, thumbnail: 'https://cdn3.iconfinder.com/data/icons/street-food-and-food-trucker-1/64/hamburger-fast-food-patty-bread-128.png' }
];
const mensajesArr = [
    // (Mensajes de prueba)
    { mail: 'agus.castro915@gmail.com', fyh: '9/2/2022 12:41:08', message: 'Hola' },
    { mail: 'pepe.juarez@gmail.com', fyh: '9/2/2022 12:43:59', message: 'Buenas' },
    { mail: 'agus.castro915@gmail.com', fyh: '9/2/2022 12:44:02', message: 'Que tal' },
    { mail: 'juan.perez01@gmail.com', fyh: '9/2/2022 12:47:23', message: 'Hola' }
];

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
})
httpServer.listen(8080, () => console.log('Server ON'));

io.on('connection', (socket) => {
    console.log('Usuario conectado');
    socket.emit('productos', productosArr);

    socket.on('productosUpdate', producto => {
        producto.id = productosArr.length + 1;
        productosArr.push(producto)
        io.sockets.emit('productos', productosArr);
    })

    socket.emit('mensajes', mensajesArr)

    socket.on('mensajesUpdate', mensaje => {
        mensaje.fyh = new Date().toLocaleString();
        mensajesArr.push(mensaje);
        io.sockets.emit('mensajes', mensajesArr);
    })
})
