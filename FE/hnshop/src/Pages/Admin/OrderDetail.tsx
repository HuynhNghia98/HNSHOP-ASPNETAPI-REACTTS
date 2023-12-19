import { useEffect, useState } from "react";
import { IOrder } from "../../Services/Interfaces/Interfaces";
import { Link, useParams } from "react-router-dom";
import AdminOrderServices from "../../Services/Admin/AdminOrderServices";
import FormatDate from "../../Utility/FormatDate";
import { SD_OrderStatus } from "../../Utility/SD";
import FormatCurrency from "../../Utility/FormatCurrency";

const OrderDetail = () => {
    const { id } = useParams();
    const [order, setOrder] = useState<IOrder>();

    useEffect(() => {
        AdminOrderServices.getAdminOrderDetail(parseInt(id || '', 10)).then((res) => {
            if (res.isSuccess) {
                setOrder(res.result);
            } else {
                alert('cannot fetch')
            }
        })
    }, [id]);

    const handleChangeOrderStatus = async (id: string, status: string) => {
        await AdminOrderServices.postAdminChangeOrderStatus(parseInt(id || '', 10), status).then((res) => {
            if (res.isSuccess) {
                setOrder(res.result);
            } else {
                alert('cannot fetch')
            }
        })
    };

    return (
        <div className="border">
            <div className="custom-border-top p-3 bg-white">
                <h4>Order Detail Management</h4>
                <hr />
                {order ? (
                    <div className="border border-black p-3 mb-3">
                        <div className="row">
                            <div className="col-9">
                                <p className="mb-1"><span className="me-2 fw-bold fs-5">Order ID #{order?.id}</span> ({FormatDate(order?.orderDate)})</p>
                                <p className="mb-1"><span className="me-2 fw-bold">Order Status:</span>
                                    <span
                                        className={order?.orderStatus === SD_OrderStatus.WAITCONFIRM || order?.orderStatus === SD_OrderStatus.WAITDELIVERY ? 'text-warning' : order?.orderStatus === SD_OrderStatus.CANCELED ? 'text-danger' : 'text-success'}
                                    >{order?.orderStatus}</span>
                                </p>
                                <p className="mb-1"><span className="me-2 fw-bold">Payment Status:</span><span className="text-success me-2">{order.paymentStatus}</span> ({FormatDate(order?.orderDate)})</p>
                                <p><span className="me-2 fw-bold">Total:</span> <span className="">{FormatCurrency(order?.total)}</span></p>
                            </div>
                            <div className="col text-end">
                                {order?.orderStatus === SD_OrderStatus.WAITCONFIRM ? (
                                    <>
                                        <button
                                            className="btn btn-success rounded-0 w-100 mb-2"
                                            onClick={() => handleChangeOrderStatus(id || '', order.orderStatus)}
                                        >
                                            Confirm
                                        </button>
                                        {/* <button className="btn btn-danger rounded-0 w-100">Cancel</button> */}
                                    </>
                                ) : (order?.orderStatus === SD_OrderStatus.WAITDELIVERY ? (
                                    <>
                                        <button
                                            className="btn btn-success rounded-0 w-100 mb-2"
                                            onClick={() => handleChangeOrderStatus(id || '', order.orderStatus)}
                                        >
                                            Delivered
                                        </button>
                                    </>
                                ) : null)}
                            </div>
                        </div>
                        <form className="border p-3 mb-3 bg-body-tertiary">
                            <h5 className="fw-bold">Order Information:</h5>
                            <hr />
                            <div className="row mb-3">
                                <div className="col">
                                    <label>Name:</label>
                                    <input className="form-control rounded-0"
                                        value={order.name}
                                        readOnly
                                    />
                                </div>
                                <div className="col">
                                    <label>Phone Number:</label>
                                    <input className="form-control rounded-0"
                                        value={order.phoneNumber}
                                        readOnly
                                    />
                                </div>
                                <div className="col">
                                    <label>Street Address:</label>
                                    <input className="form-control rounded-0"
                                        value={order.streetAddress}
                                        readOnly
                                    />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col">
                                    <label>City:</label>
                                    <input className="form-control rounded-0"
                                        value={order.city}
                                        readOnly
                                    />
                                </div>
                                <div className="col">
                                    <label>Postal Code:</label>
                                    <input className="form-control rounded-0"
                                        value={order.postalCode}
                                        readOnly
                                    />
                                </div>
                                <div className="col">
                                    <label>Tracking Number:</label>
                                    <input className="form-control rounded-0"
                                        value={order.trackingNumber}
                                        readOnly
                                    />
                                </div>
                                <div className="col">
                                    <label>Carrier:</label>
                                    <input className="form-control rounded-0"
                                        value={order.carrier}
                                        readOnly
                                    />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col">
                                    <label>Payment Intent Id:</label>
                                    <input className="form-control rounded-0"
                                        value={order.paymentIntentId}
                                        readOnly
                                    />
                                </div>
                                <div className="col">
                                    <label>SessionId:</label>
                                    <input className="form-control rounded-0"
                                        value={order.sessionId}
                                        readOnly
                                    />
                                </div>
                            </div>
                        </form>
                        <div className="row">
                            <div className="col-6">Product ({order?.items.length})</div>
                            <div className="col text-center">Quantity</div>
                            <div className="col text-center">Price</div>
                            <div className="col text-center">SubTotal</div>
                        </div>
                        <hr />
                        {order?.items && order?.items.map((item, itemIndex) => (
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
                                <hr />
                            </div>
                        ))}
                    </div>
                ) : null}

            </div>
        </div>
    )

}

export default OrderDetail;