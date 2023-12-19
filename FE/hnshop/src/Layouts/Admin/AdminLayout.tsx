import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { setLoggedInUser } from "../../Storage/Redux/userAuthSlice";
import { emptyUserState } from './../../Storage/Redux/userAuthSlice';
import userModel from "../../Services/Interfaces/UserModel";
import { RootState } from "../../Storage/Redux/store";

const AdminLayout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("token");
        dispatch(setLoggedInUser({ ...emptyUserState }));
        navigate("/");
    };

    const userData: userModel = useSelector(
        (state: RootState) => state.userAuthStore
    );

    return (
        <div className="container-fluid" style={{ height: "100%" }}>
            <div className="row d-flex" style={{ height: "100%" }}>
                <div className="col-3 border p-0 bg-white" style={{ height: "100%", width: "250px" }}>
                    <div className="py-2 px-5 mt-2 text-truncate">
                        <p className="m-0"><img src={`https://ui-avatars.com/api/?name=${userData.fullName}`} alt="img1" className="rounded-5 me-2" style={{ width: "40px" }}></img>{userData.fullName}</p>
                    </div>
                    <div className="px-3">
                        <hr></hr>
                    </div>
                    <div className="">
                        <Link to="./" className="btn btn-outline-dark border-0 rounded-0 w-100 fs-6 text-start px-5 py-3">
                            <i className="bi bi-card-text me-4"></i>DashBoard</Link>
                    </div>
                    <div className="">
                        <button className="btn btn-outline-dark border-0 rounded-0 w-100 fs-6 text-start px-5 py-3" type="button" data-bs-toggle="collapse" data-bs-target="#categoryCollapse" aria-expanded="false" aria-controls="categoryCollapse">
                            <i className="bi bi-boxes me-3"></i> Category<i className="bi bi-chevron-down fs-6 ms-4"></i>
                        </button>
                        <div className="collapse" id="categoryCollapse">
                            <div className="card card-body p-0 border-0 custom-collapse-bg rounded-0">
                                <Link to="./category" className="btn btn-outline-dark border-0 rounded-0 w-100 fs-6 text-center px-5 py-3">
                                    Category</Link>
                                <Link to="./subCategory" className="btn btn-outline-dark border-0 rounded-0 w-100 fs-6 text-center px-5 py-3">
                                    SubCategory</Link>
                            </div>
                        </div>
                    </div>
                    <div className="">
                        <button className="btn btn-outline-dark border-0 rounded-0 w-100 fs-6 text-start px-5 py-3" type="button" data-bs-toggle="collapse" data-bs-target="#productCollapse" aria-expanded="false" aria-controls="productCollapse">
                            <i className="bi bi-database-fill me-3"></i> Product<i className="bi bi-chevron-down fs-6 ms-4"></i>
                        </button>
                        <div className="collapse" id="productCollapse">
                            <div className="card card-body p-0 border-0 custom-collapse-bg rounded-0">
                                <Link to="./product" className="btn btn-outline-dark border-0 rounded-0 w-100 fs-6 text-start px-5 py-3 text-center">
                                    Product</Link>
                                <Link to="./productDetail" className="btn btn-outline-dark border-0 rounded-0 w-100 fs-6 text-start px-5 py-3 text-center">
                                    ProductDetail</Link>
                                <Link to="./color" className="btn btn-outline-dark border-0 rounded-0 w-100 fs-6 text-start px-5 py-3 text-center">
                                    Color</Link>
                                <Link to="./size" className="btn btn-outline-dark border-0 rounded-0 w-100 fs-6 text-start px-5 py-3 text-center">
                                    Size</Link>

                            </div>
                        </div>
                    </div>
                    <div className="">
                        <Link to="." className="btn btn-outline-dark border-0 rounded-0 w-100 fs-6 text-start px-5 py-3">
                            <i className="bi bi-receipt-cutoff me-4"></i>Order</Link>
                    </div>
                    <div className="">
                        <Link to="./user" className="btn btn-outline-dark border-0 rounded-0 w-100 fs-6 text-start px-5 py-3">
                            <i className="bi bi-person-vcard-fill me-4"></i>User</Link>
                    </div>
                    <div className="px-3">
                        <hr></hr>
                    </div>
                    <div className="">
                        <Link to="/" className="btn btn-outline-dark border-0 rounded-0 w-100 fs-6 text-start px-5 py-3">
                            <i className="bi bi-house-door-fill me-4"></i>Home</Link>
                    </div>
                    <div className="">
                        <button className="btn btn-outline-dark border-0 rounded-0 w-100 fs-6 text-start px-5 py-3"
                            onClick={handleLogout}
                        >
                            <i className="bi bi-door-closed-fill me-4"></i>Logout</button>
                    </div>
                </div>
                <div className="col border p-0" style={{ height: "100%" }}>
                    <div className="bg-white py-4 px-3 border-bottom mb-1">
                        <h3 className="w-100"><strong>ADMIN MANAGEMENT</strong></h3>
                    </div>
                    <div className="p-3">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminLayout;