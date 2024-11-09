import type { GetProductsByPage } from "@/interfaces"
import { useState } from "react";

interface Props {
    product: GetProductsByPage
}

export const ProductCard = ({product}: Props) => {

    const images = product.images.split(',').map(img => {
        if(img.startsWith('http')) {
            return img;
        } else {
            return `http://localhost:4321/images/products/${img}`;
        }
    })

    const [currentImage, setCurrentImage] = useState(images[0]);

  return (
    <a href={`products/${product.slug}`} onMouseLeave={() => setCurrentImage(images[0])} onMouseEnter={() => setCurrentImage(images[1] ?? images[0])}  >
        <img className="object-contain h-[350px]" src={currentImage} alt={`${product.title}`} />
        <h4>{product.title}</h4>
        <p>${product.price}</p>
    </a>
  )
}
