import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import HomeServices from '../../Services/Customer/HomeServices';
import { ISubCategory } from "../../Services/Interfaces/Interfaces";
import { useDispatch, useSelector } from "react-redux";
import { setLoggedInUser } from "../../Storage/Redux/userAuthSlice";
import { emptyUserState } from '../../Storage/Redux/userAuthSlice';
import userModel from "../../Services/Interfaces/UserModel";
import { RootState } from "../../Storage/Redux/store";
import CartModel from "../../Services/Interfaces/CartModel";
import { setCart } from "../../Storage/Redux/cartSlice";
import { emptyCartState } from '../../Storage/Redux/cartSlice';
import Search from "./Search";

const Header = () => {
    const logo = require("../../assets/images/hnshop.png");
    const clothImg = require("../../assets/images/imgcat1.png");
    const shoesImg = require("../../assets/images/imgcat2.png");
    const accessoriesImg = require("../../assets/images/imgcat3.png");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    //userData
    const userData: userModel = useSelector(
        (state: RootState) => state.userAuthStore
    );
    //cartCount
    const cartCount: CartModel = useSelector(
        (state: RootState) => state.cartStore
    );

    //logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        dispatch(setLoggedInUser({ ...emptyUserState }));
        dispatch(setCart({ ...emptyCartState }));
        navigate("/");
    };

    const [cloths, setCloths] = useState<ISubCategory[]>([]);
    const [accessories, setAccessories] = useState<ISubCategory[]>([]);
    useEffect(() => {
        HomeServices.getLayoutHeader().then((res) => {
            if (res.isSuccess) {
                setCloths(res.result.cloths);
                setAccessories(res.result.accessories);
            } else {
                alert("cannot fetch.");
            }
        })
        if (userData.id !== '') {
            HomeServices.getCartCount(userData.id).then((res) => {
                if (res.isSuccess) {
                    const count = res.result;
                    dispatch(setCart({ count }));
                }
            })
        }
    }, [userData])

    return (
        <header className="sticky-top">
            <nav className="navbar navbar-expand-lg bg-white">
                <div className="container-fluid px-md-5">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon" />
                    </button>
                    <Link className="navbar-brand" to="">
                        <img src={logo} className="img-fluid" alt="logo" style={{ width: "200px" }}></img>
                    </Link>
                    <div className="collapse navbar-collapse d-sm-inline-flex justify-content-center text-center pe-md-5" id="navbarSupportedContent">
                        <ul className="navbar-nav ">
                            <li className="nav-item cloths-hover">
                                <Link to="cloths" className="nav-link active px-4 fs-5 custom-border">Cloths</Link>
                                {/* Cloths dropdown */}
                                <div id="cloths-dropdown" className="py-5 ps-5">
                                    <div className="row justify-content-center text-start">
                                        <div className="col-2">
                                            <div className="mb-2">
                                                <div className="mb-3">
                                                    <span className="fw-bold fs-5 border-bottom border-black">Cloths:</span>
                                                </div>
                                                {cloths && cloths.map((x, index) => (
                                                    <div key={index} className="mb-1">
                                                        <Link to={`cloths/${x.urlName}`} className="text-dark text-decoration-none arrow-hover fs-5">
                                                            <span className="mx-2"><i className="bi bi-caret-right-fill"></i></span> {x.name}
                                                        </Link>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="col-3">
                                            <img src={clothImg} className="img-fluid" alt={clothImg} />
                                            <div>
                                                <Link to="cloths" className="text-dark fs-5">All Cloths &gt;</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li className="nav-item shoes-hover">
                                <Link to="shoes" className="nav-link active px-4 fs-5  custom-border">Shoes</Link>
                                {/* Shoes dropdown */}
                                <div id="shoes-dropdown" className="py-5 ps-5">
                                    <div className="row justify-content-center text-start">
                                        <div className="col-2">
                                            <div className="mb-2">
                                                <div>
                                                    <Link to="shoes" className="text-dark fs-5">All Shoes &gt;</Link>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-3">
                                            <img src={shoesImg} className="img-fluid" alt={shoesImg} />
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li className="nav-item accessories-hover">
                                <Link to="accessories" className="nav-link active px-4 fs-5  custom-border">Accessories</Link>
                                {/* Accessories dropdown */}
                                <div id="accessories-dropdown" className="py-5 ps-5">
                                    <div className="row justify-content-center text-start">
                                        <div className="col-2">
                                            <div className="mb-2">
                                                <div className="mb-3">
                                                    <span className="fw-bold fs-5 border-bottom border-black">Accessories:</span>
                                                </div>
                                                {accessories && accessories.map((x, index) => (
                                                    <div key={index} className="mb-1">
                                                        <Link to={`accessories/${x.urlName}`} className="text-dark text-decoration-none arrow-hover fs-5">
                                                            <span className="mx-2"><i className="bi bi-caret-right-fill"></i></span> {x.name}
                                                        </Link>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="col-3">
                                            <img src={accessoriesImg} className="img-fluid" alt={accessoriesImg} />
                                            <div>
                                                <Link to="accessories" className="text-dark fs-5">All Accessories &gt;</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="navbar px-md-5">
                        <div className="">
                            <button className="py-2 px-2 bg-white border-0" type="button" data-bs-toggle="offcanvas" data-bs-target="#search" aria-controls="offcanvasScrolling">
                                <i className="bi bi-search fs-5"></i>
                            </button>
                        </div>
                        <div className="">
                            {userData.id !== '' ? (
                                cartCount.count > 0 ? (
                                    <>
                                        <Link to="/cart/list" className="text-decoration-none text-dark">
                                            <i className="bi bi-bag-fill fs-5 ps-2"></i>
                                        </Link>
                                        <sup><span className="fs-7 bg-danger text-white px-1 rounded-5">{cartCount.count}</span></sup>
                                    </>
                                ) : (
                                    <Link to="/cart/list" className="text-decoration-none text-dark">
                                        <i className="bi bi-bag-fill fs-5 ps-2"></i>
                                    </Link>
                                )
                            ) : (
                                <Link to="/login" className="text-decoration-none text-dark">
                                    <i className="bi bi-bag-fill fs-5 px-2"></i>
                                </Link>
                            )}
                        </div>
                        <div className="">
                            <button className="py-1 px-2 bg-white border-0" type="button" data-bs-toggle="offcanvas" data-bs-target="#user" aria-controls="offcanvasScrolling">
                                <i className="bi bi-person fs-4"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            {/* search */}
            <div className="offcanvas offcanvas-end" data-bs-scroll="true" data-bs-backdrop="false" tabIndex={-1} id="search" aria-labelledby="offcanvasScrollingLabel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasScrollingLabel">Search Products</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    <Search />
                </div>
            </div>
            {/* user infor */}
            <div className="offcanvas offcanvas-end" data-bs-scroll="true" data-bs-backdrop="false" tabIndex={-1} id="user" aria-labelledby="userLabel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="userLabel">Information</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">

                    <div>
                        <p className="pb-4 text-center fs-5">
                            {userData.fullName !== '' ? (
                                <>
                                    <img className="rounded-5 me-2" style={{ width: "40px" }} src={`https://ui-avatars.com/api/?name=${userData.fullName}`} alt="img"></img>
                                    {userData.fullName}
                                </>
                            ) : "Login now"}</p>
                    </div>
                    {userData.role === 'Admin' ? (
                        <div className="mb-3">
                            <Link to="/admin" className="btn btn-outline-dark rounded-0 w-100">Admin</Link>
                        </div>
                    ) : null}
                    <div className="mb-3">
                        <Link to='user/infor' className="btn btn-outline-dark rounded-0 w-100">Information</Link>
                    </div>
                    <div className="mb-3">
                        <Link to='user/order' className="btn btn-outline-dark rounded-0 w-100">Order</Link>
                    </div>
                    <hr />
                    <div className="mb-3">
                        {userData.id !== '' ? (
                            <button className="btn btn-outline-dark rounded-0 w-100"
                                onClick={handleLogout}
                            >Logout</button>
                        ) : (
                            <>
                                <Link to="login" className="btn btn-outline-dark rounded-0 w-100 mb-3">Login</Link>
                                <Link to="register" className="btn btn-outline-dark rounded-0 w-100">Register</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

        </header >

    )
}

export default Header;