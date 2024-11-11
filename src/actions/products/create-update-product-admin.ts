
import { defineAction } from "astro:actions";
import { z } from 'zod'
import { v4 as uuid } from 'uuid';
import { getSession } from "auth-astro/server";
import { db, eq, Product, ProductImage } from "astro:db";
import { ImageUpload } from "@/utils/image-upload";

const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ALLOWED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];

export const createUpdateProduct = defineAction({
    accept: 'form',
    input: z.object({
        id: z.string().optional(),
        slug: z.string(),
        description: z.string(),
        price: z.number(),
        stock: z.number(),
        gender: z.string(),
        sizes: z.string(),
        tags: z.string(),
        title: z.string(),
        type: z.string(),
        imageFiles: z.array(
            z.instanceof(File)
            .refine((file) => file && file.size <= MAX_FILE_SIZE, {
                message: `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`
            })
            .refine((file) => file && ALLOWED_FILE_TYPES.includes(file.type), {
                message: `File type must be one of ${ALLOWED_FILE_TYPES.join(', ')}`
            })
        ).optional()
    }),
    handler: async (form, context) => {

        const session = await getSession(context.request);
        const user = session?.user?.id;

        if(!user){
            throw new Error('User not authenticated');
        }

        const { id = uuid(), imageFiles, ...rest } = form
        rest.slug = rest.slug.toLowerCase().trim().replaceAll(' ', '-');

        const product = {
            id,
            user: user,
            ...rest,
        }

        const queries: any = [];

        if(!form.id){
            queries.push(db.insert(Product).values(product));
        } else {
            queries.push(db.update(Product).set(product).where(eq(Product.id, id)));
        }

        //images
        if(imageFiles?.length && imageFiles[0].size > 0){
            const promisesUrls = imageFiles?.map(file => ImageUpload.upload(file));
            const urls = await Promise.all(promisesUrls);

            urls.forEach(url => {
                if(!url) return;
                const imageObj = {
                    id: uuid(),
                    productId: id,
                    image: url
                }

                queries.push(db.insert(ProductImage).values(imageObj));
            })
        }

        await db.batch(queries);

        /*
        imageFiles?.forEach(async (file) => {
            if(file.size <= 0) return;
            const url = await ImageUpload.upload(file);
        });
        */

        return product;
    },
});