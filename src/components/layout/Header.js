import React, { useEffect, useState } from "react";
import { Link, NavLink, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import { LuLayoutDashboard } from "react-icons/lu";
import { GrLogout } from "react-icons/gr";
import { MdOutlineNotificationsNone } from "react-icons/md";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { Tooltip } from "antd";
import axios from "axios";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";

import Avatar from "@mui/material/Avatar";
import logo from "../../images/logo2.png";



const Header = () => {
    const [auth, setAuth] = useAuth();
    const [nCount, setnCount] = useState(0);
    const [cCount, setcCount] = useState(0);
    const [checkedValue, setCheckedValue] = useState(false);
    const [profileImage, setProfileImage] = useState("");
    const location = useLocation()

    useEffect(() => {
        if (!auth?.user) {
            setAuth({
                user: "",
                token: "",
            });
            // sessionStorage.clear()
            // localStorage.clear()
        }
        
        if (location.pathname.includes("login")) {
            setAuth({
                user: "",
                token: "",
            });
            sessionStorage.clear()
            localStorage.clear()
        }
          
        
    }, []);

    useEffect(() => {
        
        if (auth?.user) {
            notificationFunc();
            addToCartFunc()
        }

        try {
            const mockImageData = {
              contentType: "image/png",
              data: auth.user.photo.data.data,
            };
            setProfileImage(mockImageData);
          } catch (error) {
          }
          console.log("oooo",auth?.user);
    }, [sessionStorage, nCount]);

    
  // Function to convert the buffer data to a data URL.
    const bufferToDataURL = (buffer, contentType) => {
    const blob = new Blob([new Uint8Array(buffer)], { type: contentType });
    return URL.createObjectURL(blob);
    };
    
    const notificationFunc = async () => {
        const response = await axios.get(
            `${process.env.REACT_APP_API}/api/v1/auth/getNotification/${auth?.user?._id}`
        );
        if (response?.data?.success) {
            const unreadNotifications = response?.data?.newNotification.filter(
                (notification) => !notification.isRead
            );
            setnCount(unreadNotifications?.length);
            sessionStorage.setItem("nCount", unreadNotifications?.length);
        }
    };

    const addToCartFunc = async () => {
        const response = await axios.get(
            `${process.env.REACT_APP_API}/api/v1/auth/getCartDetails/${auth?.user?._id}`
        );
        if (response?.data?.success) {
            // const unreadNotifications = response?.data?.newNotification.filter(
            //     (notification) => !notification.isRead
            // );
            setcCount(response?.data?.cartItems?.length);
            sessionStorage.setItem("cCount", response?.data?.cartItems?.length);
        }
    }

    return (
        <>
            <nav
                className="navbar navbar-expand-lg bg-body-tertiary sticky-top "
                style={{ height: `${auth?.user ? "50px" : "50px"}`,marginLeft:`${sessionStorage.getItem("token") ? (auth?.toggle ? "220px" : "50px") : "0px"}`, width:`${!auth ? "100%":""}` }}
            >
                <div className="container-fluid">
                    <div className=" w-100">
                        {/* {auth?.user?.role === 1 && auth?.toggle ? (
                            <NavLink
                                to="/admin/homepage"
                                className="navbar-brand"
                                style={{ border: "none" }}
                            >
                                <img className="vec1ss" height={"30px"} width={"140px"} src={logo} alt="" />
                            </NavLink>
                        ) : auth?.user?.role === 0 ? (
                            <NavLink
                                to="/user/homepage"
                                className="navbar-brand"
                                style={{ border: "none" }}
                            >
                                    <img className="vec1ss" height={"30px"} width={"140px"} src={logo} alt="" />
                            </NavLink>
                        ) : (
                            <NavLink
                                to="/"
                                className="navbar-brand"
                                onClick={() => {
                                    setAuth({
                                        user: "",
                                        token: "",
                                    });
                                    sessionStorage.clear();
                                }}
                                style={{ border: "none" }}
                            >
                                        <img className="vec1ss" height={"50px"} width={"140px"} src={logo} alt="" />
                            </NavLink>
                        )}

                        {
                            !auth ? (<NavLink
                                to="/"
                                className="navbar-brand"
                                onClick={() => {
                                    setAuth({
                                        user: "",
                                        token: "",
                                    });
                                    sessionStorage.clear();
                                }}
                                style={{ border: "none" }}
                            >
                                🛒 E-commerce
                            </NavLink>) : ""
                        } */}
                        {
                            !sessionStorage.getItem("user") ? 
                            (<NavLink
                                to="/"
                                className="navbar-brand"
                                onClick={() => {
                                    setAuth({
                                        user: "",
                                        token: "",
                                    });
                                    sessionStorage.clear();
                                }}
                                style={{ border: "none" }}
                            >
                                🛒 E-commerce
                            </NavLink>) : ""
                        }

                        <ul
                            className=" mb-2 mb-lg-0 float-end d-flex justify-content-between"
                            style={{
                                listStyle: "none",
                                alignItems: "center",
                                marginTop: "-3px",
                            }}
                        >
                            {!auth?.user ? (
                                <>
                                    <NavLink
                                        to="/login"
                                        className="nav-link"
                                        style={{ marginRight: "20px" }}
                                    >
                                        <GrLogout
                                            style={{
                                                fontSize: "22px",
                                                marginRight: "6px",
                                            }}
                                        />{" "}
                                        Login
                                    </NavLink>
                                    <NavLink
                                        to="/register"
                                        className="nav-link"
                                    >
                                        <GrLogout
                                            style={{
                                                fontSize: "22px",
                                                marginRight: "6px",
                                            }}
                                        />{" "}
                                        Register
                                    </NavLink>
                                </>
                            ) : (
                                <>
                                    
                                    <div className="notification-icon">
                                        <NavLink
                                            className="nav-link"
                                            to={
                                                auth?.user?.role === 1
                                                    ? "/admin/notification"
                                                    : "/user/notification"
                                            }
                                            role="button"
                                            style={{
                                                fontSize: "22px",
                                                marginRight: "28px",
                                                border: "none",
                                                position: "relative",
                                                display: "inline-block",
                                            }}
                                        >
                                            <Tooltip title="notification">
                                                <MdOutlineNotificationsNone
                                                    style={{
                                                        marginBlock: "-8px",
                                                        fontSize: "30px",
                                                    }}
                                                />
                                            </Tooltip>
                                            {sessionStorage.getItem("nCount") >
                                                0 && (
                                                <span
                                                    style={{
                                                        position: "absolute",
                                                        top: "-4px",
                                                        right: "-8px",
                                                        backgroundColor: "teal",
                                                        color: "white",
                                                        fontSize: "13px",
                                                        borderRadius: "50%",
                                                        padding: "3px 5px",
                                                    }}
                                                >
                                                    {sessionStorage.getItem(
                                                        "nCount"
                                                    )}
                                                </span>
                                            )}
                                        </NavLink>
                                        </div>

                                        {
                                            profileImage ?
                                            <img
                                                style={{
                                                    borderRadius: "50%",
                                                    height: "30px",
                                                    marginRight: "6px",
                                                }}
                                                className="profile-image"
                                                src={
                                                    profileImage?.data
                                                      ? bufferToDataURL(
                                                          profileImage.data,
                                                          profileImage.contentType
                                                        )
                                                      : profileImage
                                                  } 
                                                alt="Profile"
                                                /> : <Avatar style={{
                                                    borderRadius: "50%",
                                                    height: "34px",
                                                    marginRight: "6px",
                                                }}/>
                                        }
                                        
                                        
                                    <li className="nav-item ">
                                        <NavLink
                                            className="nav-link "
                                            href="#"
                                            role="button"
                                            style={{
                                                border: "none",
                                                textTransform: "capitalize",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            <span
                                                style={{ fontWeight: "bold" }}
                                            >
                                                Welcome {auth?.user?.name}
                                            </span>
                                        </NavLink>
                                    </li>
                                </>
                            )}

                            {auth?.user?.role === 0 ? (
                                <li className="nav-item">
                                    <NavLink
                                        className="nav-link"
                                        to="/user/carts"
                                        role="button"
                                        style={{
                                            fontSize: "22px",
                                            marginRight: "20px",
                                            marginLeft: "20px",
                                            border: "none",
                                            position: "relative",
                                            display: "inline-block", // To make the badge inline with the icon
                                        }}
                                    >
                                        <AiOutlineShoppingCart
                                            style={{
                                                marginBlock: "-8px",
                                                fontSize: "30px",
                                            }}
                                        />
                                        {sessionStorage.getItem("cCount") >
                                                0 && (
                                            <span
                                                style={{
                                                    position: "absolute",
                                                    top: "-4px", // Adjust this value to fine-tune the badge position
                                                    right: "-7px", // Adjust this value to fine-tune the badge position
                                                    backgroundColor: "teal",
                                                    color: "white",
                                                    fontSize: "13px",
                                                    borderRadius: "50%",
                                                    padding: "2px 6px",
                                                }}
                                            >
                                                {sessionStorage.getItem("cCount")}
                                            </span>
                                        )}
                                    </NavLink>
                                </li>
                            ) : (
                                <p style={{ marginRight: "40px" }}></p>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Header;

