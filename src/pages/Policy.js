// import React, { useEffect } from "react";
// import Layout from "../components/layout/Layout";
// // import aboutImage from "../"

// const About = () => {

//   useEffect(()=>{
//     sessionStorage.clear()
//     localStorage.clear()
//   },[])

//   return (
//     <Layout title={"E-commerce - About "}>
//       <div className="row d-flex justify-content-between ">
//         <div className="col-md-6 ">
//           <img
//             src="/images/about.jpeg"
//             alt="contactus"
//             style={{ width: "100%" }}
//           />
//         </div>
//         <div className="row">
//           <p className="text-justify mt-2">
//             Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus
//             officiis obcaecati esse tempore unde ratione, eveniet mollitia,
//             perferendis eius temporibus dicta blanditiis doloremque explicabo
//             quasi sunt vero optio cum aperiam vel consectetur! Laborum enim
//             accusantium atque, excepturi sapiente amet! Tenetur ducimus aut
//             commodi illum quidem neque tempora nam.
//           </p>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default About;


import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import AdminMenu from "../components/layout/AdminMenu";
import UsersMenu from "../pages/User/UsersMenu";
import axios from "axios";
import { toast } from "react-hot-toast";
import "antd/dist/reset.css";
import { useLocation, useNavigate } from "react-router-dom";
import { MdDeleteForever } from "react-icons/md";
import { FiEdit2 } from "react-icons/fi";

import '../styles/Homepage.css'
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
import { useAuth } from "../context/AuthContext";

import "../styles/CartStyles.css"
import img1 from '../images/about_img_1.jpg'
import img2 from '../images/about_img_2.jpg'
import img3 from '../images/about_img_3.jpg'

const CreateProduct = () => {
  const location = useLocation()
  const [loading, setLoading] = useState(false);
  const [auth, setAuth] = useAuth();
  const [filterFlag, setFilterFlag] = useState(false);
  const [totalProduct, setTotalProduct] = useState(0);
  const [filterCategory, setFilterCategory] = useState([]);
  const [filterPrice, setFilterPrice] = useState([]);
  const [productLists, setProductLists] = useState([]);
  const [tempProductList, setTempProductList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [allCategory, setAllCategory] = useState([]);
  const navigate = useNavigate();

  const [AllFaqs, setAllFaqs] = useState([])
  const [tempAllFaqs, setTempAllFaqs] = useState([])
  const [askQuestionSearchValue, setAskQuestionSearchValue] = useState("")
  const [askQuestion, setAskQuestion] = useState("")

  const [value, setValue] = React.useState(2);
  const [hover, setHover] = React.useState(-1);

  const priceArray = ["All", "0-10000", "10001-20000", "20001-30000", "above"];

  const labels = {
    0.5: "Useless",
    1: "Useless+",
    1.5: "Poor",
    2: "Poor",
    2.5: "Ok",
    3: "Ok",
    3.5: "Good",
    4: "Good",
    4.5: "Excellent",
    5: "Excellent",
  };

  function getLabelText(value) {
    return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
  }

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 250,
        width: 250,
      },
    },
  };

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
    // left: "25%",
    width: "100%",
    padding: "20px",
    overflowY: "scroll",
  };


  useEffect(() => {
    sessionStorage.clear()
    sessionStorage.clear()
  }, [])

 


  return (
    <Layout title="policy -  E-comm">
      <div style={containerStyle} className="container-fluid m-0 p-4">
        <div className="row ">
          <div style={leftStyle} className="col-md-3 ">
          </div>
          <div style={rightStyle} className="col-md-12 " >
          <div>
            <h2 style={{marginBottom:"20px", textAlign:"center"}}>Privacy Policy</h2>
            <p>At [Company Name], we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information.</p>
            <h5>Data Collection</h5>
            <p>We collect information such as your name, email address, and browsing activity when you interact with our website. This data is collected to provide you with a personalized experience and to improve our services.</p>
            <h5>Data Usage</h5>
            <p>We use the collected data to personalize your experience, improve our services, and communicate with you about updates and promotions. We may also use this information to comply with legal requirements or to protect our rights and the rights of our users.</p>
            <h5>Data Protection</h5>
            <p>We take extensive measures to secure your information and ensure it is not shared with third parties without your consent. Our data protection practices are in compliance with the <a href="https://www.ftc.gov/business-guidance/privacy-security" target="_blank" rel="noopener noreferrer">Federal Trade Commission's (FTC) privacy and security guidelines</a>.</p>
            <h5>Cookies</h5>
            <p>We use cookies to enhance your browsing experience and track usage patterns on our website. You can manage your cookie preferences in your browser settings. For more information.</p>
            <h5>Policy Changes</h5>
            <p>We reserve the right to update our Privacy Policy. Any changes will be communicated on this page.</p>
            <h5>Contact Us</h5>
            <p>If you have any questions or concerns about our Privacy Policy, please <a href="/contact" target="_blank" rel="noopener noreferrer">contact us</a>.</p>
            <h5>Regulatory Compliance</h5>
            <p>Our privacy practices are in compliance with the <a href="https://www.ftc.gov/business-guidance/privacy-security" target="_blank" rel="noopener noreferrer">FTC's guidelines</a> and the <a href="https://www.privacyshield.gov/welcome" target="_blank" rel="noopener noreferrer">EU-U.S. Privacy Shield Framework</a>.</p>
        </div>
            
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProduct;
