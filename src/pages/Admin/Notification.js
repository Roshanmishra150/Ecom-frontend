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
import { Input, Modal } from "@mui/material";

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
import { BiSend } from "react-icons/bi";

const style = {
    width: "100%",
    maxWidth: "95%",
    bgcolor: "background.paper",
};

const CreateProduct = () => {
    const [auth, setAuth] = useAuth();
    const [nCount, setnCount] = useState(0);
    const [notificationList, setNotificationList] = useState([]);
    const [askQuestion, setAskQuestion] = useState("");
    const [answerValue, setAnswerValue] = useState("");
    const [questionValue, setQuestionValue] = useState("");
    const [reciverId, setReciverId] = useState("");
    const [replyToFlag, setReplyToFlag] = useState(false);
 
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

    const handleSubmit = async() => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API}/api/v1/auth/sendNotification`,
                {
                  title: "Reply To Question",
                  question: questionValue,
                  answer: answerValue,
                  recipientId: reciverId,
                  senderId: auth?.user?._id,
                }
              );
              if (response?.data?.success == true) {
                toast.success(response?.data?.message);
                setQuestionValue("")
                setAnswerValue("")
                setAskQuestion("")
                setReplyToFlag(false)
                } else {
                toast.error(response?.data?.message);
              }
        } catch (error) {
            
        }
        // Here you can handle form submission, such as sending data to a server or displaying a success message
    };

    return (
        <Layout title="notification E-comm">
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
                                                {
                                                    item?.question && item?.question != "" ? (
                                                        <Typography variant="body2">
                                                    <span style={{color:"#01aaaa"}}>Question: {item?.question} </span>
                                                </Typography>
                                                    ) : (<Typography variant="body2">
                                                    <span style={{color:"#01aaaa"}}>Message: {item?.content}</span>
                                                </Typography>)
                                                }
                                                {/* <Typography variant="body2">
                                                    Message: {item?.content}
                                                </Typography> */}
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
                                        <div>

                                        <BiSend
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
                                                setReplyToFlag(true)
                                                setReciverId(item?.sender)
                                                setQuestionValue(item?.question)
                                                // handleSubmit(
                                                //     item?.recipient
                                                // );
                                            }}
                                        />
                                        <DeleteForeverIcon
                                            className="deleteNotification"
                                            style={{
                                                marginTop: "10px",
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
                                    </div>
                                );
                            })}
                        </List>
                    </div>
                </div>

                {/* open create faq modal */}
                <Modal open={replyToFlag} style={{ width: "100px" }}>
                    <div
                        className={
                            replyToFlag ? "modal cus-modal fade show" : "modal cus-modal fade"
                        }
                        id="GreetingnModal"
                        tabIndex={-1}
                        aria-labelledby="exampleModalLabel"
                        style={replyToFlag ? { display: "block" } : { display: "none" }}
                    >
                        <div
                            className="modal-dialog modal-dialog-centered modal-dialog-scrollable"
                            style={{ maxWidth: "80%", width: "fit-content" }}
                        >
                            <div className="modal-content ">
                                <div className="modal-header border-0 pd20">
                                    <h5
                                        className="modal-title d-flex align-items-center c-black fs20 WorkSans-extra-bold"
                                        id="exampleModalLabel"
                                    >
                                        <div className="m-head-icon me-3">
                                            <svg
                                                width="34"
                                                height="34"
                                                viewBox="0 0 34 34"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <rect
                                                    width="34"
                                                    height="33.9799"
                                                    rx="16.9899"
                                                    fill="#DAE8FF"
                                                />
                                                <path
                                                    d="M18.875 9.5H12.5C12.1022 9.5 11.7206 9.65804 11.4393 9.93934C11.158 10.2206 11 10.6022 11 11V23C11 23.3978 11.158 23.7794 11.4393 24.0607C11.7206 24.342 12.1022 24.5 12.5 24.5H21.5C21.8978 24.5 22.2794 24.342 22.5607 24.0607C22.842 23.7794 23 23.3978 23 23V13.625L18.875 9.5Z"
                                                    stroke="#0047BA"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M18.5 9.5V14H23"
                                                    stroke="#0047BA"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M17 21.5V17"
                                                    stroke="#0047BA"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M14.75 19.25H19.25"
                                                    stroke="#0047BA"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </div>
                                        <h4 className=" pt-2"> FAQS </h4>
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                        onClick={() => setReplyToFlag(false)}
                                    ></button>
                                </div>
                                <div className="modal-body cus-m-body gree-m-body pd-t0 pd0">
                                    <label>Enter Question: </label>
                                    <br></br>
                                    <Input
                                        type="text"
                                        // placeholder="Enter Question Title"
                                        style={{
                                            width: "500px",
                                            marginLeft: "10px"
                                        }}
                                        value={questionValue}
                                        disabled
                                        // onChange={(e) => setQuestionValue(e.target.value)}
                                    />
                                    <br></br>
                                    <br></br>
                                    <label>Enter Answer: </label>
                                    <textarea
                                        style={{
                                            width: "100%",
                                            outline: "none",
                                            border: "solid 1px gray 1px 0px 0px 0px",
                                            height: "80px",
                                            padding: "5px",
                                            marginTop: "20px",
                                            placeholder: "Enter Answer"
                                        }}
                                        cols={3}
                                        value={answerValue}
                                        onChange={(e) => setAnswerValue(e.target.value)}

                                    />
                                </div>
                                <div className="modal-footer border-0">
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => {
                                            handleSubmit()
                                        }}
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        </Layout>
    );
};

export default CreateProduct;
