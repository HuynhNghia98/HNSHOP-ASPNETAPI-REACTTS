import AdminLayout from '../Layouts/Admin/AdminLayout';
import { Route, Routes } from 'react-router-dom';
import NotFound from '../Pages/NotFound';
import Dashboard from '../Pages/Admin/Dashboard';
import Category from '../Pages/Admin/Category';
import SubCategory from '../Pages/Admin/SubCategory';
import Product from '../Pages/Admin/Product';
import Color from '../Pages/Admin/Color';
import Size from '../Pages/Admin/Size';
import ProductDetail from '../Pages/Admin/ProductDetail';
import User from '../Pages/Admin/User';
import CustomerLayout from '../Layouts/Customer/CustomerLayout';
import Home from '../Pages/Customer/Home/Home';
import CategoryPage from './../Pages/Customer/Category/CategoryPage';
import SubCategoryPage from '../Pages/Customer/SubCategory/SubCategoryPage';
import ProductDetailPage from '../Pages/Customer/Product/ProductDetailPage';
import Login from '../Pages/Auth/Login';
import Register from '../Pages/Auth/Register';
import userModel from '../Services/Interfaces/UserModel';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../Storage/Redux/store';
import { jwtDecode } from 'jwt-decode';
import { setLoggedInUser } from '../Storage/Redux/userAuthSlice';
import CartLayout from '../Layouts/Cart/CartLayout';
import Cart from '../Pages/Customer/Cart/Cart';
import OrderInformation from '../Pages/Customer/Cart/OrderInformation';
import Payment from '../Pages/Customer/Cart/Payment';
import OrderConfirmation from '../Pages/Customer/Order/OrderConfirmation';
import UserLayout from '../Layouts/User/UserLayout';
import UserInfor from '../Pages/Customer/Manage/UserInfor';
import Order from '../Pages/Admin/Order';
import ManageOrder from '../Pages/Customer/Manage/ManageOrder';
import OrderDetail from '../Pages/Admin/OrderDetail';

function App() {
  const dispatch = useDispatch();

  const token = localStorage.getItem("token");

  if (token !== null) {
    const { fullName, id, email, role }: userModel = jwtDecode(token);
    dispatch(setLoggedInUser({ fullName, id, email, role }));
  }

  const userData: userModel = useSelector(
    (state: RootState) => state.userAuthStore
  );

  return (
    <>
      {userData.role === 'Admin' ? (
        <>
          <Routes>
            {/* ADMIN */}
            <Route path='admin/*' element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path='category' element={<Category />} />
              <Route path='subCategory' element={<SubCategory />} />
              <Route path='product' element={<Product />} />
              <Route path='productDetail' element={<ProductDetail />} />
              <Route path='color' element={<Color />} />
              <Route path='size' element={<Size />} />
              <Route path='user' element={<User />} />
              <Route path='order' element={<Order />} />
              <Route path='order/:id' element={<OrderDetail />} />
              <Route path='*' element={<NotFound />} />
            </Route>

            <Route path='*' element={<CustomerLayout />}>
              <Route index element={<Home />} />
              <Route path='login' element={<Login />} />
              <Route path='register' element={<Register />} />
              <Route path=':urlName' element={<CategoryPage />} />
              <Route path=':category/:subCategoryUrlName' element={<SubCategoryPage />} />
              <Route path=':subCategory/p/:slug' element={<ProductDetailPage />} />
              {/* cart */}
              <Route path='cart' element={<CartLayout />}>
                <Route path='list' element={<Cart />} />
                <Route path='orderInformation' element={<OrderInformation />} />
                <Route path='payment' element={<Payment />} />
              </Route>
              <Route path='orderConfirmation' element={<OrderConfirmation />} />
              {/* userInformation */}
              <Route path='user' element={<UserLayout />}>
                <Route path='infor' element={<UserInfor />} />
                <Route path='order' element={<ManageOrder />} />
              </Route>
              <Route path='*' element={<NotFound />} />
            </Route>
          </Routes>
        </>
      ) : (
        <>
          <Routes>
            <Route path='*' element={<CustomerLayout />}>
              <Route index element={<Home />} />
              <Route path='login' element={<Login />} />
              <Route path='register' element={<Register />} />
              <Route path=':urlName' element={<CategoryPage />} />
              <Route path=':category/:subCategoryUrlName' element={<SubCategoryPage />} />
              <Route path=':subCategory/p/:slug' element={<ProductDetailPage />} />
              {/* cart */}
              <Route path='cart' element={<CartLayout />}>
                <Route path='list' element={<Cart />} />
                <Route path='orderInformation' element={<OrderInformation />} />
                <Route path='payment' element={<Payment />} />
              </Route>
              <Route path='orderConfirmation' element={<OrderConfirmation />} />
              {/* userInformation */}
              <Route path='user' element={<UserLayout />}>
                <Route path='infor' element={<UserInfor />} />
                <Route path='order' element={<ManageOrder />} />
              </Route>
              <Route path='*' element={<NotFound />} />
            </Route>
          </Routes>
        </>
      )}
    </>
  );
}

export default App;
