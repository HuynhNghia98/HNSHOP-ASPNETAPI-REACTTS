import { useEffect, useState } from "react";
import CartServices from "../../../Services/Cart/CartServices";
import { ICart } from "../../../Services/Interfaces/Interfaces";
import FormatCurrency from "../../../Utility/FormatCurrency";
import userModel from "../../../Services/Interfaces/UserModel";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Storage/Redux/store";
import { Link } from "react-router-dom";
import CartModel from "../../../Services/Interfaces/CartModel";
import { setCart } from "../../../Storage/Redux/cartSlice";

const Cart = () => {
    const [carts, setCarts] = useState<ICart[]>([]);
    const [subTotal, setSubTotal] = useState<number>(0);
    const [saleOffTotal, setSaleOffTotal] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);
    const dispatch = useDispatch();

    //userData
    const userData: userModel = useSelector(
        (state: RootState) => state.userAuthStore
    );
    //cartCount
    const cartCount: CartModel = useSelector(
        (state: RootState) => state.cartStore
    );

    useEffect(() => {
        CartServices.getCartsAll(userData.id).then((res) => {
            if (res.isSuccess) {
                setCarts(res.result.carts);
                setSubTotal(res.result.subTotal);
                setSaleOffTotal(res.result.saleOffTotal);
                setTotal(res.result.total);
            } else {
                alert("cannot fetch");
            }
        })
    }, []);

    const handleAddCart = (id: number, userId: string) => {
        CartServices.postAddOneToCart(id, userId).then((res) => {
            if (res.isSuccess) {
                setCarts(res.result.carts);
                setSubTotal(res.result.subTotal);
                setSaleOffTotal(res.result.saleOffTotal);
                setTotal(res.result.total);
            } else {
                alert("cannot add.");
            }
        })
    };

    const handleMinusCart = (id: number, userId: string) => {
        CartServices.postMinusOneToCart(id, userId).then((res) => {
            if (res.isSuccess) {
                setCarts(res.result.carts);
                setSubTotal(res.result.subTotal);
                setSaleOffTotal(res.result.saleOffTotal);
                setTotal(res.result.total);
                const count = carts.length - 1;
                dispatch(setCart({ count }));
            } else {
                alert("cannot add.");
            }
        })
    };

    const handleDeleteCart = (id: number, userId: string) => {
        CartServices.postDeleteCart(id, userId).then((res) => {
            if (res.isSuccess) {
                setCarts(res.result.carts);
                setSubTotal(res.result.subTotal);
                setSaleOffTotal(res.result.saleOffTotal);
                setTotal(res.result.total);
                const count = carts.length - 1;
                dispatch(setCart({ count }));
            } else {
                alert("cannot add.");
            }
        })
    };

    return (
        <section className="">
            <div className="container my-4 p-3 bg-white">
                <div className="row">
                    <div className="col-9">
                        <div className="row">
                            <div className="col-5 fw-bold">Product ({carts.length})</div>
                            <div className="col fw-bold text-center">Quantity</div>
                            <div className="col fw-bold text-center">Price</div>
                            <div className="col fw-bold text-center">Total</div>
                            <div className="col fw-bold text-center">Delete</div>
                        </div>
                        {carts && carts.map((cart, index) => (
                            <div key={index}>
                                <hr />
                                <div className="row" key={index}>
                                    <div className="col-5">
                                        <div className="row">
                                            <div className="col-5">
                                                <Link to={`/${cart.productDetail.product?.subCategory?.urlName}/p/${cart.productDetail.product?.slug}`}>
                                                    <img
                                                        className="img-fluid"
                                                        src={`https://localhost:5000${cart.productDetail?.product?.images ? cart.productDetail.product.images[0].imageUrl : ""}`}
                                                        alt={cart.productDetail?.product?.images ? cart.productDetail.product.images[0].imageUrl : ""}
                                                    />
                                                </Link>
                                            </div>
                                            <div className="col">
                                                <Link to={`/${cart.productDetail.product?.subCategory?.urlName}/p/${cart.productDetail.product?.slug}`}
                                                    className="text-decoration-none text-dark"
                                                >
                                                    <h5 className="fw-bold">{cart.productDetail.product?.name}</h5>
                                                </Link>
                                                <p>Size: {cart.productDetail.size?.name}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col text-center">
                                        <button className="btn btn-light border rounded-0 py-1 px-2"
                                            onClick={() => handleMinusCart(cart.id, userData.id)}
                                        ><i className="bi bi-dash-lg"></i>
                                        </button>
                                        <span className="btn">{cart.quantity}</span>
                                        <button className="btn btn-light border rounded-0 py-1 px-2"
                                            onClick={() => handleAddCart(cart.id, userData.id)}
                                        ><i className="bi bi-plus-lg"></i></button>
                                    </div>
                                    <div className="col text-center">
                                        {cart.finalPrice > 0 ? (
                                            <>
                                                <p className="text-decoration-line-through text-secondary fs-7 mb-2">
                                                    {FormatCurrency(cart.productDetail.product?.price || 0)}
                                                </p>
                                                <p>
                                                    {FormatCurrency(cart.finalPrice)}
                                                </p>
                                            </>
                                        ) : (
                                            <span>
                                                {FormatCurrency(cart.productDetail.product?.price || 0)}
                                            </span>
                                        )}
                                    </div>
                                    <div className="col text-center">
                                        {cart.finalSubTotal > 0 ? (
                                            <>
                                                <p className="text-decoration-line-through text-secondary fs-7 mb-2">
                                                    {FormatCurrency(cart.quantity * (cart.productDetail?.product?.price || 0))}
                                                </p>
                                                <p>
                                                    {FormatCurrency(cart.finalSubTotal)}
                                                </p>
                                            </>
                                        ) : (
                                            <span>
                                                {FormatCurrency(cart.quantity * (cart.productDetail?.product?.price || 0))}
                                            </span>
                                        )}
                                    </div>
                                    <div className="col text-center">
                                        <button className="btn"
                                            onClick={() => handleDeleteCart(cart.id, userData.id)}
                                        >
                                            <i className="bi bi-trash-fill text-danger"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="col">
                        <div className="bg-body-tertiary p-3">
                            <h4 className="fw-bold">Cart Total</h4>
                            <hr />
                            <div className="row">
                                <h6 className="col">SubTotal:</h6>
                                <div className="col text-end fw-bold">{FormatCurrency(subTotal)}</div>
                            </div>
                            <div className="row">
                                <h6 className="col">Sale Off:</h6>
                                <div className="col text-end fw-bold">- {FormatCurrency(saleOffTotal)}</div>
                            </div>
                            <hr />
                            <div className="row mb-3">
                                <h5 className="col">Total:</h5>
                                <div className="col text-end fw-bold">{FormatCurrency(total)}</div>
                            </div>
                            <div className="mb-3">
                                {carts.length > 0 ? (
                                    <Link to="/cart/orderInformation" className="btn btn-dark rounded-0 w-100">Order Now</Link>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </section>
    );
}

export default Cart;