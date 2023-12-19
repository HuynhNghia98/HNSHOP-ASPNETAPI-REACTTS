import { Link, Outlet } from 'react-router-dom';

const UserLayout = () => {
    return (
        <section>
            <div className="container my-4">
                <div className="row g-5 d-flex">
                    <div className="col-3 bg-white p-0">
                        <div>
                            <Link to="/user/infor" className='btn btn-outline-dark border-0 w-100 rounded-0 text-start ps-5 p-3'><h5 className='m-0 fw-bold'>Information</h5></Link>
                        </div>
                        <div>
                            <Link to="/user/infor" className='btn btn-outline-dark border-0 w-100 rounded-0 text-start ps-5 p-3'><h5 className='m-0 fw-bold'>Change PassWord</h5></Link>
                        </div>
                        <div>
                            <Link to="/user/order" className='btn btn-outline-dark border-0 w-100 rounded-0 text-start ps-5 p-3'><h5 className='m-0 fw-bold'>Order</h5></Link>
                        </div>
                        <div>
                            <Link to="/user/infor" className='btn btn-outline-dark border-0 w-100 rounded-0 text-start ps-5 p-3'><h5 className='m-0 fw-bold'>Delete Data</h5></Link>
                        </div>
                    </div>
                    <div className="col bg-white py-3 px-4 ms-4">
                        <Outlet />
                    </div >
                </div >
            </div >
        </section >
    )
}

export default UserLayout;