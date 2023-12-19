import { useEffect, useState } from "react";
import { IOrder } from "../../Services/Interfaces/Interfaces";
import AdminOrderServices from "../../Services/Admin/AdminOrderServices";
import { MUIDataTableColumnDef } from "mui-datatables";
import FormatDate from './../../Utility/FormatDate';
import MUIDataTable from "mui-datatables";
import { SD_OrderStatus } from "../../Utility/SD";
import { Link } from "react-router-dom";

const Order = () => {
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [status, setStatus] = useState<string>('All');

    useEffect(() => {
        AdminOrderServices.postAdminOrder(status).then((res) => {
            if (res.isSuccess) {
                setOrders(res.result);
            } else {
                alert('cannot fetch')
            }
        })
    }, [status]);

    const data = orders.map((c) => [c.id, c.total, c.orderDate, c.orderStatus, c.id]);

    const columns: MUIDataTableColumnDef[] = [
        {
            name: "ID", options: {
                customBodyRender: (value: number) => (
                    <div style={{ textAlign: "start", paddingLeft: "30px" }}>{value}</div>
                ),
            },
        },
        {
            name: "Total", options: {
                customBodyRender: (value: number) => (
                    <div style={{ textAlign: "start", paddingLeft: "20px" }}>{value}</div>
                ),
            },
        },
        {
            name: "Order Date", options: {
                customBodyRender: (value: Date) => (
                    <div style={{ textAlign: "start", paddingLeft: "20px" }}>{FormatDate(value)}</div>
                ),
            },
        },
        {
            name: "Order Status", options: {
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
                        <Link to={`/admin/order/${value}`} className="btn btn-warning">
                            <i className="bi bi-pencil-square"></i>
                        </Link>
                    </div>
                ),
            },
        },
    ];

    const handleFilterOrderStatus = (status: string) => {
        setStatus(status);
    }

    return (
        <div className="border">
            <div className="custom-border-top p-3 bg-white">
                <h4>Order Management</h4>
                <hr />
                <div className="row mb-3">
                    <div className="col">
                        <button className={`btn btn-outline-dark rounded-0 w-100 ${status === 'All' ? 'active' : ''}`}
                            onClick={() => handleFilterOrderStatus('All')}
                        >All</button>
                    </div>
                    <div className="col">
                        <button className={`btn btn-outline-dark rounded-0 w-100 ${status === SD_OrderStatus.WAITCONFIRM ? 'active' : ''}`}
                            onClick={() => handleFilterOrderStatus(SD_OrderStatus.WAITCONFIRM)}
                        >Wait For Confirmation</button>
                    </div>
                    <div className="col">
                        <button className={`btn btn-outline-dark rounded-0 w-100 ${status === SD_OrderStatus.WAITDELIVERY ? 'active' : ''}`}
                            onClick={() => handleFilterOrderStatus(SD_OrderStatus.WAITDELIVERY)}
                        >Wait For Delivery</button>
                    </div>
                    <div className="col">
                        <button className={`btn btn-outline-dark rounded-0 w-100 ${status === SD_OrderStatus.COMPLETED ? 'active' : ''}`}
                            onClick={() => handleFilterOrderStatus(SD_OrderStatus.COMPLETED)}
                        >Completed</button>
                    </div>
                    <div className="col">
                        <button className={`btn btn-outline-dark rounded-0 w-100 ${status === SD_OrderStatus.CANCELED ? 'active' : ''}`}
                            onClick={() => handleFilterOrderStatus(SD_OrderStatus.CANCELED)}
                        >Canceled</button>
                    </div>
                </div>
                <div>
                    <MUIDataTable
                        title="Order List"
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
        </div>
    )
}

export default Order;