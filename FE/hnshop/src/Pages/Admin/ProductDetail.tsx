import React, { useEffect, useState } from "react";
import { IColor, IProductDetail, ISubCategory } from '../../Services/Interfaces/Interfaces';
import MUIDataTable from "mui-datatables";
import { MUIDataTableColumnDef } from "mui-datatables";
import { toast } from "react-toastify";
import Modal from 'react-modal';
import { IProduct } from '../../Services/Interfaces/Interfaces';
import AdminProductServices from '../../Services/Admin/AdminProductServices';
import AdminProductDetailServices from './../../Services/Admin/AdminProductDetailServices';

const ProductDetail = () => {
    const [productDetails, setProductDetails] = useState<IProductDetail[]>([]);
    const [products, setProducts] = useState<IProduct[]>([]);
    const [sizes, setSizes] = useState<IColor[]>([]);
    const [productDetail, setProductDetail] = useState<IProductDetail>({
        id: 0,
        quantity: 0,
        productId: 0,
        sizeId: 0,
        createTime: ""
    });
    const [id, setId] = useState<number>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    useEffect(() => {
        Modal.setAppElement('body');
        AdminProductDetailServices.getAdminProductDetail().then((res) => {
            if (res.isSuccess) {
                setProductDetails(res.result.productDetails);
                setProducts(res.result.products);
                setSizes(res.result.sizes);
            } else {
                console.error(res);
            }
        }).catch((error) => {
            console.error("Error fetching data:", error);
            setProductDetails([]);
            setProducts([]);
            setSizes([]);
        });
    }, [isModalOpen, isDeleteModalOpen]);

    const handleClick = (c: IProductDetail) => {
        if (c !== undefined) {
            setProductDetail(c);
            handleOpenModal();
        } else {
            console.error("Invalid object or id property is undefined");
        }
    };

    const [productIdErrors, setProductIdErrors] = useState<[]>([]);
    const [sizeIdErrors, setSizeIdErrors] = useState<[]>([]);
    const [quantityErrors, setQuantityErrors] = useState<[]>([]);

    const handleClearErrors = () => {
        setProductIdErrors([]);
        setSizeIdErrors([]);
        setQuantityErrors([]);
    }

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setProductDetail({
            id: 0,
            quantity: 0,
            productId: 0,
            sizeId: 0,
            createTime: "",

        });
        handleClearErrors();
    }

    const handleOpenDeleteModal = () => {
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
        inputName: string
    ) => {
        setProductDetail((prevProductDetail) => ({
            ...prevProductDetail!,
            id: inputName === "id" ? parseInt(e.target.value, 10) || 0 : prevProductDetail?.id || 0,
            quantity: inputName === "quantity" ? parseInt(e.target.value, 10) || 0 : prevProductDetail?.quantity || 0,
            productId:
                inputName === "productId" ? parseInt(e.target.value, 10) || 0 : prevProductDetail?.productId || 0,
            sizeId:
                inputName === "sizeId" ? parseInt(e.target.value, 10) || 0 : prevProductDetail?.sizeId || 0,
            [inputName]: e.target.value,
        }));
        handleClearErrors();
    };

    const data = productDetails.map((c) => [c.id, c.product?.name, c.size?.name, c.quantity, c.createTime, productDetails.indexOf(c)]);

    const columns: MUIDataTableColumnDef[] = [
        {
            name: "Id", options: {
                customBodyRender: (value: number) => (
                    <div style={{ textAlign: "start", paddingLeft: "30px" }}>{value}</div>
                ),
            },
        },
        {
            name: "Product", options: {
                customBodyRender: (value: number) => (
                    <div style={{ textAlign: "start", paddingLeft: "20px" }}>{value}</div>
                ),
            },
        },
        {
            name: "Size", options: {
                customBodyRender: (value: number) => (
                    <div style={{ textAlign: "start", paddingLeft: "20px" }}>{value}</div>
                ),
            },
        },
        {
            name: "Quantity", options: {
                customBodyRender: (value: number) => (
                    <div style={{ textAlign: "start", paddingLeft: "20px" }}>{value}</div>
                ),
            },
        },
        {
            name: "CreateTime", label: "Create Time", options: {
                customBodyRender: (value: number) => (
                    <div style={{ textAlign: "start", paddingLeft: "20px" }}>{value}</div>
                ),
            },
        },
        {
            name: "Actions",
            options: {
                customBodyRender: (value: number) => (
                    <div style={{ textAlign: "start", paddingLeft: "10px" }}>
                        <button onClick={() => handleClick(productDetails[value])} type="button" className="btn btn-warning">
                            <i className="bi bi-pencil-square"></i>
                        </button>
                        <button onClick={() => handleDeleteClick(productDetails[value].id)} type="button" className="btn btn-danger ms-1">
                            <i className="bi bi-trash-fill"></i>
                        </button>
                    </div>
                ),
            },
        },
    ];

    const handleSubmitCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log(productDetail);
        const res = await AdminProductDetailServices.postAdminProductDetailCreate(productDetail?.productId || 0, productDetail?.sizeId || 0, productDetail.quantity || 0);
        if (res.isSuccess) {
            handleCloseModal();
            toast.success("Thêm mới thành công.", {
                autoClose: 2000,
                theme: "colored",
            });
        } else {
            console.log(res);
            setProductIdErrors(res?.ProductId || []);
            setSizeIdErrors(res?.SizeId || []);
            setQuantityErrors(res?.Quantity || []);
        }
    }

    const handleSubmitUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log(productDetail);
        const res = await AdminProductDetailServices.postAdminProductDetailUpdate(productDetail.id || 0, productDetail?.productId || 0, productDetail?.sizeId || 0, productDetail.quantity || 0);
        console.log(res);
        if (res.isSuccess) {
            handleCloseModal();
            toast.success("Cập nhật thành công.", {
                autoClose: 2000,
                theme: "colored",
            });
        } else {
            console.log(res);
            setProductIdErrors(res?.ProductId || []);
            setSizeIdErrors(res?.SizeId || []);
            setQuantityErrors(res?.Quantity || []);
        }
    }

    const handleDeleteClick = (id: number) => {
        setId(id);
        handleOpenDeleteModal();
    }

    const handleProductDetailDelete = async (id: number) => {
        const res = await AdminProductDetailServices.deleteAdminProductDetailDelete(id);
        if (res.isSuccess) {
            handleCloseDeleteModal();
            toast.success("Đã  thành công.", {
                autoClose: 2000,
                theme: "colored",
            });
        } else {
            console.log(res);
        }
    }

    return (
        <div className="border">
            <div className="custom-border-top p-3 bg-white">
                <h4>ProductDetail Management</h4>
                <hr />
                <div className="mb-3">
                    <button type="button" className="btn btn-success px-3 py-2 fw-bold" onClick={handleOpenModal}>
                        <i className="bi bi-plus-circle"></i> Create
                    </button>
                </div>
                <div>
                    <MUIDataTable
                        title="ProductDetail List"
                        data={data}
                        columns={columns}
                        options={{
                            selectableRows: "none",
                            responsive: "standard",
                            pagination: true,
                            filter: true,
                            search: true,
                            download: true,
                            print: true,
                            viewColumns: true,
                            rowsPerPage: 10,
                            rowsPerPageOptions: [10, 25, 50, 100],
                            elevation: 2,
                        }}
                    />
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={handleCloseModal}
                style={{
                    content: {
                        width: '800px',
                        height: '320px',
                        top: '50px',
                        left: '450px',
                    },
                }}
                ariaHideApp={false}
            >
                <div>
                    <div className="row">
                        <div className="col">
                            {productDetail.id !== 0 ? (
                                <h1>Cập nhật</h1>
                            ) : (
                                <h1>Thêm mới</h1>
                            )}

                        </div>
                        <div className="col text-end">
                            <button className="btn btn-outline-dark rounded-0" onClick={handleCloseModal}><i className="bi bi-x-lg"></i></button>
                        </div>
                    </div>
                    <form onSubmit={(e) => { productDetail.id !== 0 ? handleSubmitUpdate(e) : handleSubmitCreate(e) }}>

                        <div className="row">
                            <div className="col">
                                <div>
                                    <label>Product:</label>
                                    <select
                                        aria-label="Default select example"
                                        onChange={(e) => handleInputChange(e, "productId")}
                                        name="productId"
                                        className={`form-select ${productIdErrors.length > 0 ? 'mb-0' : 'mb-3'}`}
                                        value={productDetail.productId || 0}
                                    >
                                        <option value={0}>Select a Product</option>
                                        {products &&
                                            products.map((c, index) => (
                                                <option key={index} value={c.id}>
                                                    {c.name}
                                                </option>
                                            ))}
                                    </select>
                                    {productIdErrors.length > 0 &&
                                        productIdErrors.map((x, index) => (
                                            <p key={index} className="text-danger m-0"> {x}</p>
                                        ))}
                                </div>
                            </div>
                            <div className="col">
                                <div>
                                    <label>Size:</label>
                                    <select
                                        aria-label="Default select example"
                                        onChange={(e) => handleInputChange(e, "sizeId")}
                                        name="sizeId"
                                        className={`form-select ${sizeIdErrors.length > 0 ? 'mb-0' : 'mb-3'}`}
                                        value={productDetail.sizeId || 0}
                                    >
                                        <option value={0}>Select a Size</option>
                                        {sizes &&
                                            sizes.map((c, index) => (
                                                <option key={index} value={c.id}>
                                                    {c.name}
                                                </option>
                                            ))}
                                    </select>
                                    {sizeIdErrors.length > 0 &&
                                        sizeIdErrors.map((x, index) => (
                                            <p key={index} className="text-danger m-0"> {x}</p>
                                        ))}
                                </div>
                            </div>
                        </div>
                        <div>
                            <label>Quantity:</label>
                            <input
                                name="quantity"
                                value={productDetail?.quantity || 0}
                                onChange={(e) => handleInputChange(e, "quantity")}
                                className={`form-control ${quantityErrors.length > 0 ? 'mb-0' : 'mb-3'}`}
                            />
                            {quantityErrors.length > 0 &&
                                quantityErrors.map((x, index) => (
                                    <p key={index} className="text-danger m-0"> {x}</p>
                                ))}
                        </div>
                        <div className="text-end">
                            <button
                                onClick={handleCloseModal}
                                type="button"
                                className="btn btn-outline-dark w-25 rounded-0"
                            >
                                Đóng
                            </button>
                            {productDetail.id !== 0 ? (
                                <button type="submit" className="btn btn-warning w-25 rounded-0 ms-2">
                                    Lưu
                                </button>
                            ) : (
                                <button type="submit" className="btn btn-success w-25 rounded-0 ms-2">
                                    Thêm
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </Modal>
            {/* delete modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onRequestClose={handleCloseDeleteModal}
                style={{
                    content: {
                        width: '600px',
                        height: '220px',
                        top: '50px',
                        left: '35%',
                    },
                }}
                ariaHideApp={false}
            >
                <div>
                    <div className="modal-header border-bottom pb-3">
                        <h1 className="modal-title fs-5"></h1>
                        <button type="button" className="btn-close" onClick={handleCloseDeleteModal} aria-label="Close"></button>
                    </div>
                    <div className="modal-body py-4">
                        Bạn có chắc muốn  dòng này?
                    </div>
                    <div className="modal-footer border-top pt-3">
                        <button type="button" className="btn btn-outline-dark w-25 rounded-0" onClick={handleCloseDeleteModal}>Đóng</button>
                        <button onClick={() => handleProductDetailDelete(id || 0)} type="button" className="btn btn-danger w-25 rounded-0 ms-1">Xoá</button>
                    </div>
                </div>
            </Modal>
        </div >
    )
}

export default ProductDetail;