import { Link } from "react-router-dom";
import { IoLogoFacebook } from "react-icons/io";
import { FaInstagram, FaRegPlayCircle, FaPinterest } from "react-icons/fa";
import { TbBrandTiktok } from "react-icons/tb";

const Footer = () => {
    const logo = require("../../assets/images/hnshop.png");
    return (
        <section className="bg-white py-5">
            <div className="container">
                <div className="row mb-4">
                    <div className="col">
                        <Link className="navbar-brand" to="">
                            <img src={logo} className="img-fluid" alt="logo" style={{ width: "200px" }}></img>
                        </Link>
                    </div>
                    <div className="col-1 text-center"><IoLogoFacebook className="fs-2" /></div>
                    <div className="col-1 text-center"><FaInstagram className="fs-2" /></div>
                    <div className="col-1 text-center"><FaRegPlayCircle className="fs-2" /></div>
                    <div className="col-1 text-center"><TbBrandTiktok className="fs-2" /></div>
                    <div className="col-1 text-center"><FaPinterest className="fs-2" /></div>
                    <div className="col text-center fs-5">Region: VietNam</div>
                </div>
                <div className="row">
                    <div className="col">
                        <Link to='/' className="text-dark mb-4">CUSTOMER SERVICES</Link>
                        <p className="fw-bold mb-1">Contact Us</p>
                        <p className="fw-bold mb-1">FAQ</p>
                        <p className="fw-bold mb-1">Size Guide</p>
                        <p className="fw-bold mb-1">In-Store Exchanges & Returns</p>
                        <p className="fw-bold mb-1">Notice of Accessibility</p>
                    </div>
                    <div className="col">
                        <Link to='/' className="text-dark">MEN COLLECTION</Link>
                        <p className="fw-bold mb-1">Contact Us</p>
                        <p className="fw-bold mb-1">FAQ</p>
                        <p className="fw-bold mb-1">Size Guide</p>
                        <p className="fw-bold mb-1">In-Store Exchanges & Returns</p>
                        <p className="fw-bold mb-1">Notice of Accessibility</p>
                    </div>
                    <div className="col">
                        <Link to='/' className="text-dark">ABOUT US</Link>
                        <p className="fw-bold mb-1">Contact Us</p>
                        <p className="fw-bold mb-1">FAQ</p>
                        <p className="fw-bold mb-1">Size Guide</p>
                        <p className="fw-bold mb-1">In-Store Exchanges & Returns</p>
                        <p className="fw-bold mb-1">Notice of Accessibility</p>
                    </div>
                    <div className="col">
                        <Link to='/' className="text-dark">CAREERS</Link>
                        <p className="fw-bold mb-1">Contact Us</p>
                        <p className="fw-bold mb-1">FAQ</p>
                        <p className="fw-bold mb-1">Size Guide</p>
                        <p className="fw-bold mb-1">In-Store Exchanges & Returns</p>
                        <p className="fw-bold mb-1">Notice of Accessibility</p>
                    </div>
                    <div className="col">
                        <Link to='/' className="text-dark">INFORMATION</Link>
                        <p className="fw-bold mb-1">Contact Us</p>
                        <p className="fw-bold mb-1">FAQ</p>
                        <p className="fw-bold mb-1">Size Guide</p>
                        <p className="fw-bold mb-1">In-Store Exchanges & Returns</p>
                        <p className="fw-bold mb-1">Notice of Accessibility</p>
                    </div>
                </div>
            </div>
        </section >
    )
}

export default Footer;