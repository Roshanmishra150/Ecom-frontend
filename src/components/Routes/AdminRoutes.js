import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../Spinner";
import { toast } from "react-hot-toast";

const AdminRoutes = () => {
  const [ok, setOk] = useState(false);
  const [auth, setAuth] = useAuth();
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await useAuth;
        // const Authorization = 
        //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDYyMWJjYjNlOGY1M2Y2NTg1ZmEwNWMiLCJpYXQiOjE2ODQxNTEyNzgsImV4cCI6MTY4NjU3MDQ3OH0.gL5WOI7cL13A7JcOF0041qCPm7et0geqf5f9QKhY0I8";

        const res = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/admin-auth`);
        if (res.data.ok) {
          setOk(true);
        } else {
          setOk(false);
        }
      } catch (error) {
        toast.error("something went wrong !!!. ");
      }
    };
    if (auth?.token || sessionStorage.getItem("token")) {
      checkAuth();
    } else {
      console.log("error in protected page", auth);
    }
  }, [auth?.token]);
  
  // useEffect(() => {
  //   // if (location?.pathname === "/user") {
  //   //   navigate("/user/homepage")
  //   // } else {
  //   //   navigate("/")
  //   // }
  //   console.log("auth ", auth);
  //     navigate(`${location.pathname}`)
  // },[])
  return ok ? <Outlet /> : "";
};

export default AdminRoutes;
