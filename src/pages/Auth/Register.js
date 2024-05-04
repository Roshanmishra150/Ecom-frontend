import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import "../../styles/AuthStyles.css";
import { toast } from "react-hot-toast";

import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [currentPasswordError, setCurrentPasswordError] = useState("")
  const [data, setData] = useState({
    Name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    answer: "",
  });

  const handleChange = (e) => {
    if(e.target.name == "password"){
      const strongPasswordRegex1 = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%^*?&])[A-Za-z\d@$!%^*?&]{8,}$/;
      if (e.target.value == "" || e.target.value == undefined) {
        setCurrentPasswordError("Please Enter valid and strong");
        setData((prevState) => ({
          ...prevState,
          [e.target.name]: e.target.value,
        }));
      } else if (!strongPasswordRegex1.test(e.target.value)) {
        setCurrentPasswordError("Please Enter Strong Password")
        setData((prevState) => ({
          ...prevState,
          [e.target.name]: e.target.value,
        }));
      }
      else {
        setCurrentPasswordError("");
        setData((prevState) => ({
          ...prevState,
          [e.target.name]: e.target.value,
        }));
      }
    }else{
      setData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(currentPasswordError == ""){
        console.log("running");
        const res = await axios.post(
          `${process.env.REACT_APP_API}/api/v1/auth/register`,
          {
            name: data.Name,
            email: data.email,
            password: data.password,
            address: data.address,
            phone: data.phone,
            answer:data.answer,
          }
        );
        if(res.data.success){
          toast.success(res.data.message)
          navigate('/login')
        }else{
          toast.error(res.data.error)
        }
      }
    } catch (error) {
      toast.error("something went wrong")

    }
  };

  useEffect(() => {
    if (location.pathname.includes("register")) {
      sessionStorage.clear()
      localStorage.clear()
    }
  }, []);

  return (
    <Layout title="Register - E-commerce">
      <div className="form-container" style={{ minHeight: "90vh" }}>
        <form onSubmit={handleSubmit}>
          <h4 className="title">REGISTER FORM</h4>
          <div className="mb-3">
            <input
              type="text"
              value={data.Name}
              name="Name"
              onChange={handleChange}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter Your First Name"
              required
              autoFocus
            />
          </div>

          <div className="mb-3">
            <input
              type="email"
              value={data.email}
              name="email"
              onChange={handleChange}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter Your Email "
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              name="password"
              value={data.password}
              onChange={handleChange}
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Enter Your Password"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              name="phone"
              value={data.phone}
              onChange={handleChange}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter Your Phone"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              name="address"
              value={data.address}
              onChange={handleChange}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter Your Address"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              name="answer"
              value={data.answer}
              onChange={handleChange}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="What is Your Favorite sports"
              required
            />
          </div>
          {
            currentPasswordError != "" ? 
            <p style={{color:"red"}}>
              {currentPasswordError}
            </p>
            : ""
          }
          <button type="submit" className="btn btn-primary">
            REGISTER
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Register;
