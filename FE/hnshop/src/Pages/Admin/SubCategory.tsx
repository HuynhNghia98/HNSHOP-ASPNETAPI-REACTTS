import React, { useEffect, useState } from "react";
import { ICategory, ISubCategory } from '../../Services/Interfaces/Interfaces';
import MUIDataTable from "mui-datatables";
import { MUIDataTableColumnDef } from "mui-datatables";
import { toast } from "react-toastify";
import Modal from 'react-modal';
import AdminSubCategoryServices from "../../Services/Admin/AdminSubCategoryServices";

const SubCategory = () => {
    const [subCategories, setSubCategories] = useState<ISubCategory[]>([]);
    const [categories, setcategories] = useState<ICategory[]>([]);
    const [subCategory, setSubCategory] = useState<ISubCategory>({
        id: 0,
        name: "",
        urlName: "",
        description: "",
        createTime: "",
        categoryId: 0,
        category: undefined,
    });

    const [id, setId] = useState<number>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    useEffect(() => {
        Modal.setAppElement('body');
        AdminSubCategoryServices.getAdminSubCategory().then((res) => {
            if (res.isSuccess) {
                setSubCategories(res.result.subCategories);
                setcategories(res.result.categories);
            } else {
                console.error(res);
            }
        }).catch((error) => {
            console.error("Error fetching data:", error);
            setSubCategories([]);
        });
    }, [isModalOpen, isDeleteModalOpen]);

    const handleClick = (c: ISubCategory) => {
        if (c !== undefined) {
            setSubCategory(c);
            handleOpenModal();
        } else {
            console.error("Invalid object or id property is undefined");
        }
    };

    const handleDeleteClick = (id: number) => {
        setId(id);
        handleOpenDeleteModal();
    }

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSubCategory({
            id: 0,
            name: "",
            urlName: "",
            description: "",
            createTime: "",
            categoryId: 0,
            category: undefined,
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
        setSubCategory((prevSubCategory) => ({
            ...prevSubCategory!,
            id: inputName === "id" ? parseInt(e.target.value, 10) || 0 : prevSubCategory?.id || 0,
            categoryId:
                inputName === "categoryId" ? parseInt(e.target.value, 10) || 0 : prevSubCategory?.categoryId || 0,
            [inputName]: e.target.value,
        }));
        handleClearErrors();
    };

    const data = subCategories.map((c) => [c.id, c.name, c.urlName, c.description, c.createTime, c.category?.name, subCategories.indexOf(c)]);

    const columns: MUIDataTableColumnDef[] = [
        {
            name: "Id", options: {
                customBodyRender: (value: number) => (
                    <div style={{ textAlign: "start", paddingLeft: "30px" }}>{value}</div>
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
            name: "UrlName", options: {
                customBodyRender: (value: number) => (
                    <div style={{ textAlign: "start", paddingLeft: "20px" }}>{value}</div>
                ),
            },
        },
        {
            name: "Des", label: "Description", options: {
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
            name: "CategoryId",
            label: "Category",
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
                        <button onClick={() => handleClick(subCategories[value])} type="button" className="btn btn-warning">
                            <i className="bi bi-pencil-square"></i>
                        </button>
                        <button onClick={() => handleDeleteClick(subCategories[value].id)} type="button" className="btn btn-danger ms-1">
                            <i className="bi bi-trash-fill"></i>
                        </button>
                    </div>
                ),
            },
        },
    ];

    const handleClearErrors = () => {
        setNameErrors([]);
        setUrlNameErrors([]);
        setCategoryIdErrors([]);
    }

    const [nameErrors, setNameErrors] = useState<[]>([]);
    const [urlNameErrors, setUrlNameErrors] = useState<[]>([]);
    const [categoryIdErrors, setCategoryIdErrors] = useState<[]>([]);

    const handleSubmitCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log(subCategory)
        const res = await AdminSubCategoryServices.postAdminSubCategoryCreate(subCategory?.name || '', subCategory?.urlName || '', subCategory?.description || '', subCategory?.categoryId || 0);
        if (res.isSuccess) {
            handleCloseModal();
            toast.success("Thêm mới thành công.", {
                autoClose: 2000,
                theme: "colored",
            });
        } else {
            console.log(res);
            setNameErrors(res?.Name || []);
            setUrlNameErrors(res?.UrlName || []);
            setCategoryIdErrors(res?.CategoryId || []);
        }
    }

    const handleSubmitUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log(subCategory)
        const res = await AdminSubCategoryServices.postAdminSubCategoryUpdate(subCategory?.id || 0, subCategory?.name || '', subCategory?.urlName || '', subCategory?.description || '', subCategory?.categoryId || 0);
        console.log(res);
        if (res.isSuccess) {
            handleCloseModal();
            toast.success("Cập nhật thành công.", {
                autoClose: 2000,
                theme: "colored",
            });
        } else {
            console.log(res);
            setNameErrors(res?.Name || []);
            setUrlNameErrors(res?.UrlName || []);
            setCategoryIdErrors(res?.CategoryId || []);
        }
    }

    const handleCategoryDelete = async (id: number) => {
        const res = await AdminSubCategoryServices.deleteAdminSubCategoryDelete(id);
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
                <h4>SubCategory Management</h4>
                <hr />
                <div className="mb-3">
                    <button type="button" className="btn btn-success px-3 py-2 fw-bold" onClick={handleOpenModal}>
                        <i className="bi bi-plus-circle"></i> Create
                    </button>
                </div>
                <div>
                    <MUIDataTable
                        title="SubCategory List"
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
                        height: '490px',
                        top: '50px',
                        left: '450px',
                    },
                }}
                ariaHideApp={false}
            >
                <div>
                    <div className="row">
                        <div className="col">
                            {subCategory.id !== 0 ? (
                                <h1>Cập nhật</h1>
                            ) : (
                                <h1>Thêm mới</h1>
                            )}

                        </div>
                        <div className="col text-end">
                            <button className="btn btn-outline-dark rounded-0" onClick={handleCloseModal}><i className="bi bi-x-lg"></i></button>
                        </div>
                    </div>
                    <form onSubmit={(e) => { subCategory.id !== 0 ? handleSubmitUpdate(e) : handleSubmitCreate(e) }}>
                        <div>
                            <label>Tên:</label>
                            <input
                                name="name"
                                value={subCategory?.name || ""}
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
                                    <label>Url Name:</label>
                                    <input
                                        name="urlName"
                                        value={subCategory?.urlName || ""}
                                        onChange={(e) => handleInputChange(e, "urlName")}
                                        className={`form-control ${urlNameErrors.length > 0 ? 'mb-0' : 'mb-3'}`}
                                    />
                                    {urlNameErrors.length > 0 &&
                                        urlNameErrors.map((x, index) => (
                                            <p key={index} className="text-danger m-0"> {x}</p>
                                        ))}
                                </div>
                            </div>
                            <div className="col">
                                <div>
                                    <label>Category:</label>
                                    <select
                                        onChange={(e) => handleInputChange(e, "categoryId")}
                                        name="categoryId"
                                        className={`form-select ${categoryIdErrors.length > 0 ? 'mb-0' : 'mb-3'}`}
                                        value={subCategory.categoryId || 0}
                                    >
                                        <option value={0}>Select a category</option>
                                        {categories &&
                                            categories.map((c, index) => (
                                                <option key={index} value={c.id}>
                                                    {c.name}
                                                </option>
                                            ))}
                                    </select>
                                    {categoryIdErrors.length > 0 &&
                                        categoryIdErrors.map((x, index) => (
                                            <p key={index} className="text-danger m-0"> {x}</p>
                                        ))}
                                </div>
                            </div>
                        </div>
                        <div>
                            <label>Description:</label>
                            <textarea
                                name="description"
                                value={subCategory?.description || ""}
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
                            {subCategory.id !== 0 ? (
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
                        <h1 className="modal-title fs-5"></h1>
                        <button type="button" className="btn-close" onClick={handleCloseDeleteModal} aria-label="Close"></button>
                    </div>
                    <div className="modal-body py-4">
                        Bạn có chắc muốn  dòng này?
                    </div>
                    <div className="modal-footer border-top pt-3">
                        <button type="button" className="btn btn-outline-dark w-25 rounded-0" onClick={handleCloseDeleteModal}>Đóng</button>
                        <button onClick={() => handleCategoryDelete(id || 0)} type="button" className="btn btn-danger w-25 rounded-0 ms-1">Xoá</button>
                    </div>
                </div>
            </Modal>

        </div >
    )
}

export default SubCategory;