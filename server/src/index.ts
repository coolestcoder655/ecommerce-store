import express from 'express';
import type { Request, Response, Express } from "express";
import type { Product } from "../types.js";

/*

export interface Product {
    id: UUID;
    name: string;
    description: string;
    price: number;
}

*/

const app: Express = express();
const PORT = process.env.PORT || 3000;
const products: Product[] = [];

// Middleware
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    const filter = req.query.filter as string;

    if (!filter) return res.status(200).json(products);

    const filteredProducts = products.filter(product => {
        product.name.toLowerCase().includes(filter.toLowerCase())
    });
    return res.status(200).json(filteredProducts)
});

app.post('/', (req: Request, res: Response) => {
    const name = req.body.name;
    const description = req.body.description;
    const price = req.body.price;
    const id = crypto.randomUUID();

    if (!name || !description || !price) return res.status(400).json({ message: "Missing required fields" });

    const newProduct: Product = {
        id,
        name,
        description,
        price
    };

    products.push(newProduct);
    return res.status(201).json(newProduct);
});

app.patch('/:id', (req: Request, res: Response) => {
    let updatedProduct: Partial<Product> = req.body;
    const id = req.params.id;

    if (!id) return res.status(400).json({ message: "Missing required fields" });

    const productIndex = products.findIndex(product => product.id === id);
    if (productIndex === -1) return res.status(404).json({ message: "Product not found" });

    products[productIndex] = {
        ...products[productIndex],
        ...updatedProduct
    };

    return res.status(200).json(products[productIndex]);
});

app.delete('/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    if (!id) return res.status(400).json({ message: "Missing required fields" });

    const productIndex = products.findIndex(product => product.id === id);
    if (productIndex === -1) return res.status(404).json({ message: "Product not found" });

    products.splice(productIndex, 1);
    return res.status(200).json({ message: "Product deleted successfully" });
});

app.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}`));