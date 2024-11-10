
import type { CartItem } from "@/interfaces";
import { z } from "zod";
import { defineAction } from "astro:actions";
import { db, eq, inArray, Product, ProductImage } from "astro:db";

export const getProductsFromCart = defineAction({
    accept: 'json',
    input: z.string(),
    handler: async (cartString, context) => {
        const cart = JSON.parse(cartString) as CartItem[]
        if(cart.length === 0) return []
        const productsIds = cart.map((item) => item.productId);

        const dbProducts = await db.select().from(Product).innerJoin(ProductImage, eq(Product.id, ProductImage.productId)).where(inArray(Product.id, productsIds));

        if(!dbProducts) {
            throw new Error("Products not found");
        }

        const products = cart.map((item) => {
            const dbProduct = dbProducts.find((p) => p.Product.id === item.productId);
            if(!dbProduct){
                throw new Error("Product not found in cart");
            }
            const image = dbProduct.ProductImage.image.startsWith("http") ? dbProduct.ProductImage.image : `http://localhost:4321/images/products/${dbProduct.ProductImage.image}`;
            const { slug, title, price } = dbProduct.Product;
            return {
                slug,
                title,
                price,
                quantity: item.quantity,
                size: item.size,
                image,
                id: item.productId
            };
        });

        return products;

    },
});