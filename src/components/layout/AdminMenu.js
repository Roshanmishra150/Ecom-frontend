import React, { useEffect, useState } from "react"; 
import { LuLayoutDashboard } from "react-icons/lu";
import { MdOutlineCategory } from "react-icons/md";
import { SiElement, SiTruenas } from "react-icons/si";
import { FaJediOrder, FaUsers } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { AiOutlineLogout } from "react-icons/ai";
import { NavLink, useLocation } from "react-router-dom";
import { IoHome } from "react-icons/io5";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

import logo from "../../logo4.png";
import { Tooltip } from "antd";
import { MdPayment } from "react-icons/md";


// const AdminMenu = () => {
//   const [activeLink, setActiveLink] = useState("/admin/dashboard");
//   const location = useLocation();
//   const [auth, setAuth] = useAuth();

//   const handleNavLinkClick = (to) => {
//     setActiveLink(to);
//   };

//   // useEffect(() => {
//   //   if (location.pathname === "/admin/create-product") {
//   //     setActiveLink("/admin/manage-product");
//   //   } else {
//   //     setActiveLink("");
//   //   }
//   // }, [location.pathname]);

//   return (
//     <>
//       <div className="text-left ">
//         <h3 className=" text-center">Admin Panel</h3>
//         <div className="list-group">
//           <NavLink
//             to="/admin/homepage"
//             className={`list-group-item list-group-item-action `}
//             onClick={() => handleNavLinkClick("/")}
//           >
//             <IoHome style={{ fontSize: "22px", marginRight: "15px" }} />
//             Home
//           </NavLink>
          
//           <NavLink
//             to="/admin/create-category"
//             className={`list-group-item list-group-item-action`}
//             onClick={() => handleNavLinkClick("/admin/create-category")}
//           >
//             <MdOutlineCategory
//               style={{ fontSize: "22px", marginRight: "15px" }}
//             />
//             Manage Category
//           </NavLink>
//           <NavLink
//             to="/admin/manage-product"
//             className={`list-group-item list-group-item-action ${
//               activeLink === "/admin/manage-product" ? "active" : ""
//             }`}
//             onClick={() => handleNavLinkClick("/admin/manage-product")}
//           >
//             <SiElement style={{ fontSize: "22px", marginRight: "10px" }} />{" "}
//             Manage Product
//           </NavLink>
//           <NavLink
//             to="/admin/users"
//             className={`list-group-item list-group-item-action  `}
//             onClick={() => handleNavLinkClick("/admin/users")}
//           >
//             <FaUsers style={{ fontSize: "22px", marginRight: "10px" }} /> Users
//           </NavLink>
//           <NavLink
//             to="/admin/orders"
//             className={`list-group-item list-group-item-action  `}
//             onClick={() => handleNavLinkClick("/admin/orders")}
//           >
//             <FaJediOrder style={{ fontSize: "22px", marginRight: "10px" }} />{" "}
//             Manage Order
//           </NavLink>
//           <NavLink
//             to="/admin/setting"
//             className={`list-group-item list-group-item-action  `}
//             onClick={() => handleNavLinkClick("/admin/setting")}
//           >
//             <FiSettings style={{ fontSize: "22px", marginRight: "10px" }} />{" "}
//             Setting
//           </NavLink>
//           {auth?.user ? (
//             <NavLink
//               to="/login"
//               className={`list-group-item list-group-item-action  `}
//               onClick={() => {
//                 setAuth({
//                   ...auth,
//                   user: null,
//                   token: "",
//                 });
//                 sessionStorage.removeItem("user");
//                 sessionStorage.removeItem("token");
//                 sessionStorage.clear()
//                 toast.success("Successfully Logout");
//               }}
//             >
//               <AiOutlineLogout
//                 style={{ fontSize: "22px", marginRight: "10px" }}
//               />{" "}
//               Logout
//             </NavLink>
//           ) : (
//             <>
//               <NavLink
//                 to="/login"
//                 className={`list-group-item list-group-item-action  `}
//                   // onClick={() => handleNavLinkClick("/admin/setting")}
//                   onClick={() => {
//                     sessionStorage.clear()
//                   }}
//               >
//                 <AiOutlineLogout style={{ fontSize: "22px", marginRight: "10px" }} />{" "}
//                 Login
//               </NavLink>
//             </>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };



