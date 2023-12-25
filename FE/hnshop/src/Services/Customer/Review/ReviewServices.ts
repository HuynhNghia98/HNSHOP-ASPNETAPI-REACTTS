import ResponseWrapper from "../../responseWrapper";
import api from "../../api";

const postReview = (
  rating: number,
  title: string,
  description: string,
  userId: string,
  productId: number,
  itemId: number
) => {
  const data = { rating, title, description, userId, productId, itemId };
  return api
    .post<ResponseWrapper<object>>(api.url.review, data)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response.data.errors;
    });
};

const ReviewServices = {
  postReview,
};
export default ReviewServices;
