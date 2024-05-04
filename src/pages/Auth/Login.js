import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import "../../styles/AuthStyles.css";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {RiLockPasswordFill} from 'react-icons/ri'

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [auth, setAuth] = useAuth();
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/auth/login`,
        {
          email: data.email,
          password: data.password,
        }
      );
      if (res.data.success) {
        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token,
        });
        console.log("auth", auth);
        sessionStorage.setItem("user", JSON.stringify(res.data.user));
        sessionStorage.setItem("token", JSON.stringify(res.data.token));
        toast.success(res.data.message);

        if (sessionStorage.getItem("slug")) {
          if (res.data.user.role === 1) {
            console.log("location.state", location.state);
            navigate(location.state || "/admin/view-product");
          } else {
            navigate(location.state || "/user/view-product");
          }
        } else {
          if (res.data.user.role === 1) {
            console.log("location.state", location.state);
            navigate(location.state || "/admin/homepage");
          } else {
            navigate(location.state || "/user/homepage");
          }
        }


      } else {
        toast.error(res.data.message);
        console.log("erorr,", res.data.message);
      }
    } catch (error) {
      toast.error("something went wrong");
    }
  };

  useEffect(() => {
    if (location.pathname.includes("login")) {
      sessionStorage.clear()
      setAuth({
        user: "",
        token: "",
    });
      localStorage.clear()
    }
  }, []);

  return (
    <Layout title="Login - E-commerce">
      <div className="form-container" >
        <form onSubmit={handleSubmit}>
          <h4 className="title">LOGIN FORM</h4>

          <div className="mb-3">
            <input
              type="email"
              value={data.email}
              name="email"
              onChange={handleChange}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter Your Email "
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              name="password"
              value={data.password}
              onChange={handleChange}
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Enter Your Password"
              required
            />
          </div>

          <div
            type="button"
            className="mr-b50"
            style={{
              // color:"blue",
              marginBottom:"10px"
            }}
            onClick={()=>{navigate("/forgot-password")}}
          >
            <RiLockPasswordFill style={{marginRight:"5px",marginTop:"-4px"}}/>
            Forgot Password
          </div>

          <button type="submit" className="btn btn-primary">
            LOGIN
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Login;
