export interface Cart {
  id?: string;
  shop: string;
  customerId: string;
  cartItems: object;
  createdAt?: Date;
}
