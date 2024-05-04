import React, { useEffect, useState } from 'react'
import img from '../images/logo2.png'
import Layout from '../components/layout/Layout'
import { useAuth } from '../context/AuthContext'
import AdminMenu from "../components/layout/AdminMenu";
import UsersMenu from "../pages/User/UsersMenu";
import axios from 'axios';
import { Input, Modal } from "@mui/material";
import toast from 'react-hot-toast';

const FAQS = () => {

    const [auth, setAuth] = useAuth()
    const [AllFaqs, setAllFaqs] = useState([])
    const [tempAllFaqs, setTempAllFaqs] = useState([])
    const [createFaqsFlag, setCreateFaqsFlag] = useState(false)
    const [askQuestionSearchValue, setAskQuestionSearchValue] = useState("")
    const [answerValue, setAnswerValue] = useState("")
    const [questionValue, setQuestionValue] = useState("")

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

    const onChangeAskQuestionSearchHandler = async (e) => {

        const inputValue = e.target.value.toLowerCase(); // Convert input value to lowercase
        if (inputValue != "") {
            const filteredValue = tempAllFaqs.filter((quest) =>
                quest.question.toLowerCase().includes(inputValue)
            );

            setAllFaqs(filteredValue);
            setAskQuestionSearchValue(e.target.value);
        } else {
            getAllFaqsHandler()
            setAskQuestionSearchValue("")
        }
    }

    useEffect(() => {
        getAllFaqsHandler()
    }, [])

    const sendFaqsHandler = async () => {
        try {
            const body = {
                "question": questionValue,
                "answer": answerValue
            }
            const response = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/Faqs`, body)

            if (response?.data?.success) {
                toast.success("Question and Answer is added successfully")
                setCreateFaqsFlag(false)
                setAnswerValue("")
                setQuestionValue("")
                getAllFaqsHandler()
            }
        } catch (error) {

        }
    }

    return (
        <Layout title="Faqs - E-comm">
            <div style={containerStyle} className="container-fluid p-4 m-0">
                <div style={containerStyle} className="container-fluid m-0 p-4">
                    <div className="row ">
                        <div style={leftStyle} className="col-md-3 ">
                            {auth?.user?.role === 1 ? <AdminMenu /> : (auth?.user?.role === 0) ? <UsersMenu /> : ""}
                        </div>
                        <style>{lightScrollbarCSS}</style>
                        {
                            auth?.user?.role == "1" ?
                                <button
                                    type='button'
                                    className='btn btn-primary'
                                    style={{
                                        position: "absolute",
                                        top: 100,
                                        right: 50,
                                        width: "auto",
                                        cursor: "pointer",
                                        zIndex: 20
                                    }}
                                    onClick={() => {
                                        setCreateFaqsFlag(true)
                                    }}
                                >
                                    Create Template
                                </button>
                                : ""
                        }
                        <div style={rightStyle} className="col-md-9 d-flex flex-column align-items-center">
                            <div className='logo'>
                                <img width="300px" height="130px" src={img} alt='logo' />
                            </div>
                            <div className=' w-50'>
                                <input
                                    style={{
                                        width: "100%",
                                        height: "50px",
                                        borderRadius: "10px",
                                        border: "1px solid #000",
                                        outline: "none",
                                        padding: "10px",
                                    }}
                                    value={askQuestionSearchValue}
                                    onChange={(e) => { onChangeAskQuestionSearchHandler(e) }}
                                    type='text'
                                    placeholder='Search Your Question'
                                    className=' w-100'
                                />
                                <div style={{ marginTop: "15px" }}>
                                    {
                                        AllFaqs?.map((item, index) => {
                                            return (
                                                <div key={index} className="accordion" id={`accordionExample-${index}`}>
                                                    <div className="accordion-item">
                                                        <h2 className="accordion-header" id={`heading-${index}`}>
                                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse-${index}`} aria-expanded="false" aria-controls={`collapse-${index}`}>
                                                                {item?.question}
                                                            </button>
                                                        </h2>
                                                        <div id={`collapse-${index}`} className="accordion-collapse collapse" aria-labelledby={`heading-${index}`} data-bs-parent={`#accordionExample-${index}`}>
                                                            <div className="accordion-body">
                                                                {item?.answer}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* open create faq modal */}
                <Modal open={createFaqsFlag} style={{ width: "100px" }}>
                    <div
                        className={
                            createFaqsFlag ? "modal cus-modal fade show" : "modal cus-modal fade"
                        }
                        id="GreetingnModal"
                        tabIndex={-1}
                        aria-labelledby="exampleModalLabel"
                        style={createFaqsFlag ? { display: "block" } : { display: "none" }}
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
                                        onClick={() => setCreateFaqsFlag(false)}
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
                                        onChange={(e) => setQuestionValue(e.target.value)}
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
                                            sendFaqsHandler()
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
    )
}

export default FAQS