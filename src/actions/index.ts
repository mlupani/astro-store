import { loginUser, logout, registerUser } from './auth';
import { getAllProducts } from './products/get-all-products';
import { getProductBySlug } from './products/get-product-by-slug';
import { getProductsByPage } from './products/get-products-by-page.action';

export const server = {
  // actions

  // Auth
  loginUser,
  logout,
  registerUser,
  getProductsByPage,
  getProductBySlug,
  getAllProducts
};
