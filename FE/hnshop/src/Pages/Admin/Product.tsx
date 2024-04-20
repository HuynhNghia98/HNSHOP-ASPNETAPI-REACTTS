import React, { useEffect, useState } from "react";
import { IColor, ISubCategory } from '../../Services/Interfaces/Interfaces';
import MUIDataTable from "mui-datatables";
import { MUIDataTableColumnDef } from "mui-datatables";
import { toast } from "react-toastify";
import Modal from 'react-modal';
import { IProduct } from '../../Services/Interfaces/Interfaces';
import AdminProductServices from './../../Services/Admin/AdminProductServices';

const Product = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [colors, setColors] = useState<IColor[]>([]);
    const [subCategories, setSubCategories] = useState<ISubCategory[]>([]);
    const [product, setProduct] = useState<IProduct>({
        id: 0,
        name: "",
        price: 0,
        saleoff: 0,
        slug: "",
        description: "",
        createTime: "",
        subCategoryId: 0,
        colorId: 0,
        images: [],
        rating: 0
    });
    const [files, setFiles] = useState<File[]>([]);
    const [id, setId] = useState<number>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    useEffect(() => {
        Modal.setAppElement('body');
        AdminProductServices.getAdminProduct().then((res) => {
            if (res.isSuccess) {
                setProducts(res.result.products);
                setSubCategories(res.result.subCategories);
                setColors(res.result.colors)
            } else {
                console.error(res);
            }
        }).catch((error) => {
            setSubCategories([]);
        });
    }, [isModalOpen, isDeleteModalOpen]);

    const handleClick = (c: IProduct) => {
        if (c !== undefined) {
            setProduct(c);
            handleOpenModal();
        } else {
            console.error("Invalid object or id property is undefined");
        }
    };

    const handleClearErrors = () => {
        setNameErrors([]);
        setPriceErrors([]);
        setSubCategoryIdErrors([]);
        setColorIdErrors([]);
    }

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setFiles([]);
        setIsModalOpen(false);
        setProduct({
            id: 0,
            name: "",
            price: 0,
            saleoff: 0,
            slug: "",
            description: "",
            createTime: "",
            subCategoryId: 0,
            colorId: 0,
            images: [],
            rating: 0
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
        setProduct((prevProduct) => ({
            ...prevProduct!,
            id: inputName === "id" ? parseInt(e.target.value, 10) || 0 : prevProduct?.id || 0,
            price: inputName === "price" ? parseInt(e.target.value, 10) || 0 : prevProduct?.price || 0,
            saleoff: inputName === "saleoff" ? parseInt(e.target.value, 10) || 0 : prevProduct?.saleoff || 0,
            subCategoryId:
                inputName === "subCategoryId" ? parseInt(e.target.value, 10) || 0 : prevProduct?.subCategoryId || 0,
            colorId:
                inputName === "colorId" ? parseInt(e.target.value, 10) || 0 : prevProduct?.colorId || 0,
            [inputName]: e.target.value,
        }));
        handleClearErrors();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const validImgTypes = ["jpeg", "jpg", "png"];
            const selectedFiles = Array.from(files);
            const isValidFiles = selectedFiles.every((file) => {
                const imgType = file.type.split("/")[1];
                return validImgTypes.includes(imgType);
            });

            if (isValidFiles) {
                setFiles(selectedFiles);
            } else {
                alert("Chỉ chấp nhận các file ảnh có định dạng jpeg, jpg, png");
                setFiles([]);
            }
        }
    };
    const data = products.map((c) => [c.id, c.images?.[0]?.imageUrl || "", c.name, c.price, c.saleoff, c.subCategory?.name, c.color?.name, products.indexOf(c)]);

    const columns: MUIDataTableColumnDef[] = [
        {
            name: "Id", options: {
                customBodyRender: (value: number) => (
                    <div style={{ textAlign: "start", paddingLeft: "30px" }}>{value}</div>
                ),
            },
        },
        {
            name: "Image", label: "Image", options: {
                customBodyRender: (value: string) => (
                    <div style={{ textAlign: "start" }}>
                        <img src={`https://localhost:5000${value}`} alt={value}
                            className="img-fluid" style={{ width: "100px" }}
                        ></img>
                    </div>
                ),
            },
        },
        {
            name: "Name", options: {
                customBodyRender: (value: number) => (
                    <div style={{ textAlign: "start", paddingLeft: "20px" }}>{value}</div>
                ),
            },
        },
        {
            name: "Price", options: {
                customBodyRender: (value: number) => (
                    <div style={{ textAlign: "start", paddingLeft: "20px" }}>{value}</div>
                ),
            },
        },
        {
            name: "Saleoff", options: {
                customBodyRender: (value: number) => (
                    <div style={{ textAlign: "start", paddingLeft: "20px" }}>{value}</div>
                ),
            },
        },
        {
            name: "SubCategoryId",
            label: "SubCategory",
            options: {
                customBodyRender: (value: string) => (
                    <div style={{ textAlign: "start", paddingLeft: "20px" }}>{value}</div>
                ),
            },
        },
        {
            name: "ColorId",
            label: "Color",
            options: {
                customBodyRender: (value: string) => (
                    <div style={{ textAlign: "start", paddingLeft: "20px" }}>{value}</div>
                ),
            },
        },
        {
            name: "Actions",
            options: {
                customBodyRender: (value: number) => (
                    <div style={{ textAlign: "start", paddingLeft: "10px" }}>
                        <button onClick={() => handleClick(products[value])} type="button" className="btn btn-warning">
                            <i className="bi bi-pencil-square"></i>
                        </button>
                        <button onClick={() => handleDeleteClick(products[value].id)} type="button" className="btn btn-danger ms-1">
                            <i className="bi bi-trash-fill"></i>
                        </button>
                    </div>
                ),
            },
        },
    ];

    const [nameErrors, setNameErrors] = useState<[]>([]);
    const [priceErrors, setPriceErrors] = useState<[]>([]);
    const [subCategoryIdErrors, setSubCategoryIdErrors] = useState<[]>([]);
    const [colorIdErrors, setColorIdErrors] = useState<[]>([]);

    const handleSubmitCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log(product);
        console.log(files);
        const res = await AdminProductServices.postAdminProductCreate(product?.name || '', product?.price || 0, product?.saleoff || 0, product?.description || '', product?.subCategoryId || 0, product?.colorId || 0, files || []);
        if (res.isSuccess) {
            handleCloseModal();
            toast.success("Add New Successfully", {
                autoClose: 2000,
                theme: "colored",
            });
        } else {
            console.log(res);
            setNameErrors(res?.Name || []);
            setPriceErrors(res?.Price || []);
            setSubCategoryIdErrors(res?.SubCategoryId || []);
            setColorIdErrors(res?.ColorId || []);
        }
    }

    const handleSubmitUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log(product);
        const res = await AdminProductServices.postAdminProductUpdate(product?.id || 0, product?.name || '', product?.price || 0, product?.saleoff || 0, product?.description || '', product?.subCategoryId || 0, product?.colorId || 0, files || []);
        console.log(res);
        if (res.isSuccess) {
            handleCloseModal();
            toast.success("Updated Successfully", {
                autoClose: 2000,
                theme: "colored",
            });
        } else {
            console.log(res);
            setNameErrors(res?.Name || []);
            setPriceErrors(res?.Price || []);
            setSubCategoryIdErrors(res?.SubCategoryId || []);
            setColorIdErrors(res?.ColorId || []);
        }
    }

    const handleDeleteClick = (id: number) => {
        setId(id);
        handleOpenDeleteModal();
    }

    const handleProductDelete = async (id: number) => {
        const res = await AdminProductServices.deleteAdminProductDelete(id);
        if (res.isSuccess) {
            handleCloseDeleteModal();
            toast.success("Deleted Successfully", {
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
                <h4>Product Management</h4>
                <hr />
                <div className="mb-3">
                    <button type="button" className="btn btn-success px-3 py-2 fw-bold" onClick={handleOpenModal}>
                        <i className="bi bi-plus-circle"></i> Create
                    </button>
                </div>
                <div>
                    <MUIDataTable
                        title="Product List"
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
                        height: '650px',
                        top: '20px',
                        left: '27%',
                    },
                }}
                ariaHideApp={false}
            >
                <div>
                    <div className="row">
                        <div className="col">
                            {product.id !== 0 ? (
                                <h1>Update</h1>
                            ) : (
                                <h1>Add New</h1>
                            )}

                        </div>
                        <div className="col text-end">
                            <button className="btn btn-outline-dark rounded-0" onClick={handleCloseModal}><i className="bi bi-x-lg"></i></button>
                        </div>
                    </div>
                    <form onSubmit={(e) => { product.id !== 0 ? handleSubmitUpdate(e) : handleSubmitCreate(e) }}>
                        <div>
                            <label>Name:</label>
                            <input
                                name="name"
                                value={product?.name || ""}
                                onChange={(e) => handleInputChange(e, "name")}
                                className={`form-control ${nameErrors.length > 0 ? 'mb-0' : 'mb-3'}`}
                            />
                            {nameErrors.length > 0 &&
                                nameErrors.map((x, index) => (
                                    <p key={index} className="text-danger m-0"> {x}</p>
                                ))}
                        </div>
                        <div className="row">
                            <div className="col">
                                <div>
                                    <label>Price:</label>
                                    <input
                                        name="price"
                                        value={product?.price || 0}
                                        onChange={(e) => handleInputChange(e, "price")}
                                        className={`form-control ${priceErrors.length > 0 ? 'mb-0' : 'mb-3'}`}
                                    />
                                    {priceErrors.length > 0 &&
                                        priceErrors.map((x, index) => (
                                            <p key={index} className="text-danger m-0"> {x}</p>
                                        ))}
                                </div>
                            </div>
                            <div className="col">
                                <div>
                                    <label>Saleoff:</label>
                                    <input
                                        name="saleoff"
                                        value={product?.saleoff || 0}
                                        onChange={(e) => handleInputChange(e, "saleoff")}
                                        className="form-control mb-3"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <div>
                                    <label>SubCategory:</label>
                                    <select
                                        onChange={(e) => handleInputChange(e, "subCategoryId")}
                                        name="subCategoryId"
                                        className={`form-select ${subCategoryIdErrors.length > 0 ? 'mb-0' : 'mb-3'}`}
                                        value={product.subCategoryId || 0}
                                    >
                                        <option value={0}>Select a SubCategory</option>
                                        {subCategories &&
                                            subCategories.map((c, index) => (
                                                <option key={index} value={c.id}>
                                                    {c.name}
                                                </option>
                                            ))}
                                    </select>
                                    {subCategoryIdErrors.length > 0 &&
                                        subCategoryIdErrors.map((x, index) => (
                                            <p key={index} className="text-danger m-0"> {x}</p>
                                        ))}
                                </div>
                            </div>
                            <div className="col">
                                <div>
                                    <label>Color:</label>
                                    <select
                                        onChange={(e) => handleInputChange(e, "colorId")}
                                        name="colorId"
                                        className={`form-select ${colorIdErrors.length > 0 ? 'mb-0' : 'mb-3'}`}
                                        value={product.colorId || 0}
                                    >
                                        <option value={0}>Select a Color</option>
                                        {colors &&
                                            colors.map((c, index) => (
                                                <option key={index} value={c.id}>
                                                    {c.name}
                                                </option>
                                            ))}
                                    </select>
                                    {colorIdErrors.length > 0 &&
                                        colorIdErrors.map((x, index) => (
                                            <p key={index} className="text-danger m-0"> {x}</p>
                                        ))}
                                </div>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label>Images:</label>
                            <input
                                type="file"
                                className="form-control"
                                multiple
                                onChange={(e) => handleFileChange(e)}
                            />
                            <div className="row mt-3">
                                {product.images && product.images.map((image, index) => (
                                    <div key={index} className="col-3">
                                        <img src={`https://localhost:5000${image.imageUrl}`} alt={image.imageUrl}
                                            className="img-fluid"
                                        ></img>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label>Slug:</label>
                            <input
                                disabled
                                value={product?.slug || ""}
                                className="form-control mb-3"
                            />
                        </div>
                        <div>
                            <label>Description:</label>
                            <textarea
                                name="description"
                                value={product?.description || ""}
                                onChange={(e) => handleInputChange(e, "description")}
                                className="form-control mb-3"
                                rows={5}
                            ></textarea>
                        </div>
                        <div className="text-end">
                            <button
                                onClick={handleCloseModal}
                                type="button"
                                className="btn btn-outline-dark w-25 rounded-0"
                            >
                                Đóng
                            </button>
                            {product.id !== 0 ? (
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
                        left: '35%',
                    },
                }}
                ariaHideApp={false}
            >
                <div>
                    <div className="modal-header border-bottom pb-3">
                        <h1 className="modal-title fs-5">Delete</h1>
                        <button type="button" className="btn-close" onClick={handleCloseDeleteModal} aria-label="Close"></button>
                    </div>
                    <div className="modal-body py-4">
                        Are you sure you want to delete this line?
                    </div>
                    <div className="modal-footer border-top pt-3">
                        <button type="button" className="btn btn-outline-dark w-25 rounded-0" onClick={handleCloseDeleteModal}>Close</button>
                        <button onClick={() => handleProductDelete(id || 0)} type="button" className="btn btn-danger w-25 rounded-0 ms-1">Delete</button>
                    </div>
                </div>
            </Modal>

        </div >
    )
}

export default Product;