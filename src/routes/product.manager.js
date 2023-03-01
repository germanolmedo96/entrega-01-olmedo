
import fs  from'fs';

class ProductManager {

    constructor(path) {
        this.path = path;
    }

    //sobreescribo los archivos
    writeFile = async (data) => {
        try {
            await fs.promises.writeFile(
                this.path, JSON.stringify(data)
            )
        }

        catch (err) {
            console.log(err.message);
        }
    }

    //traer todos los productos
    getProducts = async () => {
        try {
            const objs = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(objs);
        }

        catch (err) {
            if (err.message.includes('no such file or directory')) return [];
            else console.log(err.message);
        }
    }

    //agrego un producto nuevo
    addProduct = async (product) => {
        const db = await this.getProducts();
        try {
            if (db.length === 0) {
                let newId = 1;
                const newProduct = { ...product, id: newId };
                db.push(newProduct);
            }
            else {
                let newId = Math.max(...db.map(product => product.id)) + 1;
                const newProduct = { ...product, id: newId };
                db.push(newProduct);
            }

            await this.writeFile(db);
        }

        catch (err) {
            console.log(err.message);
        }
    }

    //traigo un producto por id
    getProductById = async (id) => {
        const products = await this.getProducts();
        try {
            const product = products.find(product => product.id === id);
            if(product){
              return  product
            }
                throw new Error("Algo salio mal al buscar por id")
        }
        catch (err) {
            console.log("no se encontro id");
        }
    }

    //actualizo un producto por id
    updateProduct = async (id, product) => {
        const products = await this.getProducts();
        const newProduct = product
        try {
            const updateProducts = products.map((product) => {
                if (product.id === id) {
                    return { ...product, ...newProduct };
                }
                else {
                    return { ...product }
                }
            });
            await this.writeFile(updateProducts);

        }

        catch (err) {
            console.log(err.message);
        }
    }

    //elimino un producto por id
    deleteProduct = async (id) => {
        let products = await this.getProducts();
        try {
            // if(!products){
                products = products.filter(product => product.id != id);
                await this.writeFile(products);
                return products
            // }
            // throw new Error("error al borrar por id, no se encontro el id")
        }

        catch (err) {
            console.log(err.message);
        }
    }

}

//Se creará una instancia de la clase “ProductManager”
// let productos = new ProductManager('productos.txt');

// const test = async () => {
//     console.log(await productos.getProducts());
//     const producto = {
//         title: "producto prueba",
//         description: "Este es un producto prueba",
//         price: 200,
//         thumbnail: "Sin imagen",
//         code: "afg145",
//         stock: 25
//     };
//     await productos.addProduct(producto);

//     // Se llama el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado
//     console.log(await productos.getProducts(), `producto agregado code: ${producto.code}`);

//     //Se llama al método “getProductById” y se corroborará que devuelva el producto con el id especificado, en caso de no existir,arroja un error.
//     console.log(await productos.getProductById(3),"por id");

//     //Se llama al método “updateProduct” y se intentará cambiar un campo de algún producto, se evaluará que no se elimine el id y que sí se haya hecho la actualización.
//     const productoActualizado = {
//         id:"3333",
//         title: "Gatooooo",
//         description: "animalllll",
//         price: 800,
//         thumbnail: "Sin imagen",
//         code: "dev453",
//         stock: 20
//     };
//     await productos.updateProduct(1, productoActualizado,"producto actualizado");
//     console.log(await productos.getProducts());

//     //Se llamará al método “deleteProduct”, se evaluará que realmente se elimine el producto o que arroje un error en caso de no existir.
//     await productos.deleteProduct(12,"ddd");
//     console.log(await productos.getProducts());
// }

// test();

export default ProductManager;