const AdminMenu = (props) => {
  const [userRoleId, setUserRoleId] = useState("");
  const [auth, setAuth] = useAuth();
  const [toggle, setToggle] = useState(auth?.toggle ? auth?.toggle : false);
  

  console.log("auth sidebar", auth);

  // useEffect(() => {
  //   // let loginData = sessionStorage.getItem("userLoginId");
  //   let loginData = Decryption(sessionStorage.getItem("userLoginId"));

  //   setUserRoleId(loginData.role_id);
  // }, []);

  return (
    <aside className={!toggle ? "sidebar" : "sidebar-wrap"}>
      {!toggle ? (
        <div
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
            marginTop:"1px",
            marginBottom: "50px",
            cursor: "pointer",
            paddingLeft: "3px",
          }}
        >
          <div
            style={{
              width: "22px",
              height: "3px",
              backgroundColor: "#ffffff",
              margin: "6px 0px",
            }}
          ></div>
          <div
            style={{
              width: "22px",
              height: "3px",
              backgroundColor: "#ffffff",
              margin: "6px 0px",
            }}
          ></div>
          <div
            style={{
              width: "22px",
              height: "3px",
              backgroundColor: "#ffffff",
              margin: "6px 0px",
            }}
          ></div>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
            marginTop: "-10px",
            cursor: "pointer",
          }}
        >
            <div className="sides-logod"
            onClick={() => {
              setAuth({
                user: auth.user,
                token: auth.token,
                toggle: !toggle
              });
              setToggle(!toggle);
              }}
              style={{
              marginLeft:"2px"
            }}>
              <img className="vec1ss" height={"50px"} width={"140px"} src={logo} alt="" />
            </div>
            
          <div
            style={{ paddingTop: "1px", marginBottom: "35px", marginLeft:"6px" }}
            onClick={() => {
              setAuth({
                user: auth.user,
                token: auth.token,
                toggle: !toggle
              });
              setToggle(!toggle);
            }}
          >
            <div
              style={{
                width: "22px",
                height: "3px",
                backgroundColor: "#ffffff",
                margin: "6px 0px",
              }}
            ></div>
            <div
              style={{
                width: "22px",
                height: "3px",
                backgroundColor: "#ffffff",
                margin: "6px 0px",
              }}
            ></div>
            <div
              style={{
                width: "23px",
                height: "4px",
                backgroundColor: "#ffffff",
                margin: "6px 0px",
              }}
            ></div>
          </div>
        </div>
      )}
      <nav className="side-nav align-items-center">
        <ul>
          <li className="active-link">
            {!toggle ? (
              <Tooltip placement="right" title="Dashboard">
                <NavLink
                  to={"/admin/dashboard"}
                  style={{ paddingLeft: "3px", textDecoration:"none"  }}
                  exact
                >
                  <LuLayoutDashboard style={{ fontSize: '22px', marginRight:"5px" }}/>
                  {!toggle ? "" : <span style={{fontSize:"16px"}}>Dashboard</span>}
                </NavLink>
              </Tooltip>
            ) : (
              <NavLink
                to={"/admin/dashboard"}
                style={{ paddingLeft: "3px", textDecoration:"none"  }}
                exact
              >
                <LuLayoutDashboard style={{ fontSize: '22px', marginRight:"5px" }}/>
                {!toggle ? "" : <span style={{fontSize:"16px"}}>Dashboard</span>}
              </NavLink>
            )}
          </li>

          <li>
            {!toggle ? (
              <Tooltip placement="right" title="Home">
                <NavLink
                  to={"/admin/homepage"}
                  style={{ paddingLeft: "2px", textDecoration:"none"  }}
                >
                  <IoHome style={{ fontSize: '22px', marginRight:"5px" }}/>
                  {!toggle ? "" : <span style={{fontSize:"16px"}}>Home</span>}
                </NavLink>
              </Tooltip>
            ) : (
              <NavLink to={"/admin/homepage"} style={{ paddingLeft: "2px", textDecoration:"none"  }}>
                <IoHome style={{ fontSize: '22px', marginRight:"5px" }}/>
                {!toggle ? "" : <span style={{fontSize:"16px"}}>Homes</span>}
              </NavLink>
            )}
          </li>
          <li className="active-link">
            {!toggle ? (
              <Tooltip placement="right" title="Manage categories">
                <NavLink
                  to={"/admin/create-category"}
                  style={{ paddingLeft: "3px", textDecoration:"none"  }}
                  exact
                >
                  <MdOutlineCategory
              style={{ fontSize: "22px", marginRight: "-1px" }}
            />
                  {!toggle ? "" : <span style={{fontSize:"16px"}}>Categories</span>}
                </NavLink>
              </Tooltip>
            ) : (
              <NavLink
                to={"/admin/create-category"}
                style={{ paddingLeft: "3px", textDecoration:"none"  }}
                exact
              >
                <MdOutlineCategory
              style={{ fontSize: "22px", marginRight: "8px" }}
            />
                {!toggle ? "" : <span style={{fontSize:"16px" , marginLeft:"14px"}}>Categories</span>}
              </NavLink>
            )}
          </li>
          <li className="active-link">
            {!toggle ? (
              <Tooltip placement="right" title="Manage Product">
                <NavLink
                  to={"/admin/manage-product"}
                  style={{ paddingLeft: "3px", textDecoration:"none"  }}
                  exact
                >
                  <SiElement style={{ fontSize: "22px", marginRight: "10px" }} />
                  {!toggle ? "" : <span style={{fontSize:"16px"}}>Product</span>}
                </NavLink>
              </Tooltip>
            ) : (
              <NavLink
                to={"/admin/manage-product"}
                style={{ paddingLeft: "3px", textDecoration:"none"  }}
                exact
              >
                <SiElement style={{ fontSize: "22px", marginRight: "10px" }} />
                {!toggle ? "" : <span style={{fontSize:"16px" , marginLeft:"14px"}}>Product</span>}
              </NavLink>
            )}
          </li>

          
          <li>
            {!toggle ? (
              <Tooltip placement="right" title="Manage Users">
                <NavLink
                  to={"/admin/users"}
                  style={{ paddingLeft: "2px", textDecoration:"none"  }}
                >
                  <FaUsers style={{ fontSize: "22px", marginRight: "10px" }} />
                  {!toggle ? "" : <span style={{fontSize:"16px"}}>Users</span>}
                </NavLink>
              </Tooltip>
            ) : (
              <NavLink to={"/admin/users"} style={{ paddingLeft: "2px", textDecoration:"none"  }}>
                <FaUsers style={{ fontSize: "22px", marginRight: "10px" }} />
                {!toggle ? "" : <span style={{fontSize:"16px" , marginLeft:"14px"}}>Users</span>}
              </NavLink>
            )}
          </li>

          <li>
            {!toggle ? (
              <Tooltip placement="right" title="Manage Orders">
                <NavLink
                  to={"/admin/orders"}
                  style={{ paddingLeft: "2px", textDecoration:"none"  }}
                >
                 <FaJediOrder style={{ fontSize: "22px", marginRight: "10px" }}/> 
                  {!toggle ? "" : <span style={{fontSize:"16px"}}>Orders</span>}
                </NavLink>
              </Tooltip>
            ) : (
              <NavLink to={"/admin/orders"} style={{ paddingLeft: "0px", textDecoration:"none"  }}>
               <FaJediOrder style={{ fontSize: "22px", marginRight: "10px" }}/> 
                {!toggle ? "" : <span style={{fontSize:"16px", marginLeft:"14px"}}>Orders</span>}
              </NavLink>
            )}
          </li>
          <li>
            {!toggle ? (
              <Tooltip placement="right" title="Settings">
                <NavLink
                  to={"/admin/setting"}
                  style={{ paddingLeft: "2px", textDecoration:"none"  }}
                >
                  <FiSettings style={{ fontSize: '22px', marginRight:"5px" }}/> 
                  {!toggle ? "" : <span style={{fontSize:"16px"}}>Setting</span>}
                </NavLink>
              </Tooltip>
            ) : (
              <NavLink to={"/admin/setting"} style={{ paddingLeft: "2px", textDecoration:"none"  }}>
                <FiSettings style={{ fontSize: '22px', marginRight:"5px" }}/> 
                {!toggle ? "" : <span style={{fontSize:"16px"}}>Settings</span>}
              </NavLink>
            )}
          </li>
          <li className="comeingSoons">
            {!toggle ? (
              <Tooltip placement="right" title="Coming Soon!!!" 
              color={"#7FBDA8"}
              // sty={{
              //   color:"#fff",
              //   backgroundColor:"#7FBDA8"
              // }}
              >
                <NavLink
                  // to={"/admin/transactions"}
                  style={{ paddingLeft: "2px", textDecoration:"none"  }}
                >
                  <MdPayment style={{ fontSize: '22px', marginRight:"5px" }}/> 
                  {!toggle ? "" : <span style={{fontSize:"16px"}}>Transactions</span>}
                  {/* <span style={{
                    width:"200px",
                    backgroundColor:"aliceblue",
                    zIndex:4
                  }}> coming soon!</span> */}
                </NavLink>
              </Tooltip>
            ) : (
              <NavLink 
              // to={"/admin/transactions"}
               style={{ paddingLeft: "2px", textDecoration:"none"  }}>
                <MdPayment style={{ fontSize: '22px', marginRight:"5px" }}/> 
                {!toggle ? "" : <span style={{fontSize:"16px"}}>Transactions</span>}
              </NavLink>
            )}
          </li>
          <li>
            {!toggle ? (
              <Tooltip placement="right" title="Logout">
                <NavLink
                  to={"/login"}
                  onClick={() => {
                    setAuth({
                      ...auth,
                      user: null,
                      token: "",
                    });
                    sessionStorage.removeItem("user");
                    sessionStorage.removeItem("token");
                    sessionStorage.clear()
                    toast.success("Successfully Logout");
                  }}
                  style={{ paddingLeft: "2px", textDecoration:"none" }}
                >
                  <AiOutlineLogout style={{ fontSize: "22px", marginRight: "5px" }} />
                  {!toggle ? "" : <span style={{fontSize:"16px"}}>Logout</span>}
                </NavLink>
              </Tooltip>
            ) : (
                <NavLink to={"/login"}
                onClick={() => {
                  setAuth({
                    ...auth,
                    user: null,
                    token: "",
                  });
                  sessionStorage.removeItem("user");
                  sessionStorage.removeItem("token");
                  sessionStorage.clear()
                  toast.success("Successfully Logout");
                }}
                  style={{ paddingLeft: "2px", textDecoration: "none" }}>
                <AiOutlineLogout style={{ fontSize: "22px", marginRight: "5px" }} />
                {!toggle ? "" : <span style={{fontSize:"16px"}}>Logout</span>}
              </NavLink>
            )}
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default AdminMenu;
