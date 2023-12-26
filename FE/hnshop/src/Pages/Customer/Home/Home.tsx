import { Link } from "react-router-dom";

const Home = () => {
    const background = require("../../../assets/images/bg2.png");
    const jacket = require("../../../assets/images/jacket.png");
    const sweater = require("../../../assets/images/sweater.png");
    const accessories = require("../../../assets/images/accessories.png");
    const shoes = require("../../../assets/images/shoes.png");

    return (<>
        <section className="bg-custom">
            <div id="carouselExample" className="carousel slide">
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <div className="row">
                            <div className="col p-0">
                                <img src={background} className="img-fluid" alt={background} />
                            </div>
                            <div className="col p-0">
                                <img src={background} className="img-fluid" alt={background} />
                            </div>
                        </div>
                    </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true" />
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true" />
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        </section>
        <section className="my-4">
            <div className="container">
                <div className="row">
                    <div className="col p-5">
                        <Link to='/cloths'>
                            <div className="card border-0 rounded-0 text-white">
                                <img src={jacket} className="img-fluid" alt={jacket} />
                                <div className="card-img-overlay m-3">
                                    <h4 className="fw-bold">JACKETS, COATS</h4>
                                </div>
                            </div>
                        </Link>
                    </div>
                    <div className="col p-5">
                        <Link to='/cloths/sweaters-cardigans'>
                            <div className="card border-0 rounded-0 text-white">
                                <img src={sweater} className="img-fluid" alt={sweater} />
                                <div className="card-img-overlay m-3">
                                    <h4 className="fw-bold">SWEATERS, CARDIGANS</h4>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
                <div className="row">
                    <div className="col p-5">
                        <Link to='/shoes'>
                            <div className="card border-0 rounded-0 text-white">
                                <img src={shoes} className="img-fluid" alt={shoes} />
                                <div className="card-img-overlay m-3">
                                    <h4 className="fw-bold">SHOES</h4>
                                </div>
                            </div>
                        </Link>
                    </div>
                    <div className="col p-5">
                        <Link to='accessories'>
                            <div className="card border-0 rounded-0 text-white">
                                <img src={accessories} className="img-fluid" alt={accessories} />
                                <div className="card-img-overlay m-3">
                                    <h4 className="fw-bold">ACCESSORIES</h4>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    </>)
}

export default Home;