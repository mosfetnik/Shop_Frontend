import { CartItem, Order, Product, ShippingInfo, User } from "./types";

export type CustomError = {
  staus: number;
  data: {
    message: string;
    success: boolean;
  };
};

export type MessageResponse = {
  success: boolean;
  message: string;
};

export type UserResponse = {
  success: boolean;
  user: User;
};

export type AllProductsResponse = {
  success: boolean;
  product: Product[];
};
export type CategoriesResponse = {
  success: boolean;
  categories: string[];
};

export type SearchProductResponse = {
  success: boolean;
  product: Product[];
  totalPage: number;
};
export type SearchProductRequest = {
  price: number;
  page: number;
  category: string;
  search: string;
  sort: string;
};
export type NewProuctRequest = {
  id: string;
  formData: FormData;
};
export type UpdateProuctRequest = {
  userId: string;
  productId: string;
  formData: FormData;
};
export type NewOrderRequest = {
  orderItems: CartItem[];
  subtotal: number;
  tax: number;
  shppingCharges: number;
  discount: number;
  total: number;
  shippingInfo: ShippingInfo;
  user: string;
};
export type UpdateOrderRequest = {
 userId:string;
 orderId:string 
};
export type DeleteProuctRequest = {
  userId: string;
  productId: string;
};

export type ProductResponse = {
  id: string;
  product: Product;
};

export type AllOrdersResponse = {
  success: boolean;
  orders: Order[];
};
export type OrdersDetailsResponse = {
  success: boolean;
  order: Order;
};
