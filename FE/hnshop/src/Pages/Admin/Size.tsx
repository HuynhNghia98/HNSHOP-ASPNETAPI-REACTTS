import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { MUIDataTableColumnDef } from "mui-datatables";
import { toast } from "react-toastify";
import Modal from 'react-modal';
import { ISize } from '../../Services/Interfaces/Interfaces';
import AdminSizeServices from "../../Services/Admin/AdminSizeServices";

const Size = () => {
    const [sizes, setSizes] = useState<ISize[]>([]);
    const [size, setSize] = useState<ISize>({
        id: 0,
        name: "",
    });
    const [id, setId] = useState<number>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    useEffect(() => {
        Modal.setAppElement('body');
        AdminSizeServices.getAdminSize().then((res) => {
            if (res && res.isSuccess && res.result) {
                setSizes(res.result);
            } else {
                console.error(res);
                setSizes([]);
            }
        }).catch((error) => {
            console.error("Error fetching data:", error);
            setSizes([]);
        });
    }, [isModalOpen, isDeleteModalOpen]);

    const handleClick = (c: ISize) => {
        setSize(c);
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
        setSize({
            id: 0,
            name: "",
        });
        setNameErrors([]);
    }

    const handleOpenDeleteModal = () => {
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, inputName: string) => {
        setSize((prevSize) => ({
            ...prevSize!,
            id: inputName === "id" ? parseInt(e.target.value, 10) || 0 : prevSize?.id || 0,
            [inputName]: e.target.value,
        }));
        setNameErrors([]);
    };

    const data = sizes.map((c) => [c.id, c.name, sizes.indexOf(c)]);

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
            name: "Actions",
            options: {
                customBodyRender: (value: number) => (
                    <div style={{ textAlign: "start", paddingLeft: "10px" }}>
                        <button onClick={() => handleClick(sizes[value])} type="button" className="btn btn-warning">
                            <i className="bi bi-pencil-square"></i>
                        </button>
                        <button onClick={() => handleDeleteClick(sizes[value].id)} type="button" className="btn btn-danger ms-1">
                            <i className="bi bi-trash-fill"></i>
                        </button>
                    </div>
                ),
            },
        },
    ];

    const [nameErrors, setNameErrors] = useState<[]>([]);

    const handleSubmitCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const res = await AdminSizeServices.postAdminSizeCreate(size?.name || '');
        if (res.isSuccess) {
            handleCloseModal();
            toast.success("Thêm mới thành công.", {
                autoClose: 2000,
                theme: "colored",
            });
        } else {
            console.log(res);
            const nameErrors = res?.Name || [];
            setNameErrors(nameErrors);
        }
    }

    const handleSubmitUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const res = await AdminSizeServices.postAdminSizeUpdate(size?.id || 0, size?.name || '');
        if (res.isSuccess) {
            handleCloseModal();
            toast.success("Cập nhật thành công.", {
                autoClose: 2000,
                theme: "colored",
            });
        } else {
            console.log(res);
            setNameErrors(res?.Name || []);
        }
    }

    const handleSizeDelete = async (id: number) => {
        const res = await AdminSizeServices.deleteAdminSizeDelete(id);
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
                <h4>Size Management</h4>
                <hr />
                <div className="mb-3">
                    <button type="button" className="btn btn-success px-3 py-2 fw-bold" onClick={handleOpenModal}>
                        <i className="bi bi-plus-circle"></i> Create
                    </button>
                </div>
                <div>
                    <MUIDataTable
                        title="Size List"
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
                        height: '250px',
                        top: '50px',
                        left: '450px',
                    },
                }}
                ariaHideApp={false}
            >
                <div>
                    <div className="row">
                        <div className="col">
                            {size.id !== 0 ? (
                                <h1>Cập nhật</h1>
                            ) : (
                                <h1>Thêm mới</h1>
                            )}

                        </div>
                        <div className="col text-end">
                            <button className="btn btn-outline-dark rounded-0" onClick={handleCloseModal}><i className="bi bi-x-lg"></i></button>
                        </div>
                    </div>
                    <form onSubmit={(e) => { size.id !== 0 ? handleSubmitUpdate(e) : handleSubmitCreate(e) }}>
                        <div>
                            <label>Tên:</label>
                            <input
                                name="name"
                                value={size?.name || ""}
                                onChange={(e) => handleInputChange(e, "name")}
                                className={`form-control ${nameErrors.length > 0 ? 'mb-0' : 'mb-3'}`}
                            />
                            {nameErrors.length > 0 &&
                                nameErrors.map((x, index) => (
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
                            {size.id !== 0 ? (
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
                        <button onClick={() => handleSizeDelete(id || 0)} type="button" className="btn btn-danger w-25 rounded-0 ms-1">Xoá</button>
                    </div>
                </div>
            </Modal>

        </div >
    )
}

export default Size;