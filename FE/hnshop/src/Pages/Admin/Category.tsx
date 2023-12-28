import React, { useEffect, useState } from "react";
import { ICategory } from '../../Services/Interfaces/Interfaces';
import MUIDataTable from "mui-datatables";
import { MUIDataTableColumnDef } from "mui-datatables";
import AdminCategoryServices from "../../Services/Admin/AdminCategoryServices";
import { toast } from "react-toastify";
import Modal from 'react-modal';

const Category = () => {
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [category, setCategory] = useState<ICategory>({
        id: 0,
        name: "",
        urlName: "",
        description: "",
        createTime: "",
    });
    const [id, setId] = useState<number>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    useEffect(() => {
        Modal.setAppElement('body');
        AdminCategoryServices.getAdminCategory().then((res) => {
            if (res && res.isSuccess && res.result) {
                setCategories(res.result);
            } else {
                console.error(res);
                setCategories([]);
            }
        }).catch((error) => {
            console.error("Error fetching data:", error);
            setCategories([]);
        });
    }, [isModalOpen, isDeleteModalOpen]);

    const handleClick = (c: ICategory) => {
        setCategory(c);
        handleOpenModal();
    }

    const handleDeleteClick = (id: number) => {
        setId(id);
        handleOpenDeleteModal();
    }

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCategory({
            id: 0,
            name: "",
            urlName: "",
            description: "",
            createTime: "",
        });
        setNameErrors([]);
        setUrlNameErrors([]);
    }

    const handleOpenDeleteModal = () => {
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, inputName: string) => {
        setCategory((prevCategory) => ({
            ...prevCategory!,
            id: inputName === "id" ? parseInt(e.target.value, 10) || 0 : prevCategory?.id || 0,
            [inputName]: e.target.value,
        }));
        setNameErrors([]);
        setUrlNameErrors([]);
    };

    const data = categories.map((c) => [c.id, c.name, c.urlName, c.description, c.createTime, categories.indexOf(c)]);

    const columns: MUIDataTableColumnDef[] = [
        {
            name: "ID", options: {
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
            name: "Actions",
            options: {
                customBodyRender: (value: number) => (
                    <div style={{ textAlign: "start", paddingLeft: "10px" }}>
                        <button onClick={() => handleClick(categories[value])} type="button" className="btn btn-warning">
                            <i className="bi bi-pencil-square"></i>
                        </button>
                        <button onClick={() => handleDeleteClick(categories[value].id)} type="button" className="btn btn-danger ms-1">
                            <i className="bi bi-trash-fill"></i>
                        </button>
                    </div>
                ),
            },
        },
    ];

    const [nameErrors, setNameErrors] = useState<[]>([]);
    const [urlNameErrors, setUrlNameErrors] = useState<[]>([]);

    const handleSubmitCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const res = await AdminCategoryServices.postAdminCategoryCreate(category?.name || '', category?.urlName || '', category?.description || '');
        if (res.isSuccess) {
            handleCloseModal();
            toast.success("Added successfully.", {
                autoClose: 2000,
                theme: "colored",
            });
        } else {
            console.log(res);
            const nameErrors = res?.Name || [];
            const urlNameErrors = res?.UrlName || [];
            setNameErrors(nameErrors);
            setUrlNameErrors(urlNameErrors);
        }
    }

    const handleSubmitUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const res = await AdminCategoryServices.postAdminCategoryUpdate(category?.id || 0, category?.name || '', category?.urlName || '', category?.description || '');
        if (res.isSuccess) {
            handleCloseModal();
            toast.success("Updated Successfully.", {
                autoClose: 2000,
                theme: "colored",
            });
        } else {
            console.log(res);
            const nameErrors = res?.Name || [];
            const urlNameErrors = res?.UrlName || [];
            setNameErrors(nameErrors);
            setUrlNameErrors(urlNameErrors);
        }
    }

    const handleCategoryDelete = async (id: number) => {
        const res = await AdminCategoryServices.deleteAdminCategoryDelete(id);
        if (res.isSuccess) {
            handleCloseDeleteModal();
            toast.success("Deleted Successfully.", {
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
                <h4>Category Management</h4>
                <hr />
                <div className="mb-3">
                    <button type="button" className="btn btn-success px-3 py-2 fw-bold" onClick={handleOpenModal}>
                        <i className="bi bi-plus-circle"></i> Create
                    </button>
                </div>
                <div>
                    <MUIDataTable
                        title="Category List"
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
                        left: '30%',
                    },
                }}
                ariaHideApp={false}
            >
                <div>
                    <div className="row">
                        <div className="col">
                            {category.id !== 0 ? (
                                <h1>Update Category</h1>
                            ) : (
                                <h1>Add New Category</h1>
                            )}

                        </div>
                        <div className="col text-end">
                            <button className="btn btn-outline-dark rounded-0" onClick={handleCloseModal}><i className="bi bi-x-lg"></i></button>
                        </div>
                    </div>
                    <form onSubmit={(e) => { category.id !== 0 ? handleSubmitUpdate(e) : handleSubmitCreate(e) }}>
                        <div>
                            <label>Tên:</label>
                            <input
                                name="name"
                                value={category?.name || ""}
                                onChange={(e) => handleInputChange(e, "name")}
                                className={`form-control ${nameErrors.length > 0 ? 'mb-0' : 'mb-3'}`}
                            />
                            {nameErrors.length > 0 &&
                                nameErrors.map((x, index) => (
                                    <p key={index} className="text-danger m-0"> {x}</p>
                                ))}
                        </div>
                        <div>
                            <label>Url Name:</label>
                            <input
                                name="urlName"
                                value={category?.urlName || ""}
                                onChange={(e) => handleInputChange(e, "urlName")}
                                className={`form-control ${urlNameErrors.length > 0 ? 'mb-0' : 'mb-3'}`}
                            />
                            {urlNameErrors.length > 0 &&
                                urlNameErrors.map((x, index) => (
                                    <p key={index} className="text-danger m-0"> {x}</p>
                                ))}
                        </div>
                        <div>
                            <label>Description:</label>
                            <textarea
                                name="description"
                                value={category?.description || ""}
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
                                Close
                            </button>
                            {category.id !== 0 ? (
                                <button type="submit" className="btn btn-warning w-25 rounded-0 ms-2">
                                    Save
                                </button>
                            ) : (
                                <button type="submit" className="btn btn-success w-25 rounded-0 ms-2">
                                    Add
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
                        <button onClick={() => handleCategoryDelete(id || 0)} type="button" className="btn btn-danger w-25 rounded-0 ms-1">Delete</button>
                    </div>
                </div>
            </Modal>

        </div >
    )
}

export default Category;