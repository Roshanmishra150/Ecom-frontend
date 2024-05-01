import React, { useEffect, useState } from 'react'
import img from '../../images/logo2.png'
import Layout from '../../components/layout/Layout'
import { useAuth } from '../../context/AuthContext'
import AdminMenu from "../../components/layout/AdminMenu";
import UsersMenu from "../../pages/User/UsersMenu";
import axios from 'axios';
import img1 from '../../images/about_img_1.jpg'
import img2 from '../../images/about_img_2.jpg'
import img3 from '../../images/about_img_3.jpg'
import toast from 'react-hot-toast';

const AboutRole = () => {

    const [auth, setAuth] = useAuth()
    const [AllFaqs, setAllFaqs] = useState([])
    const [tempAllFaqs, setTempAllFaqs] = useState([])
    const [askQuestionSearchValue, setAskQuestionSearchValue] = useState("")
    const [askQuestion, setAskQuestion] = useState("")

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
        width: "100%"
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
        width: auth?.toggle ? "85.4%" : "96.6%",
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

    const getAllFaqsHandler = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/get-Faqs`);

            if (res?.data?.success) {
                setAllFaqs(res?.data?.FAQS)
                setTempAllFaqs(res?.data?.FAQS)
            }
        } catch (error) {

        }
    }

    useEffect(() => {
        getAllFaqsHandler()
    }, [])

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API}/api/v1/auth/sendNotification`,
                {
                  title: "Ask Question",
                  question: askQuestion,
                  senderId: auth?.user?._id,
                  recipientId: "65da2a7a61f58a117d116bcd",
                }
              );
              if (response?.data?.success == true) {
                toast.success(response?.data?.message);
                setAskQuestion("")
                } else {
                toast.error(response?.data?.message);
              }
        } catch (error) {
            
        }
        // Here you can handle form submission, such as sending data to a server or displaying a success message
    };


    return (
        <Layout title="about - E-comm">
            <div style={containerStyle} className="container-fluid p-4 m-0">
                <div style={containerStyle} className="container-fluid m-0 p-4">
                    <div className="row ">
                        <div style={leftStyle} className="col-md-3 ">
                            {auth?.user?.role === 1 ? <AdminMenu /> : (auth?.user?.role === 0) ? <UsersMenu /> : ""}
                        </div>
                        <style>{lightScrollbarCSS}</style>
                        <div style={rightStyle} className="col-md-12 ">
                            <div className="row contactus " style={{ marginBottom: "25px" }}>
                                <div className="col-md-6 ">
                                    <img
                                        src={img1}
                                        alt="contactus"
                                        style={{ width: "100%" }}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <p className="text-justify " style={{ marginTop: "55px" }}>
                                        Welcome to Your E-commerce Store, where shopping meets convenience and quality. At Your E-commerce Store, we're passionate about providing you with the best online shopping experience possible.
                                    </p>
                                </div>
                            </div>
                            <div className="row contactus " style={{ marginBottom: "25px" }}>

                                <div className="col-md-6" style={{ marginTop: "55px" }}>
                                    <p className="text-justify ">
                                        Our journey began with a simple idea: to create a platform that offers a wide selection of products, from everyday essentials to unique finds, all in one place. With a focus on user-friendly navigation and seamless transactions, we strive to make your shopping journey as effortless as possible.</p>

                                    <p>What sets us apart is our commitment to quality. We work closely with trusted suppliers and brands to bring you products that meet the highest standards of craftsmanship and durability. Whether you're shopping for fashion, electronics, home goods, or gifts, you can trust that every item in our collection has been carefully curated with your satisfaction in mind
                                    </p>
                                </div>
                                <div className="col-md-6 ">
                                    <img
                                        src={img2}
                                        alt="contactus"
                                        style={{ width: "100%" }}
                                    />
                                </div>
                            </div>
                            <div className="row contactus " style={{ marginBottom: "25px" }}>
                                <div className="col-md-6 ">
                                    <img
                                        src={img3}
                                        alt="contactus"
                                        style={{ width: "100%" }}
                                    />
                                </div>
                                <div className="col-md-6" style={{ marginTop: "55px" }}>
                                    <p className="text-justify ">
                                        But we're more than just an online store. We're a community of shoppers, enthusiasts, and trendsetters united by our love for great deals and exceptional products. From our dedicated customer support team to our active social media presence, we're here to listen, engage, and inspire.

                                        Join us on this journey as we continue to evolve and grow, bringing you the latest trends, unbeatable deals, and unmatched convenience. Thank you for choosing Your E-commerce Store . Happy shopping!
                                    </p>
                                </div>
                            </div>
                            <div className="container d-flex justify-content-center align-items-center" style={{ height: "70vh" }}>
                                <form onSubmit={handleSubmit} style={{width:"60%"}} >
                                <h1 style={{marginBottom:"20px"}}>Ask Your Question</h1>
                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label">Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="name"
                                            name="name"
                                            placeholder="Enter your name"
                                            value={auth?.user?.name}
                                            disabled
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email address</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            name="email"
                                            placeholder="Enter email"
                                            value={auth?.user?.email}
                                            disabled

                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="message" className="form-label">Your Question</label>
                                        <textarea
                                            className="form-control"
                                            id="message"
                                            rows="3"
                                            name="message"
                                            placeholder="Enter your question"
                                            value={askQuestion}
                                            onChange={(e)=>{setAskQuestion(e.target.value)}}
                                            required
                                        ></textarea>
                                    </div>

                                    <button type="submit" className="btn btn-primary">Submit</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default AboutRole