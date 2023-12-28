import { useEffect, useState } from "react";
import { IOrder } from "../../../Services/Interfaces/Interfaces";
import ManageServices from "../../../Services/Customer/Manage/ManageServices";
import { SD_OrderStatus, SD_PaymentStatus } from "../../../Utility/SD";
import userModel from "../../../Services/Interfaces/UserModel";
import { useSelector } from "react-redux";
import { RootState } from "../../../Storage/Redux/store";
import FormatDate from "../../../Utility/FormatDate";
import FormatCurrency from "../../../Utility/FormatCurrency";
import { Link } from "react-router-dom";
import Modal from 'react-modal';
import ReviewServices from "../../../Services/Customer/Review/ReviewServices";
import { toast } from "react-toastify";
import inputHelper from "../../../Helper/inputHelper";
import { Rating } from "@mui/material";

const ManageOrder = () => {
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [status, setStatus] = useState<string>(SD_OrderStatus.WAITCONFIRM);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
    const [cancel, setCancel] = useState<number>(0);
    const [ratingError, setRatingError] = useState<[]>([]);
    const [reviewInput, setReviewInput] = useState({
        rating: 0,
        title: '',
        description: '',
        userId: '',
        productId: 0,
        itemId: 0
    });
    //userData
    const userData: userModel = useSelector(
        (state: RootState) => state.userAuthStore
    );

    useEffect(() => {
        ManageServices.postOrderStatus(userData.id, status).then((res) => {
            if (res.isSuccess) {
                setOrders(res.result);
            } else {
                alert('cannot fetch')
            }
        })
    }, [userData, status, isReviewModalOpen, cancel]);

    const handleChangeOrderStatus = (status: string) => {
        setStatus(status);
    }
    //review input
    const handleReviewInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const tempData = inputHelper(e, reviewInput);
        setReviewInput(tempData);
    };
    //submit review
    const handleReviewSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const res = await ReviewServices.postReview(reviewInput.rating, reviewInput.title, reviewInput.description, reviewInput.userId, reviewInput.productId, reviewInput.itemId);

        if (res.isSuccess) {
            toast.success("Reviewed successfully.", {
                autoClose: 2000,
                theme: "colored",
            });
            setIsReviewModalOpen(false);
        } else {
            setRatingError(res.Rating);
        }
    }
    //open review model
    const handleOpenReviewModal = (itemId: number, productId: number, userId: string) => {
        setIsReviewModalOpen(true);
        setReviewInput({
            ...reviewInput,
            itemId,
            productId,
            userId
        });
    }
    //close review model
    const handleCloseReviewModal = () => {
        setIsReviewModalOpen(false);
    }
    //cancel order
    const handleCancelOrder = async (orderId: number) => {
        const res = await ManageServices.postCancelOrder(orderId);
        if (res.isSuccess) {
            setCancel(cancel + 1);
            toast.success(`Canceled order #${orderId}.`, {
                autoClose: 2000,
                theme: "colored",
            });
        } else {
            alert('cannot cancel order.');
        }
    }

    return (
        <div className="">
            <h3>
                Your Orders
            </h3>
            <hr />
            <div className="row mb-3">
                <div className="col">
                    <button className={`btn btn-outline-dark rounded-0 w-100 ${status === SD_OrderStatus.WAITCONFIRM ? 'active' : ''}`}
                        onClick={() => handleChangeOrderStatus(SD_OrderStatus.WAITCONFIRM)}
                    >Wait For Confirmation</button>
                </div>
                <div className="col">
                    <button className={`btn btn-outline-dark rounded-0 w-100 ${status === SD_OrderStatus.WAITDELIVERY ? 'active' : ''}`}
                        onClick={() => handleChangeOrderStatus(SD_OrderStatus.WAITDELIVERY)}
                    >Wait For Delivery</button>
                </div>
                <div className="col">
                    <button className={`btn btn-outline-dark rounded-0 w-100 ${status === SD_OrderStatus.COMPLETED ? 'active' : ''}`}
                        onClick={() => handleChangeOrderStatus(SD_OrderStatus.COMPLETED)}
                    >Completed</button>
                </div>
                <div className="col">
                    <button className={`btn btn-outline-dark rounded-0 w-100 ${status === SD_OrderStatus.CANCELED ? 'active' : ''}`}
                        onClick={() => handleChangeOrderStatus(SD_OrderStatus.CANCELED)}
                    >Canceled</button>
                </div>
            </div>

            {orders && orders.map((o, index) => (
                <div key={index} className="border border-black p-3 mb-3">
                    <div className="row">
                        <div className="col-8">
                            <p className="mb-1"><span className="me-2 fw-bold fs-5">Order ID #{o.id}</span> ({FormatDate(o.orderDate)})</p>
                            <p className="mb-1"><span className="me-2 fw-bold">Order Status:</span>
                                <span
                                    className={o.orderStatus === SD_OrderStatus.WAITCONFIRM || o.orderStatus === SD_OrderStatus.WAITDELIVERY ? 'text-warning' : o.orderStatus === SD_OrderStatus.CANCELED ? 'text-danger' : 'text-success'}
                                >{o.orderStatus}</span>
                            </p>
                            <p className="mb-1"><span className="me-2 fw-bold">Payment Status:</span><span className="text-success me-2">{o.paymentStatus}</span> {o.paymentStatus === SD_PaymentStatus.PAID ? `(${FormatDate(o.orderDate)})` : null}</p>
                            <p><span className="me-2 fw-bold">Total:</span> <span className="">{FormatCurrency(o.total)}</span></p>
                        </div>
                        <div className="col text-end">
                            {o.orderStatus === SD_OrderStatus.WAITCONFIRM ?
                                (
                                    <>
                                        <button className="btn btn-danger rounded-0 w-50"
                                            onClick={() => handleCancelOrder(o.id)}
                                        >Cancel</button>
                                    </>
                                )
                                : null}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-6">Product ({o.items.length})</div>
                        <div className="col text-center">Quantity</div>
                        <div className="col text-center">Price</div>
                        <div className="col text-center">SubTotal</div>
                    </div>
                    <hr />
                    {o.items && o.items.map((item, itemIndex) => (
                        <div key={itemIndex}>
                            <div className="row">
                                <div className="col-6">
                                    <div className="row">
                                        <div className="col-4">
                                            <Link to={`/${item.productDetail.product?.subCategory?.urlName}/p/${item.productDetail.product?.slug}`}>
                                                <img
                                                    className="img-fluid"
                                                    src={`https://localhost:5000${item.productDetail?.product?.images ? item.productDetail.product.images[0].imageUrl : ""}`}
                                                    alt={item.productDetail?.product?.images ? item.productDetail.product.images[0].imageUrl : ""}
                                                />
                                            </Link>
                                        </div>
                                        <div className="col">
                                            <Link to={`/${item.productDetail.product?.subCategory?.urlName}/p/${item.productDetail.product?.slug}`}
                                                className="text-decoration-none text-dark"
                                            >
                                                <p className="fw-bold mb-1">{item.productDetail.product?.name}</p>
                                            </Link>
                                            <p className=" mb-1">Size: {item.productDetail.size?.name}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col text-center">{item.quantity}</div>
                                <div className="col text-center">{FormatCurrency(item.price)}</div>
                                <div className="col text-center">{FormatCurrency(item.quantity * item.price)}</div>
                            </div>
                            <div className="text-end">
                                {
                                    !item.isReview && o.orderStatus === SD_OrderStatus.COMPLETED ? (
                                        <button onClick={() => handleOpenReviewModal(item.id, item.productDetail.productId, userData.id)} className="btn btn-dark rounded-0">Review Now</button>
                                    ) : null
                                }
                            </div>
                            <hr />
                        </div>
                    ))}
                </div>
            ))}
            {(!orders || orders.length === 0) && (
                <h5>Your Order with status {status} is empty.</h5>
            )}

            <Modal
                isOpen={isReviewModalOpen}
                onRequestClose={handleCloseReviewModal}
                style={{
                    content: {
                        width: '600px',
                        height: '500px',
                        left: '35%',
                        top: '15%'
                    },
                }}
                ariaHideApp={false}
            >
                <div>
                    <div className="modal-header border-bottom pb-3">
                        <h1 className="modal-title fs-5">Write your review</h1>
                        <button type="button" className="btn-close" onClick={handleCloseReviewModal} aria-label="Close"></button>
                    </div>
                    <form onSubmit={(e) => handleReviewSubmit(e)} >
                        <div className="modal-body py-4">
                            <div className="mb-2">
                                <Rating
                                    name="rating"
                                    defaultValue={0}
                                    precision={1}
                                    value={reviewInput.rating}
                                    onChange={(event, newValue) => {
                                        setReviewInput((prevReviewInput) => ({
                                            ...prevReviewInput,
                                            rating: newValue || 0
                                        }));
                                    }}
                                />
                                {ratingError && ratingError.map((r: string, i: number) => (
                                    <p key={i} className="text-danger fs-7">{r}</p>
                                ))}
                            </div>
                            <div className="mb-2">
                                <label>Title:</label>
                                <input className="form-control rounded-0" name="title" required
                                    onChange={(e) => handleReviewInput(e)} />
                            </div>
                            <div className="mb-2">
                                <label>Description:</label>
                                <textarea className="form-control rounded-0" rows={5} name="description" required
                                    onChange={(e) => handleReviewInput(e)}
                                />
                            </div>
                        </div>
                        <div className="modal-footer border-top pt-3">
                            <button type="button" className="btn btn-outline-dark w-25 rounded-0" onClick={handleCloseReviewModal}>Close</button>
                            <button type="submit" className="btn btn-dark w-25 rounded-0 ms-1">Review</button>
                        </div>
                    </form>
                </div>
            </Modal>

        </div >
    )
}
export default ManageOrder;