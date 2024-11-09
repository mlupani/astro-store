import type { GetProductsByPage } from "@/interfaces";
import { defineAction } from "astro:actions";
import { count, db, eq, Product, ProductImage, sql } from "astro:db";
import { z } from 'zod'

export const getProductsByPage = defineAction({
    accept: 'json',
    input: z.object({
        page: z.number().optional().default(1),
        limit: z.number().optional().default(12),
    }),
    handler: async ({page, limit}, context) => {

        page = page < 1 ? 1 : page;

        const [totalRecords] = await db.select({count: count()}).from(Product)
        const totalPages = Math.ceil(totalRecords.count / limit);

        //const products = await db.select().from(Product).innerJoin(ProductImage, eq(ProductImage.productId, Product.id)).limit(limit).offset((page - 1) * limit);

        const productsSql = sql `
            SELECT prod.*,
            (
                select GROUP_CONCAT(image, ',') from  (select * from ${ProductImage} where productId = prod.id limit 2)
            ) as images
            FROM ${Product} as prod
            LIMIT ${limit}
            OFFSET ${(page - 1) * limit};
        `;

        const { rows } = await db.run(productsSql);

        if(page > totalPages) {
            return {
                products: [],
                totalPages,
            }
        }

        return {
            products: rows as unknown as GetProductsByPage[],
            totalPages,
        }

    },
});