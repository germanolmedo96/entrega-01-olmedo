import { Router } from "express";
import productManager from "./product.manager.js"

const router = Router();

const productos = new productManager("productos.json");

//traer productos o productos por cantidad
router.get('/', async (req, res) => {
    try{
        const { limit } = req.query;
        if (limit) {
            const products = await productos.getProducts();
            const productosLimitados = products.slice(0, limit);
            res.send(productosLimitados)
        }
        else {
            const mostrarProductos = await productos.getProducts();
            res.send(mostrarProductos);
        } 
    }
    catch(err){
        res.status(404).send({status:"Error al traer productos",message:"Error al traer los productos"})
    }
})


//traer productos por id
router.get('/:pid', async (req, res) => {
    try{
        const productoId = req.params.pid;
        if(productoId){
            const mostrarProducto = await productos.getProductById(parseInt(productoId));
            res.send(mostrarProducto);
        }else{
            res.status(404).send({status:"error", message:"Product not found"})
        }
    }
    catch(err){
        res.status(404).send({status:"error", message:"Product not found"})
    }
})

//agregar productos
router.post('/', async(req,res)=>{
    try{
        let product = req.body
        const newP = productos.addProduct(product)
        res.status(200).send({status:"OK", message:"Product creado"})
    }
    catch(err){
        res.status(404).send({status:"ERROR", message:"Product not saved"})
    }
})

//actualizar productos
router.put('/:pid', async(req,res)=>{
    try{
        const id = req.params.pid;
        let product = req.body;
        await productos.updateProduct( Number(id),product);
        res.send({status:"OK", message:"Producto cargado"});
    }
    catch(err){
        res.status(404).send({status:"Error", message:"Error al actualizar producto"})
    }
})

//eliminar productos
router.delete('/:pid', async(req,res)=>{
    try{
        let id = req.params.pid
        await productos.deleteProduct(Number(id));
        res.send({status:"ok" , message:"Producto borrado"})
    }
    catch(err){
        res.status(404).send({status:"Error", message:"Error al eliminar producto"})
    }
    })

export default router