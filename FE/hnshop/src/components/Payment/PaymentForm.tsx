import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useState } from 'react';
import { ICart } from '../../Services/Interfaces/Interfaces';
import { toast } from 'react-toastify';
import OrderServices from '../../Services/Customer/Order/OrderServices';
import userModel from '../../Services/Interfaces/UserModel';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Storage/Redux/store';
import { useNavigate } from 'react-router-dom';
import CartModel from '../../Services/Interfaces/CartModel';
import { emptyCartState, setCart } from '../../Storage/Redux/cartSlice';

interface OrderProps {
    stripePaymentIntentId: string,
    total: number,
    deliveryInput: {
        name: string;
        phoneNumber: string;
        streetAddress: string;
        city: string;
        postalCode: string;
    };
}

const PaymentForm = ({ stripePaymentIntentId, total, deliveryInput }: OrderProps) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isProcessing, setIsProcessing] = useState(false);
    //userData
    const userData: userModel = useSelector(
        (state: RootState) => state.userAuthStore
    );
    //cartCount
    const cartCount: CartModel = useSelector(
        (state: RootState) => state.cartStore
    );
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!stripe || !elements) {
            return;
        }
        setIsProcessing(true);
        const result = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: "https://example.com/order/123/complete",
            },
            redirect: "if_required"
        });

        if (result.error) {
            console.log(result.error.message);
        } else {
            const res = await OrderServices.postOrder(userData.id, stripePaymentIntentId, result.paymentIntent.status || '', total, deliveryInput.name, deliveryInput.phoneNumber, deliveryInput.streetAddress, deliveryInput.city, deliveryInput.postalCode);
            console.log(res)
            if (res.isSuccess) {
                dispatch(setCart({ emptyCartState }));
                navigate("/orderConfirmation", {
                    state: { id: res.result },
                });

            }
        }
    };
    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            <button type="submit" className='btn btn-primary w-100 mt-4'>Pay</button>
        </form>
    );
};

export default PaymentForm;