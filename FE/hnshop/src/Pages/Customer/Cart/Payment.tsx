import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useLocation } from "react-router-dom";
import PaymentForm from '../../../components/Payment/PaymentForm';
import OrderSummary from '../../../components/Order/OrderSummary';

const Payment = () => {
    const {
        state: { apiResult, deliveryInput },
    } = useLocation();
    const stripePromise = loadStripe(
        "pk_test_51OOcF3DW3175KAvXMbPZRQGwSzhrSvpLNXlTLfnRyFommbyMlFu7nsSpEHZDJqvoOzPrDoLkPlxiuyl0EkIfkW2R00MZMgFPzj"
    );
    const options = {
        clientSecret: apiResult.clientSecret,
    };

    return (
        <section>
            <div className='container my-4'>
                <Elements stripe={stripePromise} options={options}>
                    <div className='row justify-content-center'>
                        <OrderSummary
                            name={deliveryInput.name}
                            phoneNumber={deliveryInput.phoneNumber}
                            streetAddress={deliveryInput.streetAddress}
                            city={deliveryInput.city}
                            postalCode={deliveryInput.postalCode}
                            cartTotal={apiResult.cartTotal}
                            cartList={apiResult.shoppingCarts}
                        />
                        <div className='col bg-white px-5 py-4'>
                            <h4>Stripe Payment</h4>
                            <hr />
                            <PaymentForm
                                stripePaymentIntentId={apiResult.stripePaymentIntentId}
                                total={apiResult.cartTotal}
                                deliveryInput={deliveryInput}
                            />
                        </div>
                    </div>
                </Elements>
            </div>
        </section >
    );
}

export default Payment;