import type { GetProductsByPage } from "@/interfaces";
import { defineAction } from "astro:actions";
import { count, db, eq, Product, ProductImage, sql } from "astro:db";

export const getAllProducts = defineAction({
    accept: 'json',
    handler: async (_, context) => {

        const productsSql = sql `
            SELECT prod.*,
            (
                select GROUP_CONCAT(image, ',') from  (select * from ${ProductImage} where productId = prod.id limit 2)
            ) as images
            FROM ${Product} as prod;
        `;

        const { rows } = await db.run(productsSql);

        return {
            products: rows as unknown as GetProductsByPage[],
        }

    },
});