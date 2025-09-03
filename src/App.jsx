import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signin from "./pages/Signin";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Dashboard from "./adminPages/Dashboard";
import Cart from "./pages/Cart";
import PrivateRoute from "./components/PrivateRoute";
import AdminPrivateRoute from "./components/AdminPrivateRoute";
import Users from "./adminPages/Users";
import Orders from "./adminPages/Orders";
import Products from "./adminPages/Products";
import AddProduct from "./adminPages/AddProduct";
import Explore from "./pages/Explore";
import Settings from "./pages/Settings";
import Product from "./pages/Product";
import Brand from "./adminPages/Brand";
import BuySingle from "./pages/BuySingle";
import Order from "./pages/Order";
import Messages from "./pages/Messages";
import OrderDetails from "./adminPages/OrderDetails";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id/:colorIndex" element={<Product />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/explore/:Category" element={<Explore />} />
        <Route path="/messages" element={<Messages />} />
        <Route element={<PrivateRoute />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/setting" element={<Settings />} />
          <Route path="/buy/:id/:colorIndex" element={<BuySingle />} />
          <Route path="/orders" element={<Order />} />
        </Route>
        <Route element={<AdminPrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/adminsetting" element={<Settings />} />
          <Route
            path="/order/orderDetails/:orderId"
            element={<OrderDetails />}
          />
          <Route path="/order" element={<Orders />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/users" element={<Users />} />
          <Route path="/products" element={<Products />} />
          <Route path="/addproduct" element={<AddProduct />} />
          <Route path="/brands" element={<Brand />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
