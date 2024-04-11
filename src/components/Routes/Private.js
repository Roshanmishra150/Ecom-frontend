import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import axios from "axios";
import Spinner from "../Spinner";
import { toast } from "react-hot-toast";

const Private = () => {
  const [ok, setOk] = useState(false);
  const [auth, setAuth] = useAuth();
  const location = useLocation()


  useEffect(() => {
    const checkAuth = async () => {
      try {
        await useAuth;
        
        const res = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/user-auth`)
        if (res.data.ok) {
          setOk(true);
        } else {
          setOk(false);
        }
      } catch (error) {
        toast.error("something went wrong !!!. ");
      }
    };
    if (auth?.token) {
      checkAuth();
    } else {
      console.log("error in private page");
    }
  }, [auth?.token]);
  return ok ? <Outlet /> : "" ;
};

export default Private;
