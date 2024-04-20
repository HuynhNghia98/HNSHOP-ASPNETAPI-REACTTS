import React, { useEffect, useState } from "react";
import { IUser } from '../../Services/Interfaces/Interfaces';
import MUIDataTable from "mui-datatables";
import { MUIDataTableColumnDef } from "mui-datatables";
import { toast } from "react-toastify";
import Modal from 'react-modal';
import AdminUserServices from './../../Services/Admin/AdminUserServices';
import FormatDate from "../../Utility/FormatDate";

const User = () => {
    const [users, setUsers] = useState<IUser[]>([]);
    const currentDateTime = new Date();

    console.log(users)

    useEffect(() => {
        Modal.setAppElement('body');
        AdminUserServices.getAdminUser().then((res) => {
            if (res && res.isSuccess && res.result) {
                setUsers(res.result);
            } else {
                console.error(res);
                setUsers([]);
            }
        }).catch((error) => {
            console.error("Error fetching data:", error);
            setUsers([]);
        });
    }, []);

    const handleLockClick = (id: number) => {
        AdminUserServices.postAdminUserLockUnlock(id).then((res) => {
            if (res && res.isSuccess && res.result) {
                setUsers(res.result)
                toast.success(res.messages, {
                    autoClose: 2000,
                    theme: "colored",
                });
            } else {
                console.error(res);
                setUsers([]);
            }
        }).catch((error) => {
            console.error("Error fetching data:", error);
            setUsers([]);
        });
    }

    const data = users.map((c) => [c.email, c.name, c.role, c.phoneNumber, c.lockoutEnd, c.createTime, users.indexOf(c)]);

    const columns: MUIDataTableColumnDef[] = [
        // {
        //     name: "ID", options: {
        //         customBodyRender: (value: number) => (
        //             <div style={{ textAlign: "start", paddingLeft: "10px" }}>{value}</div>
        //         ),
        //     },
        // },
        {
            name: "Email", options: {
                customBodyRender: (value: string) => (
                    <div style={{ textAlign: "start", paddingLeft: "20px" }}>{value}</div>
                ),
            },
        },
        {
            name: "Name", options: {
                customBodyRender: (value: string) => (
                    <div style={{ textAlign: "start", paddingLeft: "20px" }}>{value}</div>
                ),
            },
        },
        {
            name: "Role", options: {
                customBodyRender: (value: string) => (
                    <div style={{ textAlign: "start", paddingLeft: "20px" }}>{value}</div>
                ),
            },
        },
        {
            name: "PhoneNumber", options: {
                customBodyRender: (value: string) => (
                    <div style={{ textAlign: "start", paddingLeft: "20px" }}>{value}</div>
                ),
            },
        },
        {
            name: "LockOutEnd", options: {
                customBodyRender: (value: Date) => (
                    <div style={{ textAlign: "start", paddingLeft: "10px" }}>{FormatDate(value)}</div>
                ),
            },
        },
        {
            name: "CreateTime", options: {
                customBodyRender: (value: Date) => (
                    <div style={{ textAlign: "start", paddingLeft: "10px" }}>{FormatDate(value)}</div>
                ),
            },
        },
        {
            name: "Actions",
            options: {
                customBodyRender: (value: number) => (
                    <div style={{ textAlign: "start", paddingLeft: "10px" }}>
                        <button onClick={() => handleLockClick(users[value].id)} type="button" className="btn btn-warning">

                            {users[value].lockoutEnd !== null && new Date(users[value].lockoutEnd) > currentDateTime ? (
                                <i className="bi bi-lock-fill"></i>
                            ) : (
                                <i className="bi bi-unlock-fill"></i>
                            )}
                        </button>
                    </div>
                ),
            },
        },
    ];

    return (
        <div className="border">
            <div className="custom-border-top p-3 bg-white">
                <h4>User Management</h4>
                <hr />
                <div>
                    <MUIDataTable
                        title="User List"
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
                            rowsPerPage: 5,
                            rowsPerPageOptions: [5, 10, 25, 100],
                            elevation: 2,
                        }}
                    />
                </div>
            </div>
        </div >
    )
}

export default User;