import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Policy from "./pages/Policy";
import Pagenotfound from "./pages/Pagenotfound";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/User/Dashboard";
import Private from "./components/Routes/Private";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import AdminRoutes from "./components/Routes/AdminRoutes";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminNotification from "./pages/Admin/Notification"
import CreateCategory from "./pages/Admin/CreateCategory";
import CreateProduct from "./pages/Admin/CreateProduct";
import Users from "./pages/Admin/Users";
import Orders from "./pages/User/Orders";
import Profile from "./pages/User/Profile";
import "antd/dist/reset.css";
import CreateEditProduct from "./pages/Admin/CreateEditProduct";
import ViewProduct from "./pages/viewProduct";
import AdminOrders from "./pages/Admin/OrderPage";
import Setting from "./pages/Admin/Setting";
import React from "react";
import HomePage from "./pages/User/HomePage";
import Notification from "./pages/User/Notification";
import Header from "./components/layout/Header";
import AddToCart from "./pages/User/AddToCart"
import ViewOrder from "./pages/User/OrderViewPage"

function App() {
    return (
        <>
            {/* <Header /> */}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/view-product" element={<ViewProduct />} />
                <Route path="/view-product/:productId/slug/:slug" element={<ViewProduct />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/policy" element={<Policy />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/user" element={<Private />}>
                    <Route path="homepage" element={<HomePage />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="notification" element={<Notification />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="vieworders/:order_id" element={<ViewOrder />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="carts" element={<AddToCart />} />
                    <Route path="setting" element={<Setting />} />
                    <Route path="view-product" element={<ViewProduct />} />
                </Route>
                <Route path="/admin" element={<AdminRoutes />}>
                    <Route path="homepage" element={<HomePage />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    {/* <Route path="dashboard" element={<CreateCategory />} /> */}
                    <Route
                        path="create-category"
                        element={<CreateCategory />}
                    />
                    <Route
                        path="create-product"
                        element={<CreateEditProduct />}
                    />
                    <Route
                        path="edit-product"
                        element={<CreateEditProduct />}
                    />
                    <Route path="manage-product" element={<CreateProduct />} />
                    <Route path="users" element={<Users />} />
                    <Route path="setting" element={<Setting />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="view-product" element={<ViewProduct />} />
                    <Route path="notification" element={<AdminNotification />} />
                </Route>
                
                <Route path="/*" element={<Pagenotfound />} />
            </Routes>
        </>
    );
}

export default App;







