import type { GetProductsByPage } from "@/interfaces"
import { ProductCard } from "./ProductCard"

interface Props {
    products: GetProductsByPage[]
}

export const ProductList = ({products}: Props) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 place-items-center mt-4">
        {
            products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))
        }
    </div>
  )
}
