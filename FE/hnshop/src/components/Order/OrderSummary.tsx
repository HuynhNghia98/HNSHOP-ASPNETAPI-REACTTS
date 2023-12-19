import { ICart } from "../../Services/Interfaces/Interfaces";
import FormatCurrency from "../../Utility/FormatCurrency";

interface OrderSummaryProps {
    name: number;
    phoneNumber: string;
    streetAddress: number;
    city: number;
    postalCode: string;
    cartTotal: number;
    cartList: ICart[];
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ name, phoneNumber, streetAddress, city, postalCode, cartTotal, cartList }) => {
    return (<>
        <div className='col-7 bg-white px-5 py-4'>
            <h4>Order Summary</h4>
            <hr />
            <div className="bg-body-tertiary p-3">
                <div className='row'>
                    <div className='col-4'><h6 className="fw-bold">Name: </h6></div>
                    <div className='col'> {name}</div>
                </div>
                <div className='row'>
                    <div className='col-4'><h6 className="fw-bold">Phone Number:</h6></div>
                    <div className='col'>{phoneNumber}</div>
                </div>
                <div className='row'>
                    <div className='col-4'><h6 className="fw-bold">Street Address:</h6></div>
                    <div className='col'>{streetAddress}</div>
                </div>
                <div className='row'>
                    <div className='col-4'><h6 className="fw-bold">City:</h6></div>
                    <div className='col'>{city}</div>
                </div>
                <div className='row'>
                    <div className='col-4'><h6 className="fw-bold">Postal Code:</h6></div>
                    <div className='col'>{postalCode}</div>
                </div>
            </div>
            <h4 className="mt-3">Order Details</h4>
            <hr />
            <div className="bg-body-tertiary p-3">
                <div className='row mb-2'>
                    <div className='col-5'>Name</div>
                    <div className='col text-center'>Quantity</div>
                    <div className='col text-center'>Price</div>
                    <div className='col text-center'>ToTal</div>
                </div>
                <hr />
                {cartList && cartList.map((c, index) => (
                    <div key={index} className='row'>
                        <div className='col-5 mb-2'><p className="fw-bold m-0">{c.productDetail.product?.name}</p><span className="fs-7"> x {c.productDetail.size?.name}</span></div>
                        <div className='col text-center'>{c.quantity}</div>
                        <div className='col text-center'>
                            {c.finalPrice > 0 ? (
                                <>
                                    <p className="text-decoration-line-through text-secondary fs-7 mb-2">
                                        {FormatCurrency(c.productDetail.product?.price || 0)}
                                    </p>
                                    <p>
                                        {FormatCurrency(c.finalPrice)}
                                    </p>
                                </>
                            ) : (
                                <span>
                                    {FormatCurrency(c.productDetail.product?.price || 0)}
                                </span>
                            )}
                        </div>
                        <div className='col text-center'>
                            {c.finalSubTotal > 0 ? (
                                <>
                                    <p className="text-decoration-line-through text-secondary fs-7 mb-2">
                                        {FormatCurrency(c.quantity * (c.productDetail?.product?.price || 0))}
                                    </p>
                                    <p>
                                        {FormatCurrency(c.finalSubTotal)}
                                    </p>
                                </>
                            ) : (
                                <span>
                                    {FormatCurrency(c.quantity * (c.productDetail?.product?.price || 0))}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
                <hr />
                <div className='row mb-2'>
                    <div className='col-5'></div>
                    <div className='col text-center'></div>
                    <div className='col text-center'>Total Pay:</div>
                    <div className='col text-center fw-bold'>{FormatCurrency(cartTotal)}</div>
                </div>
            </div>
        </div>
    </>);
}
export default OrderSummary;