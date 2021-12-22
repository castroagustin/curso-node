class Usuario {
    constructor(nombre, apellido, libros, mascotas) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.libros = libros;
        this.mascotas = mascotas;
    }
    getFullName = () => `${this.nombre} ${this.apellido}`;
    addMascota = (name) => this.mascotas.push(name);
    countMascotas = () => this.mascotas.length;
    addBook = (name, author) => this.libros.push({ nombre: name, autor: author });
    getBookNames = () => this.libros.map(book => book.nombre);
}

const agustin = new Usuario('Agustin', 'Castro', [{ nombre: 'Padre Rico', autor: 'Robert K.' }], []);

agustin.addMascota('Perro')
agustin.addMascota('Gato')
agustin.addBook('Piense y Hágase Rico', 'Napoleon Hill');

console.log('NOMBRE COMPLETO:', agustin.getFullName())
console.log('MASCOTAS:', agustin.mascotas)
console.log('CANTIDAD MASCOTAS:', agustin.countMascotas())
console.log('LIBROS:', agustin.libros)
console.log('NOMBRE LIBROS:', agustin.getBookNames())