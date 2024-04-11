import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import UsersMenu from "./UsersMenu";
import { useAuth } from "../../context/AuthContext";
import AdminMenu from "../../components/layout/AdminMenu";
import List from "@mui/material/List";
import axios from "axios";
import moment from "moment";
import { Modal } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";



const style = {
    width: "100%",
    maxWidth: "95%",
    bgcolor: "background.paper",
};

const Orders = () => {
    const [auth, setAuth] = useAuth();
    const [loading, setLoading] = useState(false);
    const [invoiceFlag, setInvoiceFlag] = useState(false);
    const [viewOrderFlag, setViewOrderFlag] = useState(false);
    const [trackingFlag, setTrackingFlag] = useState(false);
    const [totalCost, setTotalCost] = useState(0);
    const [invoiceDetails, setInvoiceDetails] = useState({});
    const [orderList, setOrderList] = useState({});
    const navigate = useNavigate()

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
        width: auth?.toggle ? "85.4%" : "96.6%",
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

    const getOrdersDetailsFunc = async () => {
        const response = await axios.get(
            `${process.env.REACT_APP_API}/api/v1/auth/getUserOrders/${auth?.user?._id}`
        );

        if (response?.data?.success) {
            setOrderList(response?.data?.orders)
            console.log("orderList resp", response.data);
        }
    }

    useEffect(() => {
        getOrdersDetailsFunc()
    }, [])

    console.log("orderList", orderList);


    const invoiceDetailsHandler = (id) => {
        const foundOrder = orderList.find(order => order._id === id)
        setInvoiceDetails(foundOrder)
        foundOrder?.products?.map((item, index) => {
        })
    }

    useEffect(() => {
        setTotalCost(0)
        if (invoiceDetails) {
            invoiceDetails?.products?.map((item, index) => {
                setTotalCost((prev) => prev + item?.totalCost)
            })
        }

    }, [invoiceDetails])


    const changeStatusOfOrder = async (orderId, status) => {
        try {
            setLoading(true)
            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/ordersStatus`, {
                orderId: orderId,
                status: status
            })

            if (data?.success === true) {
                toast.success(`Order ${status} successfully`)
                getOrdersDetailsFunc()
                setLoading(false)
            }
        } catch (error) {
            toast.error(`Something went wrong while ${status} orders`);
            //   setFilterFlag(false)
        }
    }

    return (
        <Layout title="create-product admin">
            <div style={containerStyle} className="container-fluid m-0 p-4">
                <div className="row ">
                    <div style={leftStyle} className="col-md-3 ">
                        {auth?.user?.role === 1 ? <AdminMenu /> : <UsersMenu />}
                    </div>
                    <style>{lightScrollbarCSS}</style>
                    <div style={rightStyle} className="col-md-9 ">
                        <h2>Your Orders</h2>
                        {
                            (loading === false && orderList.length > 0) ? orderList?.map((item, index) => {
                                return (
                                    <List
                                        sx={style}
                                        component="nav"
                                        aria-label="mailbox folders"
                                    >
                                        {loading ? (
                                            <>
                                                <div
                                                    className="loader"
                                                    style={{ top: "250px" }}
                                                ></div>
                                                <p
                                                    className="loadingPara"
                                                    style={{
                                                        top: "257px",
                                                        marginLeft: "30px",
                                                    }}
                                                >
                                                    Loading...
                                                </p>
                                            </>
                                        ) : (
                                            // <div className="" style={{padding:"4px", boxShadow: "0 0 15px rgba(62, 62, 62, 0.5)"}}>
                                            <div className="cardHover" style={{ padding: "4px", cursor: "pointer" }} onClick={() => {
                                                console.log("item click", item);
                                                // navigate(`/user/orders#${index}`)
                                            }}>
                                                {/* // <div className="" style={{padding:"4px", border:"1px solid lightgray"}}> */}
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <h2>Order Id: <span style={{ fontSize: "20px" }}>{item._id}</span></h2>
                                                    <div>
                                                        <button
                                                            className="btn btn-primary"
                                                            style={{ marginRight: "20px" }}
                                                            onClick={() => {
                                                                navigate(`/user/vieworders/${item._id}`)
                                                                // invoiceDetailsHandler(item._id)
                                                                // setInvoiceFlag(true)
                                                                // setTotalCost(0)
                                                            }}
                                                        >
                                                            View Order
                                                        </button>
                                                        <button
                                                            className="btn btn-primary"
                                                            style={{ marginRight: "20px" }}
                                                            onClick={() => {
                                                                invoiceDetailsHandler(item._id)
                                                                setInvoiceFlag(true)
                                                                // setTotalCost(0)
                                                            }}
                                                        >
                                                            Invoice
                                                        </button>
                                                        <button className="btn btn-primary"
                                                            onClick={() => {
                                                                invoiceDetailsHandler(item._id)
                                                                setTrackingFlag(true)
                                                            }}
                                                        >
                                                            Track Order
                                                        </button>
                                                    </div>
                                                </div>
                                                {/* <span>Order Date: {item.createdAt} </span>{" "} */}
                                                <span>Order Date: {moment(item.createdAt).format('D MMMM YYYY, h:mm A')} </span>{" "}
                                                <span
                                                    style={{
                                                        color: "green",
                                                        marginLeft: "50px",
                                                    }}
                                                >
                                                    {" "}
                                                    + Estimate Delivey {moment(item.createdAt).add(7, 'days').format('D MMMM YYYY')}
                                                </span>
                                                {/* {
                                                    item?.products?.map((items, index) => {
                                                        return ( */}
                                                <div
                                                    className="card mb-3"
                                                >
                                                    <div className="row g-1">
                                                        <div className="col-md-3">
                                                            <img
                                                                src={`${process.env.REACT_APP_API}/api/v1/product/get-product-photo/${item?.products?.[0]?.productId}`}
                                                                className="img-fluid rounded-start"
                                                                alt="..."
                                                            />
                                                        </div>
                                                        <div className="col-md-7">
                                                            <div className="card-body">
                                                                <h5 className="card-title">
                                                                    {item?.products?.[0]?.name}
                                                                </h5>
                                                                <p className="card-text">
                                                                    {item?.products?.[0]?.description}
                                                                </p>
                                                                {/* {
                                                                        item?.products?.length > 1 ? (
                                                                            <h6 sty>Total Product { item?.products?.length}</h6>
                                                                        ) : ("")
                                                                    } */}

                                                            </div>
                                                        </div>
                                                        <div className="col-md-2 " style={{ marginTop: "20px" }}>
                                                            <p>Total Product: <sapn><input style={{ width: "40px", padding: "0px 5px" }} disabled value={item?.products?.length} /></sapn></p>
                                                            <p>price:<sapn><input style={{ width: "80%", padding: "0px 10px" }} disabled value={item?.estimateCost} /></sapn></p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </List>
                                )
                            }) : (
                                <>
                                    <p style={{ display: "flex", justifyContent: "center" }}> Not Data Available</p>
                                </>
                            )
                        }
                        {
                            loading ? (<>
                                <div className="loader"></div>
                                <p className="loadingPara">Loading...</p>
                            </>) : null
                        }
                        {/* <List
                            sx={style}
                            component="nav"
                            aria-label="mailbox folders"
                        >
                            {loading ? (
                                <>
                                    <div
                                        className="loader"
                                        style={{ top: "250px" }}
                                    ></div>
                                    <p
                                        className="loadingPara"
                                        style={{
                                            top: "257px",
                                            marginLeft: "30px",
                                        }}
                                    >
                                        Loading...
                                    </p>
                                </>
                            ) : (
                                <div>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}
                                    >
                                        <h2>Order Id: </h2>
                                        <div>
                                            <button
                                                className="btn btn-primary"
                                                style={{ marginRight: "20px" }}
                                            >
                                                invoice
                                            </button>
                                            <button className="btn btn-primary">
                                                track
                                            </button>
                                        </div>
                                    </div>
                                    <span>Order Date: 12 May 2023 </span>{" "}
                                    <span
                                        style={{
                                            color: "green",
                                            marginLeft: "50px",
                                        }}
                                    >
                                        {" "}
                                        + Estimate Delivey 12 may{" "}
                                    </span>
                                    <div
                                        className="card mb-3"
                                        // style={{ maxWidth: 540 }}
                                    >
                                        <div className="row g-0">
                                            <div className="col-md-3">
                                                <img
                                                    src="..."
                                                    className="img-fluid rounded-start"
                                                    alt="..."
                                                />
                                            </div>
                                            <div className="col-md-7">
                                                <div className="card-body">
                                                    <h5 className="card-title">
                                                        Card title
                                                    </h5>
                                                    <p className="card-text">
                                                        This is a wider card
                                                        with supporting text
                                                        below as a natural
                                                        lead-in to additional
                                                        content. This content is
                                                        a little bit longer.
                                                    </p>
                                                    <p className="card-text">
                                                        <small className="text-muted">
                                                            Last updated 3 mins
                                                            ago
                                                        </small>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="col-md-2 " style={{marginTop:"20px"}}>
                                                <p>Quantity: <sapn><input style={{width:"40px", padding:"0px 5px"}} disabled /></sapn></p>
                                                <p>price:<sapn><input style={{width:"80%", padding:"0px 10px"}} disabled /></sapn></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </List> */}
                    </div>
                </div>
            </div>

            {console.log("mm", invoiceDetails)}
            {/* invoice modal */}
            <Modal
                open={invoiceFlag} style={{ width: "100px" }}
            >
                <div
                    className={
                        invoiceFlag ? "modal cus-modal fade show" : "modal cus-modal fade"
                    }
                    id="GreetingnModal"
                    tabIndex={-1}
                    aria-labelledby="exampleModalLabel"
                    style={invoiceFlag ? { display: "block", height: "100vh" } : { display: "none", height: "100vh" }}
                >
                    <div
                        className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg"
                    >
                        <div className="modal-content ">


                            <div className="modal-body cus-m-body gree-m-body pd-t0 pd0 bg-light " style={{ marginTop: "-7px" }}>

                                <div className="filter-container d-flex justify-content-between w-100">
                                    <div className=" w-50">
                                        <h6 style={{ fontWeight: "bold" }}>BILL FROM:</h6>
                                        <p style={{ marginTop: "-10px" }}>E-commerece Company
                                            <br></br>
                                            {/* {auth?.user?.email} */}
                                            ecomwebsite@yopmail.com
                                            <br></br>
                                            {/* {auth?.user?.phone} */}
                                            +91 1234567890
                                        </p>
                                        {/* <p style={{ marginTop: "-10px" }}>{auth?.user?.address}
                                            <br></br>
                                            {auth?.user?.email}
                                            <br></br>
                                            {auth?.user?.phone}
                                        </p> */}
                                    </div>
                                    <div className="float-end" style={{ float: "right" }}>
                                        <label className=" " style={{
                                            fontSize: "30px",
                                            color: "black",
                                            fontWeight: "bold",
                                            marginRight: "5px",
                                        }}>🛒 E-commerce</label>
                                    </div>
                                </div>

                                <hr style={{ margin: "10px 5px" }}></hr>

                                <div className="filter-container d-flex justify-content-between w-100" style={{ marginTop: "30px" }}>
                                    <div className=" w-50">
                                        <h6 style={{ fontWeight: "bold" }}>BILL TO:</h6>
                                        <p style={{ marginTop: "-10px" }}>{auth?.user?.address}
                                            <br></br>
                                            {auth?.user?.email}
                                            <br></br>
                                            {auth?.user?.phone}</p>

                                    </div>
                                    <div className=" " style={{ width: "38%" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <div style={{ fontWeight: "bold" }}> INVOICE# : </div>
                                            <div >{invoiceDetails.invoice}</div>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <div style={{ fontWeight: "bold" }}> INVOICE DATE: </div>
                                            <div >{moment(invoiceDetails.createdAt).add(7, 'days').format('D MMMM YYYY')}</div>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between", backgroundColor: "lightgray" }}>
                                            <div style={{ fontWeight: "bold" }}> AMOUNT DUE: </div>
                                            <div >{invoiceDetails.estimateCost}</div>
                                        </div>
                                    </div>
                                </div>

                                <table className="table" style={{ marginTop: "15px" }}>
                                    <thead className="thead-dark" style={{ backgroundColor: "lightgray", textAlign: "center" }}>
                                        <tr>
                                            <th style={{ width: "20px" }} scope="col">#</th>
                                            <th style={{ width: "130px" }} scope="col">Item</th>
                                            <th style={{ width: "350px" }} scope="col">Description</th>
                                            <th style={{ width: "30px" }} scope="col">Quantity</th>
                                            <th style={{ width: "30px" }} scope="col">Unit coast</th>
                                            <th style={{ width: "30px" }} scope="col">Line coast</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            invoiceDetails?.products?.map((item, index) => {
                                                return (
                                                    <tr>
                                                        <th scope="row">{index + 1}</th>
                                                        <td>{item?.name}  </td>
                                                        <td >{item?.description} </td>
                                                        <td style={{ textAlign: "center" }}>{item?.quantity}</td>
                                                        <td style={{ textAlign: "center" }} >{item?.price}</td>
                                                        <td style={{ textAlign: "center" }} >{item?.totalCost}</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>

                                <div className="filter-container d-flex justify-content-between w-100" style={{ marginTop: "50px" }}>
                                    <div className=" w-50">
                                        <h6 style={{ fontWeight: "bold" }}>Notes / Memo :</h6><br></br>
                                        <p style={{ marginTop: "-10px" }}>System Generated Bill No Need Of Stamp</p>
                                        <p style={{ marginTop: "-10px" }}>Free Shipping Within 7 Day Money Back Guarantee
                                        </p>

                                    </div>
                                    <div className=" " style={{ width: "28%" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <div style={{ fontWeight: "bold" }}> SUBTOTAL:  </div>
                                            <div >
                                                {totalCost}
                                            </div>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <div style={{ fontWeight: "bold" }}> TAX <span>{"G.S.T (18%)"}</span>: </div>
                                            <div >${((totalCost / 100) * 18).toFixed(2)}</div>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <div style={{ fontWeight: "bold" }}> SHIPPING COAST: </div>
                                            <div >{totalCost < 200 ? "$40" : "$0"}</div>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <div style={{ fontWeight: "bold" }}> DISCOUNT(10%): </div>
                                            <div >${((totalCost / 100) * 10).toFixed(2)}</div>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between", backgroundColor: "lightgray" }}>
                                            <div style={{ fontWeight: "bold", }}> TOTAL: </div>
                                            <div >{invoiceDetails.estimateCost}</div>
                                        </div>
                                    </div>
                                </div>


                                <div className="filter-container d-flex justify-content-center w-100" style={{ marginTop: "50px", backgroundColor: "lightgray" }}>

                                    <div style={{ display: "flex", justifyContent: "center" }} >
                                        <label className=" " style={{
                                            fontSize: "30px",
                                            color: "gray",
                                            fontWeight: "bold",
                                            marginRight: "5px",
                                            // textAlign: "center", 
                                            display: "flex",
                                            justifyContent: "center",

                                        }}>🛒 E-commerce</label>
                                    </div>
                                </div>
                                <p className="filter-container d-flex justify-content-center w-100 text-secondary" style={{ backgroundColor: "lightgray", marginBottom: "10px" }}>Powered by E-commerce</p>
                            </div>
                            <div className="modal-footer border-0">
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    data-bs-dismiss="modal"
                                    onClick={() => {
                                        changeStatusOfOrder(invoiceDetails._id, "cancel")
                                    }}
                                >
                                    Cancel Order
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => {
                                        setInvoiceFlag(false);
                                    }}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* view order modal */}
            <Modal
                open={invoiceFlag} style={{ width: "100px" }}
            >
                <div
                    className={
                        invoiceFlag ? "modal cus-modal fade show" : "modal cus-modal fade"
                    }
                    id="GreetingnModal"
                    tabIndex={-1}
                    aria-labelledby="exampleModalLabel"
                    style={invoiceFlag ? { display: "block", height: "100vh" } : { display: "none", height: "100vh" }}
                >
                    <div
                        className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg"
                    >
                        <div className="modal-content ">
                            <div className="modal-body cus-m-body gree-m-body pd-t0 pd0 bg-light " style={{ marginTop: "-7px" }}>

                                <div className="filter-container d-flex justify-content-between w-100">
                                    <div className=" w-50">
                                        <h6 style={{ fontWeight: "bold" }}>BILL FROM:</h6>
                                        <p style={{ marginTop: "-10px" }}>E-commerece Company
                                            <br></br>
                                            {/* {auth?.user?.email} */}
                                            ecomwebsite@yopmail.com
                                            <br></br>
                                            {/* {auth?.user?.phone} */}
                                            +91 1234567890
                                        </p>
                                        {/* <p style={{ marginTop: "-10px" }}>{auth?.user?.address}
                                            <br></br>
                                            {auth?.user?.email}
                                            <br></br>
                                            {auth?.user?.phone}
                                        </p> */}
                                    </div>
                                    <div className="float-end" style={{ float: "right" }}>
                                        <label className=" " style={{
                                            fontSize: "30px",
                                            color: "black",
                                            fontWeight: "bold",
                                            marginRight: "5px",
                                        }}>🛒 E-commerce</label>
                                    </div>
                                </div>

                                <hr style={{ margin: "10px 5px" }}></hr>

                                <div className="filter-container d-flex justify-content-between w-100" style={{ marginTop: "30px" }}>
                                    <div className=" w-50">
                                        <h6 style={{ fontWeight: "bold" }}>BILL TO:</h6>
                                        <p style={{ marginTop: "-10px" }}>{auth?.user?.address}
                                            <br></br>
                                            {auth?.user?.email}
                                            <br></br>
                                            {auth?.user?.phone}</p>

                                    </div>
                                    <div className=" " style={{ width: "38%" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <div style={{ fontWeight: "bold" }}> INVOICE# : </div>
                                            <div >{invoiceDetails.invoice}</div>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <div style={{ fontWeight: "bold" }}> INVOICE DATE: </div>
                                            <div >{moment(invoiceDetails.createdAt).add(7, 'days').format('D MMMM YYYY')}</div>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between", backgroundColor: "lightgray" }}>
                                            <div style={{ fontWeight: "bold" }}> AMOUNT DUE: </div>
                                            <div >{invoiceDetails.estimateCost}</div>
                                        </div>
                                    </div>
                                </div>

                                <table className="table" style={{ marginTop: "15px" }}>
                                    <thead className="thead-dark" style={{ backgroundColor: "lightgray", textAlign: "center" }}>
                                        <tr>
                                            <th style={{ width: "20px" }} scope="col">#</th>
                                            <th style={{ width: "130px" }} scope="col">Item</th>
                                            <th style={{ width: "350px" }} scope="col">Description</th>
                                            <th style={{ width: "30px" }} scope="col">Quantity</th>
                                            <th style={{ width: "30px" }} scope="col">Unit coast</th>
                                            <th style={{ width: "30px" }} scope="col">Line coast</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            invoiceDetails?.products?.map((item, index) => {
                                                return (
                                                    <tr>
                                                        <th scope="row">{index + 1}</th>
                                                        <td>{item?.name}  </td>
                                                        <td >{item?.description} </td>
                                                        <td style={{ textAlign: "center" }}>{item?.quantity}</td>
                                                        <td style={{ textAlign: "center" }} >{item?.price}</td>
                                                        <td style={{ textAlign: "center" }} >{item?.totalCost}</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>

                                <div className="filter-container d-flex justify-content-between w-100" style={{ marginTop: "50px" }}>
                                    <div className=" w-50">
                                        <h6 style={{ fontWeight: "bold" }}>Notes / Memo :</h6><br></br>
                                        <p style={{ marginTop: "-10px" }}>System Generated Bill No Need Of Stamp</p>
                                        <p style={{ marginTop: "-10px" }}>Free Shipping Within 7 Day Money Back Guarantee
                                        </p>

                                    </div>
                                    <div className=" " style={{ width: "28%" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <div style={{ fontWeight: "bold" }}> SUBTOTAL:  </div>
                                            <div >
                                                {totalCost}
                                            </div>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <div style={{ fontWeight: "bold" }}> TAX <span>{"G.S.T (18%)"}</span>: </div>
                                            <div >${((totalCost / 100) * 18).toFixed(2)}</div>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <div style={{ fontWeight: "bold" }}> SHIPPING COAST: </div>
                                            <div >{totalCost < 200 ? "$40" : "$0"}</div>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <div style={{ fontWeight: "bold" }}> DISCOUNT(10%): </div>
                                            <div >${((totalCost / 100) * 10).toFixed(2)}</div>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between", backgroundColor: "lightgray" }}>
                                            <div style={{ fontWeight: "bold", }}> TOTAL: </div>
                                            <div >{invoiceDetails.estimateCost}</div>
                                        </div>
                                    </div>
                                </div>


                                <div className="filter-container d-flex justify-content-center w-100" style={{ marginTop: "50px", backgroundColor: "lightgray" }}>

                                    <div style={{ display: "flex", justifyContent: "center" }} >
                                        <label className=" " style={{
                                            fontSize: "30px",
                                            color: "gray",
                                            fontWeight: "bold",
                                            marginRight: "5px",
                                            // textAlign: "center", 
                                            display: "flex",
                                            justifyContent: "center",

                                        }}>🛒 E-commerce</label>
                                    </div>
                                </div>
                                <p className="filter-container d-flex justify-content-center w-100 text-secondary" style={{ backgroundColor: "lightgray", marginBottom: "10px" }}>Powered by E-commerce</p>
                            </div>
                            <div className="modal-footer border-0">
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    data-bs-dismiss="modal"
                                    onClick={() => {
                                        changeStatusOfOrder(invoiceDetails._id, "cancel")
                                    }}
                                >
                                    Cancel Order
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => {
                                        setInvoiceFlag(false);
                                    }}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* tracking modal */}
            <Modal
                open={trackingFlag} style={{ width: "100px" }}

            >
                <div
                    className={
                        trackingFlag ? "modal cus-modal fade show" : "modal cus-modal fade"
                    }
                    id="GreetingnModal"
                    tabIndex={-1}
                    aria-labelledby="exampleModalLabel"
                    style={trackingFlag ? { display: "block", height: "100vh" } : { display: "none", height: "100vh" }}
                >
                    <div
                        className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg"
                    >
                        <div className="modal-content ">
                            <div className="modal-header border-0 pd20 bg-light ">
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
                                    <h4 className=" pt-2"> Track Your Order</h4>
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                    onClick={() => setTrackingFlag(false)}
                                ></button>
                            </div>
                            <section className="vh-50" style={{ backgroundColor: '#8c9eff' }}>
                                <div className="container py-5 h-50">
                                    <div className="row d-flex justify-content-center align-items-center h-50">
                                        <div className="col-12">
                                            <div className="card card-stepper text-black" style={{ borderRadius: 16 }}>
                                                <div className="card-body p-5">
                                                    <div className="d-flex justify-content-between align-items-center mb-5">
                                                        <div>
                                                            <h5 className="mb-0">INVOICE# <span className="text-primary font-weight-bold">{invoiceDetails.invoice}</span></h5>
                                                        </div>
                                                        <div className="text-end">
                                                            <p className="mb-0" style={{
                                                                color: "green",
                                                                marginLeft: "50px",
                                                            }}>Expected Arrival <span>{moment(invoiceDetails.createdAt).add(7, 'days').format('D MMMM YYYY')}</span></p>
                                                            <p className="mb-0 text-black">OrderId# :  <span className="font-weight-bold">{invoiceDetails._id}</span></p>
                                                        </div>
                                                    </div>
                                                    <ul id="progressbar-2" className="d-flex justify-content-between mx-0 mt-0 mb-5 px-0 pt-0 pb-2">
                                                        {
                                                            invoiceDetails?.status == "Not Process" ? (
                                                                <>
                                                                    <li className="step0 active text-center" id="step1" />
                                                                    <li className="step0 text-muted text-end" id="step2" />
                                                                    <li className="step0 text-muted text-end" id="step3" />
                                                                    <li className="step0 text-muted text-end" id="step4" />
                                                                </>) : invoiceDetails?.status == "Processing" ? (
                                                                    <>
                                                                        <li className="step0 active text-center" id="step1" />
                                                                        <li className="step0 active text-center" id="step2" />
                                                                        <li className="step0 text-muted text-end" id="step3" />
                                                                        <li className="step0 text-muted text-end" id="step4" />
                                                                    </>
                                                                ) : invoiceDetails?.status == "Shipped" ? (
                                                                    <>
                                                                        <li className="step0 active text-center" id="step1" />
                                                                        <li className="step0 active text-center" id="step2" />
                                                                        <li className="step0 active text-center" id="step3" />
                                                                        <li className="step0 text-muted text-end" id="step4" />
                                                                    </>
                                                                ) : (
                                                                <>
                                                                    <li className="step0 active text-center" id="step1" />
                                                                    <li className="step0 active text-center" id="step2" />
                                                                    <li className="step0 active text-center" id="step3" />
                                                                    <li className="step0 active text-center" id="step4" />
                                                                </>
                                                            )
                                                        }
                                                        {/* <li className="step0 active text-center" id="step1" />
              <li className="step0 active text-center" id="step2" />
              <li className="step0 active text-center" id="step3" />
              <li className="step0 text-muted text-end" id="step4" /> */}
                                                    </ul>
                                                    <div className="d-flex justify-content-between">
                                                        <div className="d-lg-flex align-items-center">
                                                            <i className="fas fa-clipboard-list fa-3x me-lg-4 mb-3 mb-lg-0" />
                                                            <div>
                                                                <p className="fw-bold mb-1">Waiting for</p>
                                                                <p className="fw-bold mb-0">Acceptance</p>
                                                            </div>
                                                        </div>
                                                        <div className="d-lg-flex align-items-center">
                                                            <i className="fas fa-box-open fa-3x me-lg-4 mb-3 mb-lg-0" />
                                                            <div>
                                                                <p className="fw-bold mb-1">Order</p>
                                                                <p className="fw-bold mb-0">Accepted</p>
                                                            </div>
                                                        </div>
                                                        <div className="d-lg-flex align-items-center">
                                                            <i className="fas fa-shipping-fast fa-3x me-lg-4 mb-3 mb-lg-0" />
                                                            <div>
                                                                <p className="fw-bold mb-1">Order</p>
                                                                <p className="fw-bold mb-0">En Route</p>
                                                            </div>
                                                        </div>
                                                        <div className="d-lg-flex align-items-center">
                                                            <i className="fas fa-home fa-3x me-lg-4 mb-3 mb-lg-0" />
                                                            <div>
                                                                <p className="fw-bold mb-1">Order</p>
                                                                <p className="fw-bold mb-0">Arrived</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* <div className="modal-footer border-0">
                                <button
                                    type="button"
                                    className="btn btn-outline-primary"
                                    onClick={() => {
                                        setTrackingFlag(false);
                                    }}
                                >
                                    Close
                                </button>
                            </div> */}
                        </div>
                    </div>
                </div>
            </Modal>

        </Layout>
    );
};

export default Orders;
