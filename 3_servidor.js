const express = require('express');
const fs = require('fs')
const app = express();
const PORT = 8080;

class Contenedor {
    constructor(file) {
        this.file = file
    }
    getAll = () => {
        try {
            const data = fs.readFileSync(this.file, 'utf-8')
            return data ? JSON.parse(data) : [];
        } catch (err) {
            console.log(err)
        }
    }
    getRandom = () => {
        try {
            const data = JSON.parse(fs.readFileSync(this.file, 'utf-8'))
            const random = Math.floor(Math.random() * data.length)
            return data[random]
        } catch (err) {
            console.log(err);
        }
    }
}

const products = new Contenedor('./data/productos.txt');

app.get('/productos', (req, res) => {
    res.send(products.getAll())
})

app.get('/productoRandom', (req, res) => {
    res.send(products.getRandom())
})

const server = app.listen(PORT, () => {
    console.log(`Servidor Http, puerto: ${server.address().port}`);
})