import ResponseWrapper from "../responseWrapper";
import { IProduct, ISubCategory } from "../Interfaces/Interfaces";
import api from "../api";

interface GetSubCategoryPage {
    subCategory: ISubCategory,
    products: IProduct[],
}

const getSubCategoryPage = (urlName: string) => {
    return api
        .get<ResponseWrapper<GetSubCategoryPage>>(`${api.url.subCategory}/${urlName}`)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return error.response.data;
        });
};

const postSubCategoryPageFilter = (urlName: string, price: string, color: number, sort: string, pageNumber: number) => {
    const data = { price, color, sort, pageNumber };
    return api
        .post<ResponseWrapper<GetSubCategoryPage>>(`${api.url.subCategoryFilter}/${urlName}`, data)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return error.response.data;
        });
};

const SubCategoryPageServices = {
    getSubCategoryPage,
    postSubCategoryPageFilter,
};
export default SubCategoryPageServices;