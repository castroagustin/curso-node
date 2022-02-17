const express = require('express');
const { Router } = express;
const fs = require('fs');
const app = express();
const PORT = 8080;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const productos = Router();
const carrito = Router();

app.use('/api/productos', productos);
app.use('/api/carrito', carrito);


class Contenedor {
    constructor(filePath) {
        this.file = filePath;
    }
    save = (data) => {
        try {
            fs.writeFileSync(this.file, JSON.stringify(data))
        } catch (err) {
            console.log(err);
        }
    }
    add = (prod) => {
        const data = this.getAll();
        const id = data[data.length - 1].id + 1;
        const timestamp = Date.now();
        prod = { id, timestamp, ...prod }
        data.push(prod);
        this.save(data);
        return prod.id;
    }
    getAll = () => {
        try {
            const data = fs.readFileSync(this.file, 'utf-8')
            return data ? JSON.parse(data) : [];
        } catch (err) {
            console.log(err)
        }
    }
    getById = (id) => {
        const data = this.getAll();
        const selectedProd = data.find(prod => prod.id === id);
        return selectedProd;
    }
    update = (id, body) => {
        const { title, price, stock, thumbnail } = body;
        const data = this.getAll();
        const selectedProd = data.find(prod => prod.id === id);
        if (selectedProd) {
            const index = data.indexOf(selectedProd);
            console.log(index);

            selectedProd.title = title;
            selectedProd.price = price;
            selectedProd.stock = stock;
            selectedProd.thumbnail = thumbnail;
            data[index] = selectedProd;

            this.save(data)
        }
        return selectedProd;
    }
    deleteById = (id) => {
        const data = this.getAll();
        if (data.some(prod => prod.id === id)) {
            const newData = data.filter(prod => prod.id !== id);
            this.save(newData);
            return true;
        } else {
            return false;
        }
    }
    deleteCartProdById = (id, idProd) => {
        const data = this.getAll();
        let selectedCart = data.find(cart => cart.id === id)
        if (selectedCart) {
            const cartIndex = data.indexOf(selectedCart);
            if (selectedCart.products.some(prod => prod.id === idProd)) {
                selectedCart.products = selectedCart.products.filter(prod => prod.id !== idProd)
                data[cartIndex] = selectedCart;
                this.save(data);
                return 1;
            }
            return 0
        } else {
            return -1;
        }
    }
}

const admin = true;

const cart = new Contenedor('./data/cart.json');
const prods = new Contenedor('./data/products.json');

productos.get('/', (req, res) => {
    res.send(prods.getAll() || { mensaje: `no hay productos` })
})
productos.get('/:id', (req, res) => {
    res.send(prods.getById(Number(req.params.id)) || { mensaje: `el producto (id: ${req.params.id}) no existe` })
})
productos.post('/', (req, res) => {
    if (admin) {
        const { title, price, stock, thumbnail } = req.body;
        const prod = { title, price, stock, thumbnail };
        res.send({ mensaje: `producto agregado correctamente (id: ${prods.add(prod)})` })
    } else {
        res.send({ error: -1, descripcion: `ruta '/api/productos' método 'POST' no autorizado` })
    }
})
productos.put('/:id', (req, res) => {
    if (admin) {
        res.send(prods.update(Number(req.params.id), req.body) ?
            { mensaje: `el producto (id: ${req.params.id}) se actualizó correctamente` } :
            { mensaje: `el producto (id: ${req.params.id}) no existe` });
    } else {
        res.send({ error: -1, descripcion: `ruta '/api/productos/${req.params.id}' método 'PUT' no autorizado` })
    }
})
productos.delete('/:id', (req, res) => {
    const id = Number(req.params.id);
    if (prods.deleteById(id)) {
        res.send({ mensaje: `el producto (id: ${id}) fue eliminado correctamente` })
    } else {
        res.send({ mensaje: `el producto (id: ${id}) no existe` })
    }
})

carrito.post('/', (req, res) => {
    const newCart = { products: req.body.products };
    res.send({ mensaje: `carrito creado correctamente (id: ${cart.add(newCart)})` })
})
carrito.delete('/:id', (req, res) => {
    if (cart.deleteById(Number(req.params.id))) {
        res.send({ mensaje: `el carrito (id: ${req.params.id}) fue eliminado correctamente` })
    } else {
        res.send({ mensaje: `el carrito (id: ${req.params.id}) no existe` })
    }
})
carrito.get('/:id/productos', (req, res) => {
    const id = Number(req.params.id);
    if (cart.getById(id)) {
        res.send(cart.getById(id).products);
    } else {
        res.send({ mensaje: `el carrito (id: ${id}) no existe` });
    }
})
carrito.post('/:id/productos', (req, res) => {
    const id = Number(req.params.id);
    const prod = req.body;
    const data = cart.getAll();
    const selectedCart = data.find(prod => prod.id === id);;
    if (selectedCart) {
        const index = data.indexOf(selectedCart);
        selectedCart.products.push(prod);
        data[index] = selectedCart;
        cart.save(data);
        res.send({ mensaje: `producto agregado correctamente al carrito (id: ${id})` });
    } else {
        res.send({ mensaje: `el carrito (id: ${id}) no existe` });
    }
})
carrito.delete('/:id/productos/:id_prod', (req, res) => {
    const { id, id_prod } = req.params;
    const deleteProd = cart.deleteCartProdById(Number(id), Number(id_prod));

    if (deleteProd === 1) {
        res.send({ mensaje: `el producto (id: ${id_prod}) fue eliminado del carrito (id: ${id})` });
    } else if (deleteProd === 0) {
        res.send({ mensaje: `el producto (id: ${id_prod}) no existe en el carrito (id: ${id})` });
    } else {
        res.send({ mensaje: `el carrito (id: ${id}) no existe` });
    }
})


app.listen(PORT);