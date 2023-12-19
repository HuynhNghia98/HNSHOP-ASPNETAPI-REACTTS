import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CartServices from "../../../Services/Cart/CartServices";
import userModel from "../../../Services/Interfaces/UserModel";
import { useSelector } from "react-redux";
import { RootState } from "../../../Storage/Redux/store";
import inputHelper from "../../../Helper/inputHelper";
import PaymentServices from "../../../Services/Customer/Payment/PaymentServices";

const OrderInformation = () => {
    const [deliveryInput, setDeliveryInput] = useState({
        name: '',
        phoneNumber: '',
        streetAddress: '',
        city: '',
        postalCode: '',
    });
    const navigate = useNavigate();
    //userData
    const userData: userModel = useSelector(
        (state: RootState) => state.userAuthStore
    );

    useEffect(() => {
        CartServices.getDeliveryInformation(userData.id).then((res) => {
            if (res.isSuccess) {
                setDeliveryInput({
                    name: res.result.name || "",
                    phoneNumber: res.result.phoneNumber || "",
                    streetAddress: res.result.streetAddress || "",
                    city: res.result.city || "",
                    postalCode: res.result.postalCode || "",
                });
            } else {
                alert("cannot fetch")
            }
        })
    }, [userData.id])

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const tempData = inputHelper(e, deliveryInput);
        setDeliveryInput(tempData);
    };

    const handleMakePaymentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        PaymentServices.postPayment(userData.id).then((res) => {
            console.log(res)
            if (res.isSuccess) {
                navigate("/cart/payment", {
                    state: { apiResult: res.result, deliveryInput },
                });
            }
            else {
                alert('cannot fetch');
            }
        });
    };

    return (
        <section>
            <div className="container my-4 bg-white p-4">
                <div className="row justify-content-center">
                    <div className="col-6">
                        <h3>Delivery Information</h3>
                        <hr />
                        <form onSubmit={(e) => handleMakePaymentSubmit(e)}>
                            <div className="mb-2">
                                <label htmlFor="">Name:</label>
                                <input type="text" className="form-control rounded-0"
                                    name="name"
                                    value={deliveryInput.name}
                                    onChange={(e) => handleInput(e)}
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor="">Phone Number:</label>
                                <input type="text" className="form-control rounded-0"
                                    name="phoneNumber"
                                    value={deliveryInput.phoneNumber}
                                    onChange={(e) => handleInput(e)}
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor="">Street Address:</label>
                                <input type="text" className="form-control rounded-0"
                                    name="streetAddress"
                                    value={deliveryInput.streetAddress}
                                    onChange={(e) => handleInput(e)}
                                    required
                                />
                            </div>
                            <div className="row mb-4">
                                <div className="col">
                                    <label htmlFor="">City:</label>
                                    <input type="text" className="form-control rounded-0"
                                        name="city"
                                        value={deliveryInput.city}
                                        onChange={(e) => handleInput(e)}
                                        required
                                    />
                                </div>
                                <div className="col">
                                    <label htmlFor="">Postal Code:</label>
                                    <input type="text" className="form-control rounded-0"
                                        name="postalCode"
                                        value={deliveryInput.postalCode}
                                        onChange={(e) => handleInput(e)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <Link to='/cart/list' className="btn btn-outline-dark w-100 rounded-0">Back to Cart</Link>
                                </div>
                                <div className="col">
                                    <button className="btn btn-dark w-100 rounded-0"
                                        type="submit"
                                    >Make Payment</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default OrderInformation;