import { useEffect, useState } from "react";
import { IItem, IOrder } from "../../../Services/Interfaces/Interfaces";
import ManageServices from "../../../Services/Customer/Manage/ManageServices";
import { SD_OrderStatus } from "../../../Utility/SD";
import userModel from "../../../Services/Interfaces/UserModel";
import { useSelector } from "react-redux";
import { RootState } from "../../../Storage/Redux/store";
import FormatDate from "../../../Utility/FormatDate";
import FormatCurrency from "../../../Utility/FormatCurrency";
import { Link } from "react-router-dom";

const ManageOrder = () => {
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [status, setStatus] = useState<string>(SD_OrderStatus.WAITCONFIRM);

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
    }, [userData, status]);

    const handleChangeOrderStatus = (status: string) => {
        setStatus(status);
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
                            <p className="mb-1"><span className="me-2 fw-bold">Payment Status:</span><span className="text-success me-2">{o.paymentStatus}</span> ({FormatDate(o.orderDate)})</p>
                            <p><span className="me-2 fw-bold">Total:</span> <span className="">{FormatCurrency(o.total)}</span></p>
                        </div>
                        <div className="col text-end">
                            {o.orderStatus === SD_OrderStatus.WAITCONFIRM ?
                                (
                                    <>
                                        <button className="btn btn-danger rounded-0 w-50">Cancel</button>
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
                                    !item.isReview ? (
                                        <button className="btn btn-dark rounded-0">Review Now</button>
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
        </div >
    )
}
export default ManageOrder;