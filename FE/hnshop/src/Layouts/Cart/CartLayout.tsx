import { Outlet, useLocation, useParams } from "react-router-dom";
import CartStep from "../../components/CartStep";

const CartLayout = () => {
    const location = useLocation();
    const currentPath = location.pathname;
    const cartUrlCurrent = currentPath.split("/")[2];

    return (
        <>
            <section className="bg-white py-4">
                <div className="row justify-content-center mb-2">
                    <CartStep number={1} label="Cart list" isActive={cartUrlCurrent === 'list'} />
                    <div className="col-1 justify-content-center">
                        <div className="p-3 text-center">
                            <hr />
                        </div>
                    </div>
                    <CartStep number={2} label="Order Information" isActive={cartUrlCurrent === 'orderInformation'} />
                    <div className="col-1 justify-content-center">
                        <div className="p-3 text-center">
                            <hr />
                        </div>
                    </div>
                    <CartStep number={3} label="Payment" isActive={cartUrlCurrent === 'payment'} />
                </div>
            </section>
            <Outlet />
        </>
    );
}

export default CartLayout;