import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProductDetailPageServices from '../../../Services/Customer/ProductDetailPageServices';
import { IProduct, IProductDetail } from '../../../Services/Interfaces/Interfaces';
import { IImage } from '../../../Services/Interfaces/Interfaces';
import inputHelper from '../../../Helper/inputHelper';
import userModel from '../../../Services/Interfaces/UserModel';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../Storage/Redux/store';
import CartServices from '../../../Services/Cart/CartServices';
import { toast } from 'react-toastify';
import CartModel from '../../../Services/Interfaces/CartModel';
import { setCart } from '../../../Storage/Redux/cartSlice';
import FormatCurrency from './../../../Utility/FormatCurrency';

const ProductDetailPage = () => {
    const { slug } = useParams();
    const [product, setProduct] = useState<IProduct>();
    const [images, setImages] = useState<IImage[]>([]);
    const [productDetails, setProductDetails] = useState<IProductDetail[]>([]);
    const [products, setProducts] = useState<IProduct[]>([]);
    //errors
    const [productDetailIdError, setProductDetailIdError] = useState<[]>([]);
    const [quantityError, setQuantityError] = useState<[]>([]);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    //userData
    const userData: userModel = useSelector(
        (state: RootState) => state.userAuthStore
    );
    //cartCount
    const cartCount: CartModel = useSelector(
        (state: RootState) => state.cartStore
    );

    const [cartInput, setCartInput] = useState({
        productDetailId: 0,
        quantity: 1,
    });

    useEffect(() => {
        ProductDetailPageServices.getProductDetailPage(slug || '').then((res) => {
            if (res.isSuccess) {
                setProduct(res.result.product);
                setImages(res.result.product.images);
                setProductDetails(res.result.productDetails);
                setProducts(res.result.products);
            } else {
                alert("cannot fetch.");
            }
        })
    }, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const tempData = inputHelper(e, cartInput);
        setCartInput(tempData);
        handleClearErrors();
    };

    const handleClearErrors = () => {
        setProductDetailIdError([]);
        setQuantityError([]);
    }

    const handleAddToCartSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (userData.id !== '') {
            CartServices.postAddToCart(userData.id, cartInput.productDetailId, cartInput.quantity).then((res) => {
                if (res.isSuccess) {
                    toast.success("Added to Cart Successfully.", {
                        autoClose: 2000,
                        theme: "colored",
                    });
                    const count = res.result;
                    dispatch(setCart({ count }));
                } else {
                    setProductDetailIdError(res.ProductDetailId);
                    setQuantityError(res.Quantity);
                }
            });
        } else {
            navigate("/");
        }
    }

    return (
        <section className='bg-white border-top py-5'>
            <div className='container'>
                <div className='row'>
                    <div className='col col-md-8'>
                        <div className='row'>
                            {images && images.map((image, index) => (
                                <div key={index} className='col-6'>
                                    <img src={`https://localhost:5000${image.imageUrl}`} alt={image.imageUrl}
                                        className="d-block w-100"></img>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='col col-md-4 px-md-5'>
                        <h2 className='fw-bold mb-4'>{product?.name}</h2>
                        {product?.saleoff && product?.saleoff > 0 ? (
                            <>
                                <h3 className="fw-bold mb-2 fs-6">
                                    <span className='text-decoration-line-through text-secondary'>{FormatCurrency(product?.price || 0)}</span>
                                    <span className='ms-3 bg-danger-subtle px-3 py-1 rounded-2'>-{product?.saleoff}%</span>
                                </h3>
                                <h3 className="fw-bold mb-4">{FormatCurrency(product?.price - product?.price * (product?.saleoff || 0) / 100 || 0)}</h3>
                            </>
                        ) : (
                            <h3 className="fw-bold mb-4">{FormatCurrency(product?.price || 0)}</h3>
                        )}
                        <h6>Color: </h6>
                        <h6 className='mb-4'>
                            <i className="bi bi-circle-fill me-2 fs-5" style={{ color: `${product?.color?.name}`, width: "10px" }}></i>
                            {product?.color?.name}
                        </h6>
                        <form onSubmit={(e) => handleAddToCartSubmit(e)}>
                            <h6>Size: </h6>
                            <p className='mb-4'>
                                {productDetails && productDetails.map((p, index) => (
                                    <span key={index}>
                                        <input id={`input${p.id}`} type="radio" name="productDetailId"
                                            className='d-none'
                                            value={p.id}
                                            checked={cartInput.productDetailId === p.id}
                                            onChange={(e) => handleInputChange(e)}
                                        />
                                        <label htmlFor={`input${p.id}`}
                                            className={`btn btn-outline-dark ${cartInput.productDetailId === p.id ? 'active' : ''} rounded-0 me-2 px-3 py-2`}
                                        >{p.size?.name}</label>
                                    </span>
                                ))}
                            </p>
                            {productDetailIdError && productDetailIdError.map((e, i) => (
                                <span className='text-danger' key={i}>{e}</span>
                            ))}
                            <h6>Quantity: </h6>
                            <div className='mb-5'>
                                <input type="number" className='form-control rounded-0 border border-dark fs-5 w-50'
                                    name='quantity'
                                    min={1} max={1000}
                                    value={cartInput.quantity}
                                    onChange={(e) => handleInputChange(e)}
                                />
                            </div>
                            {quantityError && quantityError.map((e, i) => (
                                <span className='text-danger' key={i}>{e}</span>
                            ))}
                            <div className='mb-5'>
                                <button type="submit" className='btn btn-dark rounded-0 w-100 py-3'>Add to Cart</button>
                            </div>
                        </form>
                        <div className="accordion accordion-flush border" id="accordionFlushExample">
                            <div className="accordion-item border">
                                <h2 className="accordion-header">
                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                                        Description
                                    </button>
                                </h2>
                                <div id="flush-collapseOne" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                                    <div className="accordion-body">
                                        {product?.description}
                                    </div>
                                </div>
                            </div>
                            <div className="accordion-item border">
                                <h2 className="accordion-header">
                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
                                        Accordion Item #2
                                    </button>
                                </h2>
                                <div id="flush-collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                                    <div className="accordion-body">Placeholder content for this accordion, which is intended to demonstrate the <code>.accordion-flush</code> class. This is the second item's accordion body. Let's imagine this being filled with some actual content.</div>
                                </div>
                            </div>
                            <div className="accordion-item border">
                                <h2 className="accordion-header">
                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
                                        Accordion Item #3
                                    </button>
                                </h2>
                                <div id="flush-collapseThree" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                                    <div className="accordion-body">Placeholder content for this accordion, which is intended to demonstrate the <code>.accordion-flush</code> class. This is the third item's accordion body. Nothing more exciting happening here in terms of content, but just filling up the space to make it look, at least at first glance, a bit more representative of how this would look in a real-world application.</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section >
    )
}

export default ProductDetailPage;