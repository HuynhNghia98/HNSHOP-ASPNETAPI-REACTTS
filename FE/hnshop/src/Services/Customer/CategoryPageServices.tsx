import ResponseWrapper from "../responseWrapper";
import { ICategory, IProduct, ISubCategory } from "../Interfaces/Interfaces";
import api from "../api";

interface GetCategoryPage {
    category: ICategory,
    subCategories: ISubCategory[],
    products: IProduct[],
}

const getCategoryPage = (urlName: string) => {
    return api
        .get<ResponseWrapper<GetCategoryPage>>(`${api.url.category}/${urlName}`)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return error.response.data;
        });
};

const postCategoryPageFilter = (urlName: string, subCat: number, price: string, color: number, sort: string, pageNumber: number) => {
    const data = { subCat, price, color, sort, pageNumber };
    return api
        .post<ResponseWrapper<GetCategoryPage>>(`${api.url.categoryFilter}/${urlName}`, data)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return error.response.data;
        });
};

const CategoryPageServices = {
    getCategoryPage,
    postCategoryPageFilter,
};
export default CategoryPageServices;