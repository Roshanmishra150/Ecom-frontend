import React, { useState } from "react";
import Layout from "../../components/layout/Layout";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
    newPassword: "",
    answer: "",
  });

  const handleChange = (e) => {
    setData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/auth/forgot-password`,
        // "http://localhost:8080/api/v1/auth/forgot-password",
        {
          email: data.email,
          newPassword: data.newPassword,
          answer: data.answer,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
        console.log("changep", res.data.error);
      } else {
        toast.error(res.data.error);
        console.log("changep", res.data.message);
      }
    } catch (error) {
      console.log("changep", error);
      toast.error("Invalid Answer");
        console.log(error);
    }
  };

  return (
    <Layout title="Register - E-commerce">
      <div className="form-container" style={{ minHeight: "90vh" }}>
        <form onSubmit={handleSubmit}>
          <h4 className="title">LOGIN FORM</h4>
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
              value={data.newPassword}
              name="newPassword"
              onChange={handleChange}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter Your newPassword "
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="text"
              value={data.answer}
              name="answer"
              onChange={handleChange}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter Your answer "
              required
            />
          </div>

          {/* <div
            type="button"
            className="mr-b50"
            style={{
              // color:"blue",
              marginBottom:"10px"
            }}
            onClick={()=>{navigate("/forgot-password")}}
          >
            <RiLockPasswordFill style={{marginRight:"5px",marginTop:"-4px"}}/>
            Forgot Password
          </div> */}

          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default ForgotPassword;




