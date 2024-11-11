
import { defineAction } from "astro:actions";
import { db, eq, Product, ProductImage } from "astro:db";
import { z } from 'zod'

const newProduct = {
    id: '',
    description:'Nueva descripcion',
    images: [{
        id: '',
        image: 'no-image.png',
        productId: '',
    }],
    stock: 0,
    price: 0,
    sizes: 'M,L,XL',
    slug: 'nuevo-producto',
    type: 'shirts',
    tags: 'shirt,men',
    title: 'Nuevo producto',
    gender: 'men',
}

export const getProductBySlug = defineAction({
    accept: 'json',
    input: z.string(),
    handler: async (slug, context) => {

        if(slug === 'new'){
            return {
                product:newProduct,
                images: newProduct.images
            }
        }

        const [product] = await db.select().from(Product).where(eq(Product.slug, slug));

        if(!product){
            throw new Error('Product not found')
        }

        const images = await db.select().from(ProductImage).where(eq(ProductImage.productId, product.id));

        return {
            product,
            images
        }

    },
});