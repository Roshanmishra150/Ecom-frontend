import React, { useEffect, useState } from "react";
import { Link, NavLink, Navigate } from "react-router-dom";
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
import logo from "../../logo2.png";



const Header = () => {
    const [auth, setAuth] = useAuth();
    const [nCount, setnCount] = useState(0);
    const [cCount, setcCount] = useState(0);
    const [checkedValue, setCheckedValue] = useState(false);
    const [profileImage, setProfileImage] = useState("");


    useEffect(() => {
        if (!auth?.user) {
            setAuth({
                user: "",
                token: "",
            });
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

































// import React, { useEffect, useState } from "react";
// // import { useHistory } from "react-router-dom";
// // import { Decryption } from "../../../common/EncryptDecrypt/EncryptDecrypt";
// // import Modal from "@material-ui/core/Modal";
// import { NavLink } from "react-router-dom";
// // import { Encryption } from '../../../common/EncryptDecrypt/EncryptDecrypt';
// // import logo from "../../../assets/images/new_logo.png";


// const TopNavigation = (props) => {
//   const [userName, setUsername] = useState("");
// //   const history = useHistory();
//   const [ConfirmModalFlag, setConfirmModalFlag] = useState(false);


// //   useEffect(() => {
// //     // let loginData = sessionStorage.getItem("userLoginId");
// //     let loginData = Decryption(sessionStorage.getItem("userLoginId"));

// //     setUsername(loginData.fullname);
// //   }, []);


// //   const handleLogout = () => {
// //     window.sessionStorage.clear();
// //     history.replace("/");
// //   };

// //   const handleConfirmLogout = () => {
// //     setConfirmModalFlag(false);
// //     handleLogout();
// //   };

//   return (
//     <header className="head-wrap head-sticky head-top">
//     <div className="head-title" style={{ whiteSpace: "nowrap", display: "flex", alignItems: "center", justifyContent: "flex-end", marginRight: "10px" }}>
//       <div className="side-logo" style={{ width: "90px" }}>
//         {/* <img
//           src={logo}
//           alt="Complete Home Risk Prevention"
//           title="Complete Home Risk Prevention"
//         /> */}
//       </div>
//       <h5 style={{ margin: 0, marginLeft: "5px", marginRight: "5px" }}>
//         <b>Welcome {userName} </b>
//       </h5>
//         <button type="button" className="trans-btn" onClick={() => setConfirmModalFlag(true)}>


//           <svg
//             width="16"
//             height="18"
//             viewBox="0 0 16 18"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               d="M11.1995 2.12031C10.8314 1.9595 10.4027 2.12753 10.2419 2.49561C10.0811 2.86369 10.2491 3.29242 10.6172 3.45322C12.9835 4.48699 14.5454 6.82743 14.5454 9.45441C14.5454 13.0692 11.6146 15.9999 7.99997 15.9999C4.3849 15.9999 1.45452 13.0695 1.45452 9.45441C1.45452 6.82801 3.01588 4.48757 5.38151 3.45312C5.74953 3.29221 5.91742 2.86342 5.75648 2.49541C5.59557 2.1274 5.16678 1.9595 4.79877 2.12044C1.90824 3.38436 0 6.24479 0 9.45437C0 13.8728 3.58162 17.4544 8 17.4544C12.4179 17.4544 16 13.8725 16 9.45437C16 6.24404 14.091 3.38347 11.1995 2.12031Z"
//               fill="#B9B9B9"
//             />
//             <path
//               d="M7.99972 8C8.40138 8 8.72698 7.6744 8.72698 7.27274V0.727294C8.72702 0.325602 8.40138 0 7.99972 0C7.59806 0 7.27246 0.325602 7.27246 0.72726V7.2727C7.27246 7.67436 7.59806 8 7.99972 8Z"
//               fill="#515151"
//             />
//           </svg>

//         </button>
//         {/* <Modal
//           open={ConfirmModalFlag}
//           disableBackdropClick={false}
//           aria-labelledby="simple-modal-title"
//           aria-describedby="simple-modal-description">
//           <div
//             className="modal blue-modal fade"
//             // id="addInsuranceModal"
//             tabIndex="-1"
//             aria-labelledby="exampleModalLabel"
//             aria-hidden="true">
//             <div className="modal-dialog modal656 modal-dialog-centered modal-dialog-scrollable">
//               <div className="modal-content">
//                 <div className="modal-header">
//                   <h5 className="modal-title" id="exampleModalLabel">
//                     Confirmation
//                   </h5>
//                 </div>
//                 <div className="modal-body">
//                   Are you sure you want to log out?
//                 </div>

//                 <div className="modal-footer pd-b30">
//                   <button
//                     type="button"
//                     className="s-blue-border-btn m-btn"
//                     data-dismiss="modal"
//                     onClick={() => setConfirmModalFlag(false)}>
//                     Cancel
//                   </button>
//                   <button
//                     type="button"
//                     className="s-blue-btn m-btn"
                    
//                                     //   onClick={handleConfirmLogout}
//                                   >
//                     Confirm
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </Modal> */}
//       </div>
//     </header>
//   );
// };

// export default TopNavigation;
