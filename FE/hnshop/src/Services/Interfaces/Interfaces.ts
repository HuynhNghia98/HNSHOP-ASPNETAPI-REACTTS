export interface ICategory {
  id: number;
  name: string;
  urlName: string;
  description: string;
  createTime: string;
  subCategories?: ISubCategory;
}

export interface ISubCategory {
  id: number;
  name: string;
  urlName: string;
  description: string;
  createTime: string;
  categoryId: number;
  category?: ICategory;
}

export interface IProduct {
  id: number;
  name: string;
  price: number;
  saleoff: number;
  slug?: string;
  description: string;
  createTime: string;
  subCategoryId: number;
  subCategory?: ISubCategory;
  colorId: number;
  color?: IColor;
  images?: IImage[];
}

export interface IProductDetail {
  id: number;
  quantity: number;
  createTime: string;
  productId: number;
  product?: IProduct;
  sizeId: number;
  size?: ISize;
}

export interface IColor {
  id: number;
  name: string;
}

export interface ISize {
  id: number;
  name: string;
}

export interface IImage {
  id: number;
  imageUrl: string;
  productId: number;
}

export interface IUser {
  id: number;
  email: string;
  name: string;
  phoneNumber: string;
  lockoutEnd: Date;
  role: string;
  createTime: Date;
}

export interface ICart {
  id: number;
  quantity: number;
  productDetail: IProductDetail;
  productDetailId: string;
  applicationUser: IUser;
  applicationUserId: string;
  createTime: Date;
  finalPrice: number;
  finalSubTotal: number;
}

export interface IOrder {
  id: number;
  total: number;
  orderDate: Date;
  shippingDate: Date;
  orderStatus: string;
  paymentStatus: string;
  paymentDate: Date;
  name: string;
  phoneNumber: string;
  streetAddress: string;
  city: string;
  postalCode: string;
  trackingNumber: string;
  carrier: string;
  sessionId: string;
  paymentIntentId: string;
  items: IItem[];
}

export interface IItem {
  id: number;
  quantity: number;
  price: number;
  isReview: boolean;
  createTime: string;
  productDetail: IProductDetail;
  productDetailId: number;
  order: IOrder;
  orderId: number;
}
