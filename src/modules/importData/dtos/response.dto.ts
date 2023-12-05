export interface ProductDTO {
  product_id: number;
  value: number;
}

export interface OrderDTO {
  order_id: number;
  total: number;
  date: string;
  products: Array<ProductDTO>;
}

export interface ImportDataResponseDTO {
  user_id: number;
  name: string;
  orders: Array<OrderDTO>;
}
