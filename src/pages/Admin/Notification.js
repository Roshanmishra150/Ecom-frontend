import React, { useEffect, useState } from "react";
// import Layout from "../components/layout/Layout";
import Layout from "../../components/layout/Layout";
import AdminMenu from "../../components/layout/AdminMenu";
import UsersMenu from "../../pages/User/UsersMenu";
import axios from "axios";
import { toast } from "react-hot-toast";
import "antd/dist/reset.css";
import { useNavigate, useParams } from "react-router-dom";
import { MdDeleteForever } from "react-icons/md";
import { FiEdit2 } from "react-icons/fi";
import moment from "moment";
import Typography from "@mui/material/Typography";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import "../../styles/Homepage.css";
import { BsPersonFill } from "react-icons/bs";
import { HiShoppingBag } from "react-icons/hi";
import { GiBilledCap } from "react-icons/gi";
import { CgPerformance } from "react-icons/cg";
import { Modal } from "@mui/material";

import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";

import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import StarIcon from "@mui/icons-material/Star";
import { useAuth } from "../../context/AuthContext";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";

const style = {
    width: "100%",
    maxWidth: "95%",
    bgcolor: "background.paper",
};

const CreateProduct = () => {
    const [auth, setAuth] = useAuth();
    const [nCount, setnCount] = useState(0);
    const [notificationList, setNotificationList] = useState([]);

    const navigate = useNavigate();

    const containerStyle = {
        padding: "4rem",
        height: "80vh",
    };

    const leftStyle = {
        position: "fixed",
        top: "50px",
        bottom: 0,
        left: 0,
        width: "25%",
        padding: "20px",
        overflow: "hidden",
    };

    const rightStyle = {
        position: "fixed",
        top: "50px",
        bottom: 0,
        left: auth?.toggle ? "263px" : "100px",
    width: auth?.toggle ? "85.4%"  : "96.6%",
        padding: "20px",
        overflowY: "scroll",
    };

    const lightScrollbarCSS = `
    /* Customize the scrollbar for webkit (Chrome, Safari) */
    ::-webkit-scrollbar {
      width: 5px;
    }
    
    ::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0); /* Light background color */
    }
    
    ::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.3); /* Light thumb color */
      border-radius: 4px; /* Rounded corners for the thumb */
    }
    `;
    useEffect(() => {
        if (auth?.user) {
            notificationFunc();
        }
    }, []);

    const notificationFunc = async () => {
        const response = await axios.get(
            `${process.env.REACT_APP_API}/api/v1/auth/getNotification/${auth?.user?._id}`
        );
        if (response?.data?.success) {
            console.log("countis .....", response.data);
            const unreadNotifications = response?.data?.newNotification.filter(
                (notification) => !notification.isRead
            );
            sessionStorage.setItem("nCount", unreadNotifications?.length);
            setNotificationList(response?.data?.newNotification);
        }
    };

    const notificationreadFunc = async (item) => {
        if (!item?.isRead) {
            const response = await axios.post(
                `${process.env.REACT_APP_API}/api/v1/auth/sendReadNotification/${item?._id}`
            );
            if (response?.data?.success) {
                notificationFunc();
            }
        }
    };

    const deleteNotificationHandler = async (id) => {
        const response = await axios.delete(
            `${process.env.REACT_APP_API}/api/v1/auth/deleteNotification/${id}`
        );
        if (response?.data?.success) {
            toast.success(response?.data?.message);
            notificationFunc();
        }
    };

    return (
        <Layout title="create-product admin">
            <div style={containerStyle} className="container-fluid m-0 p-4">
                <div className="row ">
                    <div style={leftStyle} className="col-md-3 ">
                        {auth?.user?.role === 1 ? <AdminMenu /> : <UsersMenu />}
                    </div>
                    <style>{lightScrollbarCSS}</style>
                    <div style={rightStyle} className="col-md-9 ">
                        <List
                            sx={style}
                            component="nav"
                            aria-label="mailbox folders"
                        >
                            {notificationList?.map((item, index) => {
                                return (
                                    <div style={{ display: "flex" }}>
                                        <ListItem
                                            button
                                            onClick={(e) => {
                                                notificationreadFunc(item);
                                            }}
                                            style={{
                                                marginTop: "9px",
                                                backgroundColor:
                                                    item?.isRead === false
                                                        ? "lightgray"
                                                        : "#f0f0f0",
                                                display: "flex",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            {/* <ListItemText
                                                style={{ marginTop: "-20px" }}
                                                primary={`${item?.title}  @ ${item?.name}`}
                                                secondary={`From: ${item?.content} | | Message: ${item?.content}`}
                                            /> */}
                                            <div style={{ float: "left" }}>
                                                <Typography variant="h6">
                                                    Title: {item?.title}
                                                </Typography>
                                                <Typography variant="body1">
                                                    From: {item?.name}
                                                </Typography>
                                                <Typography variant="body2">
                                                    Message: {item?.content}
                                                </Typography>
                                            </div>
                                            <p style={{ float: "right" }}>
                                                <h6>
                                                    {moment(
                                                        "2023-09-23T13:18:03.232Z"
                                                    ).format("YYYY-MM-DD")}
                                                </h6>
                                                <h6>
                                                    {moment(
                                                        "2023-09-23T13:18:03.232Z"
                                                    ).format("HH:mm")}
                                                </h6>
                                            </p>
                                        </ListItem>
                                        <DeleteForeverIcon
                                            className="deleteNotification"
                                            style={{
                                                marginTop: "20px",
                                                fontSize: "40px",
                                                color: "red", // Change the color when the effect is shown
                                                transition: "color 0.3s", // Add a transition for smooth color change
                                                cursor: "pointer",
                                                borderRadius: "50%",
                                                marginLeft: "20px",
                                                padding: "4px",
                                            }}
                                            onClick={() => {
                                                deleteNotificationHandler(
                                                    item?._id
                                                );
                                            }}
                                        />
                                    </div>
                                );
                            })}
                        </List>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CreateProduct;
