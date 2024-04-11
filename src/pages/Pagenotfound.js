import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { useAuth } from "../context/AuthContext";
import AdminMenu from "../components/layout/AdminMenu";
import UsersMenu from "../pages/User/UsersMenu";

const Pagenotfound = () => {

  const [auth, setAuth] = useAuth()
  const containerStyle = {
    padding: "4rem",
    height: "80vh",
    width:"100%"
  };

  const leftStyle = {
    position: "fixed",
    top: "50px",
    bottom: 0,
    left: 0,
    // width: "25%",
    padding: "20px",
    overflow: "hidden",
  };

  const rightStyle = {
    position: "fixed",
    top: "50px",
    bottom: 0,
    left: auth?.toggle ? "220px" : "50px",
    width: auth?.toggle ? "85.4%"  : "96.6%",
    padding: "20px",
    overflowY: "scroll",
  };

  const lightScrollbarCSS = `
  /* Customize the scrollbar for webkit (Chrome, Safari) */
  ::-webkit-scrollbar {
    width: 10px;
  }
  
  ::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0); /* Light background color */
  }
  
  ::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.3); /* Light thumb color */
    border-radius: 6px; /* Rounded corners for the thumb */
  }
  `;
  return (
    // <Layout title={"go back- page not found"}>
    //   <div className="pnf">
    //     <h1 className="pnf-title">404</h1>
    //     <h2 className="pnf-heading">Oops ! Page Not Found</h2>
    //     <Link to="/" className="pnf-btn">
    //       Go Back
    //     </Link>
    //   </div>
    // </Layout>


    <Layout title="page not found">
      <div style={containerStyle} className="container-fluid m-0 p-4">
        <div className="row ">
          <div style={leftStyle} className="col-md-3 ">
            {auth?.user?.role === 1 ? <AdminMenu /> : <UsersMenu />}
          </div>
          <style>{lightScrollbarCSS}</style>
          <div style={rightStyle} className="col-md-9 ">

          <div className="pnf">
            <h1 className="pnf-title">404</h1>
              <h2 className="pnf-heading">Oops ! Page Not Found</h2>
              {!auth ? (
                <Link to="/" onClick={() => {
                  sessionStorage.clear()
                }} className="pnf-btn">
                  Go Back
                </Link>
              ) : ((auth?.user?.role == "0" ? 
              <Link to="/user/homepage" className="pnf-btn">
              Go Back
                  </Link> : 
                  <Link to="/admin/homepage" className="pnf-btn">
                  Go Back
                </Link>
              )
              )}
          </div>

            
          </div>
        </div>

      
      </div>
    </Layout>
  );
};

export default Pagenotfound;