const fs = require('fs')

const prods = [
    { title: 'mate', price: 1400, id: 1 },
    { title: 'bombilla', price: 600, id: 2 },
    { title: 'termo', price: 6000, id: 3 }
]

// Agrego productos iniciales
fs.writeFileSync('./productos.txt', JSON.stringify(prods))

class Contenedor {
    constructor(file) {
        this.file = file
    }

    save = (prod) => {
        const data = this.getAll();

        prod.id = data[data.length - 1].id + 1;
        data.push(prod)

        try {
            fs.writeFileSync(this.file, JSON.stringify(data))
            console.log(prod.id)
        } catch (err) {
            console.log(err);
        }
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
        console.log(selectedProd ? selectedProd : 'No existe el producto seleccionado');
    }
    deleteById = (id) => {
        const data = this.getAll();
        const newData = data.filter(prod => prod.id !== id);
        try {
            fs.writeFileSync(this.file, JSON.stringify(newData))
        } catch (err) {
            console.log(err);
        }
    }
    deleteAll = () => {
        try {
            fs.writeFileSync(this.file, '[]')
        } catch (err) {
            console.log(err);
        }
    }
}

const products = new Contenedor('./productos.txt');

products.save({ title: 'yerba', price: 200 });
products.getById(2)
products.deleteById(2)
console.log(products.getAll());
