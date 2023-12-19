import { Link, useLocation } from "react-router-dom";

const OrderConfirmation = () => {
    const { state: { id } } = useLocation();
    return (
        <section>
            <div className="container my-4">
                <div className="row justify-content-center">
                    <div className="col-6 bg-white text-center p-4">
                        <div>
                            <span className="">
                                <i className="bi bi-check-circle text-success" style={{ fontSize: "200px" }}></i>
                            </span>
                        </div>
                        <h5>You have successfully paid !</h5>
                        <h5 className="mb-3">Your order is #{id}</h5>
                        <Link to="/user/order" className="btn btn-dark rounded-0 mb-4">View orders now </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
export default OrderConfirmation;