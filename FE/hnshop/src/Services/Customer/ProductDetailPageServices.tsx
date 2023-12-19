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

// const postCategoryPageFilter = (urlName: string, subCat: number, price: string, color: number, sort: string, pageNumber: number) => {
//     const data = { subCat, price, color, sort, pageNumber };
//     return api
//         .post<ResponseWrapper<GetCategoryPage>>(`${api.url.categoryFilter}/${urlName}`, data)
//         .then((res) => {
//             return res.data;
//         })
//         .catch((error) => {
//             return error.response.data;
//         });
// };

const ProductDetailPageServices = {
    getProductDetailPage,
    // postCategoryPageFilter,
};
export default ProductDetailPageServices;