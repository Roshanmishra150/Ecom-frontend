

import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../../logo4.png";
import { Tooltip } from "antd";
import { IoHome } from "react-icons/io5";
import { LuLayoutDashboard } from "react-icons/lu";
import { FaJediOrder } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { AiOutlineLogout } from "react-icons/ai";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { BsClipboard2HeartFill } from "react-icons/bs";
import { MdPayment } from "react-icons/md";

const SideNavigation = props => {
    const [userRoleId, setUserRoleId] = useState("");
    const [auth, setAuth] = useAuth();
    const [toggle, setToggle] = useState(auth?.toggle ? auth?.toggle : false);

    console.log(" toggle", toggle);
    console.log("auth sidebar", auth);

    // useEffect(() => {
    //   setAuth({
    //     user: auth.user,
    //     token: auth.token,
    //     toggle: true
    // });
    // }, []);

    return (
        <aside className={!toggle ? "sidebar" : "sidebar-wrap"}>
            {!toggle
                ? <div
                    onClick={() => {
                        setAuth({
                            user: auth.user,
                            token: auth.token,
                            toggle: !toggle
                        });
                        setToggle(!toggle);
                        // props.toggleData(!toggle);
                    }}
                    style={{
                        marginTop: "1px",
                        marginBottom: "50px",
                        cursor: "pointer",
                        paddingLeft: "3px"
                    }}
                >
                    <div
                        style={{
                            width: "22px",
                            height: "3px",
                            backgroundColor: "#ffffff",
                            margin: "6px 0px"
                        }}
                    />
                    <div
                        style={{
                            width: "22px",
                            height: "3px",
                            backgroundColor: "#ffffff",
                            margin: "6px 0px"
                        }}
                    />
                    <div
                        style={{
                            width: "22px",
                            height: "3px",
                            backgroundColor: "#ffffff",
                            margin: "6px 0px"
                        }}
                    />
                </div>
                : <div
                    // onClick={() => {
                    //   setToggle(!toggle);
                    //   props.toggleData(!toggle);
                    // }}
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "10px",
                        marginTop: "-10px",
                        cursor: "pointer"
                    }}
                >
                    <div
                        className="sides-logod"
                        onClick={() => {
                            setAuth({
                                user: auth.user,
                                token: auth.token,
                                toggle: !toggle
                            });
                            setToggle(!toggle);
                        }}
                        style={{
                            marginLeft: "2px"
                        }}
                    >
                        <img
                            className="vec1ss"
                            height={"50px"}
                            width={"140px"}
                            src={logo}
                            alt=""
                        />
                    </div>

                    <div
                        style={{
                            paddingTop: "1px",
                            marginBottom: "35px",
                            marginLeft: "6px"
                        }}
                        onClick={() => {
                            setAuth({
                                user: auth.user,
                                token: auth.token,
                                toggle: !toggle
                            });
                            setToggle(!toggle);
                            // props.toggleData(!toggle);
                        }}
                    >
                        <div
                            style={{
                                width: "22px",
                                height: "3px",
                                backgroundColor: "#ffffff",
                                margin: "6px 0px"
                            }}
                        />
                        <div
                            style={{
                                width: "22px",
                                height: "3px",
                                backgroundColor: "#ffffff",
                                margin: "6px 0px"
                            }}
                        />
                        <div
                            style={{
                                width: "23px",
                                height: "4px",
                                backgroundColor: "#ffffff",
                                margin: "6px 0px"
                            }}
                        />
                    </div>
                </div>}
            <nav className="side-nav align-items-center">
                <ul>
                    <li className="active-links" >
                        {!toggle
                            ? <Tooltip placement="right" title="Coming Soon!!!" color={"#7FBDA8"}>
                                <NavLink
                                    // to={"/user/dashboard"}
                                    style={{
                                        paddingLeft: "3px",
                                        textDecoration: "none"
                                    }}

                                    exact
                                >
                                    <LuLayoutDashboard
                                        style={{
                                            fontSize: "22px",
                                            marginRight: "5px"
                                        }}
                                    />
                                    {!toggle
                                        ? ""
                                        : <span style={{ fontSize: "16px" }}>
                                            Dashboard
                                        </span>}
                                </NavLink>
                            </Tooltip>
                            : <NavLink
                                // to={"/user/dashboard"}
                                style={{
                                    paddingLeft: "3px",
                                    textDecoration: "none"
                                }}

                                exact
                            >
                                <LuLayoutDashboard
                                    style={{
                                        fontSize: "22px",
                                        marginRight: "5px"
                                    }}
                                />

                                <span style={{ fontSize: "16px" }}>
                                    Dashboard
                                </span>
                            </NavLink>}
                    </li>

                    <li>
                        {!toggle
                            ? <Tooltip placement="right" title="Home">
                                <NavLink
                                    to={"/user/homepage"}
                                    style={{
                                        paddingLeft: "2px",
                                        textDecoration: "none"
                                    }}

                                >
                                    <IoHome
                                        style={{
                                            fontSize: "22px",
                                            marginRight: "5px"
                                        }}
                                    />
                                    {!toggle
                                        ? ""
                                        : <span style={{ fontSize: "16px" }}>
                                            Home
                                        </span>}
                                </NavLink>
                            </Tooltip>
                            : <NavLink
                                to={"/user/homepage"}
                                style={{
                                    paddingLeft: "2px",
                                    textDecoration: "none"
                                }}

                            >
                                <IoHome
                                    style={{
                                        fontSize: "22px",
                                        marginRight: "5px"
                                    }}
                                />
                                {!toggle
                                    ? ""
                                    : <span style={{ fontSize: "16px" }}>
                                        Homes
                                    </span>}
                            </NavLink>}
                    </li>
                    <li>
                        {!toggle
                            ? <Tooltip placement="right" title="Orders">
                                <NavLink
                                    to={"/user/orders"}
                                    style={{
                                        paddingLeft: "2px",
                                        textDecoration: "none"
                                    }}

                                >
                                    <FaJediOrder
                                        style={{
                                            fontSize: "22px",
                                            marginRight: "10px"
                                        }}
                                    />
                                    {!toggle
                                        ? ""
                                        : <span style={{ fontSize: "16px" }}>
                                            Order
                                        </span>}
                                </NavLink>
                            </Tooltip>
                            : <NavLink
                                to={"/user/orders"}
                                style={{
                                    paddingLeft: "2px",
                                    textDecoration: "none"
                                }}

                            >
                                <FaJediOrder
                                    style={{
                                        fontSize: "22px",
                                        marginRight: "10px"
                                    }}
                                />
                                {!toggle
                                    ? ""
                                    : <span style={{ fontSize: "16px" }}>
                                        Order
                                    </span>}
                            </NavLink>}
                    </li>
                    <li>
                        {!toggle
                            ? <Tooltip placement="right" title="Coming Soon!!!" color={"#7FBDA8"}>
                                <NavLink
                                    // to={"/user/wishlist"}
                                    style={{
                                        paddingLeft: "2px",
                                        textDecoration: "none"
                                    }}

                                >
                                    <BsClipboard2HeartFill 
                                        style={{
                                            fontSize: "22px",
                                            marginRight: "10px"
                                        }}
                                    />
                                    {!toggle
                                        ? ""
                                        : <span style={{ fontSize: "16px" }}>
                                            Wishlist
                                        </span>}
                                </NavLink>
                            </Tooltip>
                            : <NavLink
                                // to={"/user/wishlist"}
                                style={{
                                    paddingLeft: "2px",
                                    textDecoration: "none"
                                }}

                            >
                                <BsClipboard2HeartFill
                                    style={{
                                        fontSize: "22px",
                                        marginRight: "10px"
                                    }}
                                />
                                {!toggle
                                    ? ""
                                    : <span style={{ fontSize: "16px" }}>
                                        Wishlist
                                    </span>}
                            </NavLink>}
                    </li>
                    <li>
                        {!toggle
                            ? <Tooltip placement="right" title="Settings">
                                <NavLink
                                    to={"/user/setting"}
                                    style={{
                                        paddingLeft: "2px",
                                        textDecoration: "none"
                                    }}
                                >
                                    <FiSettings
                                        style={{
                                            fontSize: "22px",
                                            marginRight: "5px"
                                        }}
                                    />
                                    {!toggle
                                        ? ""
                                        : <span style={{ fontSize: "16px" }}>
                                            Setting
                                        </span>}
                                </NavLink>
                            </Tooltip>
                            : <NavLink
                                to={"/user/setting"}
                                style={{
                                    paddingLeft: "2px",
                                    textDecoration: "none"
                                }}
                            >
                                <FiSettings
                                    style={{
                                        fontSize: "22px",
                                        marginRight: "5px"
                                    }}
                                />
                                {!toggle
                                    ? ""
                                    : <span style={{ fontSize: "16px" }}>
                                        Settings
                                    </span>}
                            </NavLink>}
                    </li>
                    <li>
                        {!toggle
                            ? <Tooltip placement="right" title="Coming Soon!!!" color={"#7FBDA8"}>
                                <NavLink
                                    // to={"/user/transactions"}
                                    style={{
                                        paddingLeft: "2px",
                                        textDecoration: "none"
                                    }}
                                >
                                    <MdPayment
                                        style={{
                                            fontSize: "22px",
                                            marginRight: "5px"
                                        }}
                                    />
                                    {!toggle
                                        ? ""
                                        : <span style={{ fontSize: "16px" }}>
                                            Transactions
                                        </span>}
                                </NavLink>
                            </Tooltip>
                            : <NavLink
                                // to={"/user/transactions"}
                                style={{
                                    paddingLeft: "2px",
                                    textDecoration: "none"
                                }}
                            >
                                <MdPayment
                                    style={{
                                        fontSize: "22px",
                                        marginRight: "5px"
                                    }}
                                />
                                {!toggle
                                    ? ""
                                    : <span style={{ fontSize: "16px" }}>
                                        Transactions
                                    </span>}
                            </NavLink>}
                    </li>
                    <li>
                        {!toggle
                            ? <Tooltip placement="right" title="Logout">
                                <NavLink
                                    to={"/login"}
                                    onClick={() => {
                                        setAuth({
                                            ...auth,
                                            user: null,
                                            token: ""
                                        });
                                        sessionStorage.removeItem("user");
                                        sessionStorage.removeItem("token");
                                        sessionStorage.clear();
                                        toast.success("Successfully Logout");
                                    }}
                                    style={{
                                        paddingLeft: "2px",
                                        textDecoration: "none"
                                    }}
                                >
                                    <AiOutlineLogout
                                        style={{
                                            fontSize: "22px",
                                            marginRight: "5px"
                                        }}
                                    />
                                    {!toggle
                                        ? ""
                                        : <span style={{ fontSize: "16px" }}>
                                            Logout
                                        </span>}
                                </NavLink>
                            </Tooltip>
                            : <NavLink
                                to={"/login"}
                                onClick={() => {
                                    setAuth({
                                        ...auth,
                                        user: null,
                                        token: ""
                                    });
                                    sessionStorage.removeItem("user");
                                    sessionStorage.removeItem("token");
                                    sessionStorage.clear();
                                    toast.success("Successfully Logout");
                                }}
                                style={{
                                    paddingLeft: "2px",
                                    textDecoration: "none"
                                }}
                            >
                                <AiOutlineLogout
                                    style={{
                                        fontSize: "22px",
                                        marginRight: "5px"
                                    }}
                                />
                                {!toggle
                                    ? ""
                                    : <span style={{ fontSize: "16px" }}>
                                        Logout
                                    </span>}
                            </NavLink>}
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default SideNavigation;
