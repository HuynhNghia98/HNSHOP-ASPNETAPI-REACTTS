import ResponseWrapper from "../responseWrapper";
import { IProduct, IProductDetail } from "../Interfaces/Interfaces";
import api from "../api";

interface GetProductDetailPage {
    product: IProduct,
    productDetail: IProductDetail[],
    products: IProduct[],
}

const getProductDetailPage = (slug: string) => {
    return api
        .get<ResponseWrapper<GetProductDetailPage>>(`${api.url.productDetail}/${slug}`)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return error.response.data;
        });
};

const ProductDetailPageServices = {
    getProductDetailPage,
};
export default ProductDetailPageServices;