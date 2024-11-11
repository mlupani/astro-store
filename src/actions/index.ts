import { loginUser, logout, registerUser } from './auth';
import { createUpdateProduct } from './products/create-update-product-admin';
import { getAllProducts } from './products/get-all-products';
import { getProductBySlug } from './products/get-product-by-slug';
import { getProductsByPage } from './products/get-products-by-page.action';
import { getProductsFromCart } from './products/get-products-from-cart';
import { deleteProductImage } from './products/delete-product-inage';

export const server = {
  // actions

  // Auth
  loginUser,
  logout,
  registerUser,
  getProductsByPage,
  getProductBySlug,
  getAllProducts,
  getProductsFromCart,
  createUpdateProduct,
  deleteProductImage
};
