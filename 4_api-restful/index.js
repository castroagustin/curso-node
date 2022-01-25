const express = require('express')
const { Router } = express
const app = express()
const PORT = 8080;

const productos = Router()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/', express.static('public'))

let productosArr = [];

productos.get('/', (req, res) => {
    res.send(productosArr)
})

productos.get('/:id', (req, res) => {
    const selectedProd = productosArr.find(prod => prod.id == req.params.id)
    selectedProd ? res.send(selectedProd) : res.send({ error: 'producto no encontrado' })
})

productos.post('/', (req, res) => {
    const { title, price, thumbnail } = req.body;
    const id = productosArr.length >= 1 ? productosArr[productosArr.length - 1].id + 1 : 1;
    productosArr.push({ id, title, price, thumbnail: '' });
    res.send({ id, title, price, thumbnail })
})

productos.put('/:id', (req, res) => {
    const selectedProd = productosArr.find(prod => prod.id == req.params.id)
    if (selectedProd) {
        selectedProd.title = req.body.title;
        selectedProd.price = req.body.price;
        selectedProd.thumbnail = req.body.thumbnail;
        res.send(selectedProd)
    } else {
        res.send({ error: 'producto no encontrado' })
    }
})

productos.delete('/:id', (req, res) => {
    if (productosArr.some(prod => prod.id == req.params.id)) {
        productosArr = productosArr.filter(prod => prod.id != req.params.id)
        res.send(productosArr)
    } else {
        res.send({ error: 'producto no encontrado' })
    }
})

app.use('/api/productos', productos);

const server = app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
})
server.on('error', (error) => {
    console.log(`Hubo un error: ${error}`);
})