import './App.css';
import Layout from "./components/Layout";

import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";

import { useReducer } from 'react';
import { contextStore } from './context';
import AboutUs from './pages/AboutUs';
import Accessories from './pages/Accessories';
import Cart from './pages/Cart';
import ContactUs from './pages/ContactUs';
import Food from './pages/Food';
import Home from './pages/Home';
import Litter from "./pages/Litter";
import Login from './pages/Login';
import Order from './pages/Order';
import OrderHistory from './pages/OrderHistory';
import OrderSummary from './pages/OrderSummary';
import Payment from './pages/Payment';
import Product from './pages/Product';
import Products from './pages/Products';
import Profile from './pages/Profile';
import Search from './pages/Search';
import Shipping from './pages/Shipping';
import ThankYou from './pages/ThankYou';
import Toys from "./pages/Toys";
import UpdateOrder from './pages/UpdateOrder';
import Users from './pages/Users';
import { cartReducer } from './reducers/cartReducer';
import { useStateReducer } from './reducers/reducerFunctions';
import { userReducer } from './reducers/userReducer';
import Message from './components/Message';
import { faExclamationTriangle, faXmarkCircle } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [cartItems, cartDispatch] = useReducer(cartReducer, []);

  const [userData, userDispatch] = useReducer(userReducer, {})

  const [token, tokenDispatch] = useReducer(useStateReducer, null);

  function getToken() {
    tokenDispatch(window.localStorage.getItem("token"))
  }

  const userType = localStorage.getItem("userType");

  return (
    < contextStore.Provider value=
      {
        {
          cart: { cartItems, cartDispatch },
          userStore: { userData, userDispatch },
          tokenStore: { token, getToken },
        }
      }
    >
      <BrowserRouter>
        {/* <MyNavBar /> */}
        <Routes>
          {/* <Route path='' element={<Outlet />}> */}
          <Route path='' element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path='food' element={<Food />} />
            <Route path='litter' element={<Litter />} />
            <Route path='accessories' element={<Accessories />} />
            <Route path='toys' element={<Toys />} />
            <Route path='contact' element={<ContactUs />} />
            <Route path='about' element={<AboutUs />} />
            <Route path=':path/:usertype' element={token ? <Navigate to="/" /> : <Login />} />
            <Route path='profile' element={token ? <Profile /> : <Navigate to={`/login/${userType}`} />} />
            <Route path='product/:productId' element={!token && (userType === "admin" || userType === "seller") ? <Navigate to={`/login/${userType}`} /> : <Product />} />
            <Route path='product' element={!token && (userType === "admin" || userType === "seller") ? <Navigate to={`/login/${userType}`} /> : <Product />} />
            <Route path='cart' element={<Cart />} />
            <Route path='ship' element={token ? <Shipping /> : <Navigate to={`/login/${userType}`} />} />
            <Route path='pay' element={token && (userType === "user") ? <Payment /> : <Navigate to={`/login/${userType}`} />} />
            <Route path='summary' element={token ? <OrderSummary /> : <Navigate to={`/login/${userType}`} />} />
            {/* <Route path='summary' element={token ? cartItems.length ? <OrderSummary /> : <Home /> : <Navigate to={`/login/${userType}`} />} /> */}
            <Route path='placed/:orderId' element={token ? <ThankYou /> : <Navigate to={`/login/${userType}`} />} />
            <Route path='placed' element={token && (userType === "user") ? <ThankYou /> : <Navigate to={`/login/${userType}`} />} />
            <Route path='orders' element={token ? <OrderHistory /> : <Navigate to={`/login/${userType}`} />} />
            <Route path='order/:userId/:orderId' element={token ? <Order /> : <Navigate to={`/login/${userType}`} />} />
            <Route path='updateorder/:userId/:orderId' element={token ? <UpdateOrder /> : <Navigate to={`/login/${userType}`} />} />
            <Route path='/products' element={<Products />} />
            <Route path='users' element={token && userType === "admin" ? <Users /> : <Navigate to={`/login/${userType}`} />} />
            <Route path='profile/:userId' element={token && userType === "admin" ? <Profile /> : <Navigate to={`/login/${userType}`} />} />
            <Route path="/*" element={<Message text="404 Page Not Found" icon={faExclamationTriangle} size="8x" color='red' />} />
          </Route >
        </Routes>
      </BrowserRouter >
    </ contextStore.Provider >

  )
}

export default App;