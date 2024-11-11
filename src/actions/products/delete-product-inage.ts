
import { defineAction } from "astro:actions";
import { z } from 'zod'
import { getSession } from 'auth-astro/server';
import { db, eq, ProductImage } from "astro:db";
import { ImageUpload } from "@/utils/image-upload";

export const deleteProductImage = defineAction({
    accept: 'json',
    input: z.string(),
    handler: async (productImageId, context) => {

        const session = await getSession(context.request);
        const user = session?.user?.id;

        if(!user){
            throw new Error('User not authenticated');
        }

        const [productImage] = await db.select().from(ProductImage).where(eq(ProductImage.id, productImageId));

        if(!productImage){
            throw new Error('Product image not found');
        }

        await db.delete(ProductImage).where(eq(ProductImage.id, productImageId));

        if(productImage.image.includes('http')){
            await ImageUpload.delete(productImage.image);
        }

        return true;
    },
});
