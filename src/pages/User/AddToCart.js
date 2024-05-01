import React, { useEffect, useState } from "react";
// import Layout from "../components/layout/Layout";
import Layout from "../../components/layout/Layout";
import AdminMenu from "../../components/layout/AdminMenu";
import UsersMenu from "../../pages/User/UsersMenu";
import axios from "axios";
import { toast } from "react-hot-toast";
import "antd/dist/reset.css";
import { useNavigate, useParams } from "react-router-dom";
import { MdDeleteForever } from "react-icons/md";
import { FiEdit2 } from "react-icons/fi";
import moment from "moment";
import Typography from "@mui/material/Typography";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import "../../styles/Homepage.css";
import { BsPersonFill } from "react-icons/bs";
import { HiShoppingBag } from "react-icons/hi";
import { GiBilledCap } from "react-icons/gi";
import { CgPerformance } from "react-icons/cg";
import { Hidden, Modal } from "@mui/material";

import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";

import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import StarIcon from "@mui/icons-material/Star";
import { useAuth } from "../../context/AuthContext";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import DeleteSweepOutlinedIcon from "@mui/icons-material/DeleteSweepOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import { v4 as uuidv4 } from 'uuid';

// import useRazorpay from "react-razorpay";
// import Razorpay from "razorpay"



const CreateProduct = () => {
    // const [Razorpay] = useRazorpay()
    const [auth, setAuth] = useAuth();
    const [totalproductsCost, setTotalproductsCost] = useState(0);
    const [paymentConfirmtionFlag, setPaymentConfirmtionFlag] = useState(false);
    const [submitProductData, setSubmitProductData] = useState([]);
    const [paymentName, setPaymentName] = useState("");
    const [shippingCost, setShippingCost] = useState(0);
    const [loading, setLoading] = useState(false);
    const [cartItems, setCartItems] = useState([]);

    const style = {
        width: "100%",
        marginLeft: auth?.toggle === true ? "45px" : "55px",
        maxWidth: auth?.toggle === true ? "55%" : "60%",
        bgcolor: "background.paper",
    };
    const navigate = useNavigate();

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
        left: auth?.toggle ? "220px" : "50px",
        width: auth?.toggle ? "85.4%" : "96.6%",
        padding: "20px",
        overflowY: "scroll",
    };

    const hideScrollbarCSS = `
  /* Hide scrollbar for webkit (Chrome, Safari) */
  ::-webkit-scrollbar {
    width: 0.5em;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background-color: transparent;
  }
`;

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

    useEffect(() => {
        if (auth?.user) {
            addToCartFunc();
        }
    }, []);

    const loadScripts = async () => {
        const razorpayScript = document.createElement('script');
        razorpayScript.src = 'https://checkout.razorpay.com/v1/checkout.js';
        document.body.appendChild(razorpayScript);
    };

    const addToCartFunc = async () => {
        setLoading(true);
        // const preNcount = sessionStorage.getItem("cCount");
        // if (preNcount == 0) {
        //     navigate("/user/homepage");
        // }

        const response = await axios.get(
            `${process.env.REACT_APP_API}/api/v1/auth/getCartDetails/${auth?.user?._id}`
        );

        if (response?.data?.success) {
            setLoading(false);

            // Initialize cartItems as an object
            const initialCartItems = [];
            setTotalproductsCost(0);
            setShippingCost(0)
            response.data?.cartItems.forEach((item) => {
                if (item?.product._id in initialCartItems) {
                } else {
                    const initialCartItemsObject = {
                        // ...item.product,
                        name: item.product.name,
                        slug: item.product.slug,
                        description: item.product.description,
                        quantity: item?.quantity,
                        totalCost: item.product.price,
                        price: item.product.price,
                        productId: item.product._id,
                        cart_id: item?._id,
                        category: item?.product?.category,
                        rating: item.product.averageRating,
                    };
                    initialCartItems.push(initialCartItemsObject)
                    setTotalproductsCost((prev) => prev + item?.product?.price);
                    setShippingCost((prev) => prev + item?.product?.price);
                }
            });
            setCartItems(initialCartItems);
            sessionStorage.setItem("cCount", response?.data?.cartItems?.length);
        }
    };
    console.log("CART ITEMS ", cartItems);

    const increaseQuantity = (productId) => {
        if (cartItems[productId]) {
            const updatedCartItems = [...cartItems];
            updatedCartItems[productId].quantity += 1;
            updatedCartItems[productId].totalCost +=
                cartItems[productId]?.price;
            setTotalproductsCost((prev) => prev + cartItems[productId]?.price);
            setCartItems(updatedCartItems);
        }
    };

    const decreaseQuantity = (productId) => {
        if (cartItems[productId] && cartItems[productId].quantity > 1) {
            const updatedCartItems = [...cartItems];
            updatedCartItems[productId].quantity -= 1;
            updatedCartItems[productId].totalCost -=
                cartItems[productId]?.price;
            setTotalproductsCost((prev) => prev - cartItems[productId]?.price);

            setCartItems(updatedCartItems);
        }
    };

    const removeCartItem = async (cartId) => {
        const response = await axios.delete(
            `${process.env.REACT_APP_API}/api/v1/auth/removeCartItem/${cartId}`
        );
        if (response?.data?.success) {
            toast.success(response?.data?.message);
            const preNcount = sessionStorage.getItem("cCount");
            if (preNcount == 0) {
                navigate("/user/homepage");
            }
            sessionStorage.setItem("cCount", preNcount - 1);
            addToCartFunc();
        }
    };

    console.log("carts", cartItems);

    const generateInvoiceNumber = () => {
        const timestamp = new Date().getTime();
        const uniqueId = uuidv4().slice(0, 6);
        return `${timestamp}_${uniqueId}`;
    };

    const submitOrderHandler = async () => {
        const invoice_Number = generateInvoiceNumber()
        const response = await axios.post(
            `${process.env.REACT_APP_API}/api/v1/auth/orders`, {
            productIds: cartItems,
            userId: auth?.user?._id,
            payment: "processing",
            invoice: invoice_Number,
            estimateCost:
                totalproductsCost > 0
                    ? (
                        totalproductsCost +
                        (totalproductsCost < 200
                            ? 40
                            : 0) -
                        ((totalproductsCost / 100) * 10) +
                        ((totalproductsCost / 100) * 18)
                    ).toFixed(2)
                    : 0
        }



        );
        if (response?.data?.success) {
            cartItems?.map(async (item, index) => {
                await axios.delete(
                    `${process.env.REACT_APP_API}/api/v1/auth/removeCartItem/${cartItems[index].cart_id}`
                );
            })
            addToCartFunc()
            setPaymentConfirmtionFlag(false)
            toast.success("Your Order Is Successful")
            navigate("/user/orders")
        }
    }

    const submitSingelOrderHandler = async (item) => {
        console.log("productlist", item);
        const initialCartItemsObject = {
            ...item.product,
            name: item.name,
            slug: item.slug,
            category: item?.category,
            description: item.description,
            quantity: item.quantity,
            totalCost: item.price,
            price: item.price,
            productId: item.productId,
            cart_id: item?.cart_id,
        };
        const invoice_Number = generateInvoiceNumber()
        // initialCartItems.push(initialCartItemsObject)
        const response = await axios.post(
            `${process.env.REACT_APP_API}/api/v1/auth/orders`, {
            productIds: [initialCartItemsObject],
            userId: auth?.user?._id,
            payment: "processing",
            invoice: invoice_Number,
            estimateCost:
                item.price > 0
                    ? (
                        item.price +
                        (item.price < 200
                            ? 40
                            : 0) -
                        ((item.price / 100) * 10) +
                        ((item.price / 100) * 18)
                    ).toFixed(2)
                    : 0
        }
        );
        if (response?.data?.success) {
            const del_response = await axios.delete(
                `${process.env.REACT_APP_API}/api/v1/auth/removeCartItem/${item.cart_id}`
            );
            if (del_response?.data?.success) {
                addToCartFunc()
            }
            setPaymentConfirmtionFlag(false)
            toast.success("Your Order Is Successful")
            navigate("/user/orders")
        }
    }

    // const loadScript = (src) => {
    //     return new Promise((resolve)=>{
    //         const script = document.createElement("script")
    //         script.src = src;
    //         script.onload = () => {
    //             resolve(true)
    //         }
    //         script.onerror = () => {
    //             resolve(false)
    //         }
    //         document.body.appendChild(script)
    //     })
    // }

    const submitPaymentTransaction = async (e, items = "") => {
        try {


            // const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js")

            let amount = 0

            if (paymentName == "submitSingelOrder") {
                amount = items.price > 0
                    ? (
                        items.price +
                        (items.price < 200
                            ? 40
                            : 0) -
                        ((items.price / 100) * 10) +
                        ((items.price / 100) * 18)
                    ).toFixed(2) : 0
            }
            if (paymentName == "submitMultiOrder") {
                amount = totalproductsCost > 0
                    ? (
                        totalproductsCost +
                        (totalproductsCost < 200
                            ? 40
                            : 0) -
                        ((totalproductsCost / 100) * 10) +
                        ((totalproductsCost / 100) * 18)
                    ).toFixed(2)
                    : 0
            }

            const bodyContant = {
                // "amount": parseInt(amount),
                "amount": parseInt((parseFloat(amount) * 100).toFixed(0)),
                "currency": "INR",
                "receipt": "Receipt no. 1",
            }

            const response = await axios.post(`${process.env.REACT_APP_API}/api/v1/product/payment`, bodyContant)

            console.log("razorpay", response);
            if (response?.data?.success == false) {
                toast.error(response?.data?.message)
            }
            var options = {
                "key": "rzp_test_gDudH6f3qtaRif", // Enter the Key ID generated from the Dashboard
                "amount": response?.data?.orders?.amount,
                // "amount":73313,
                // "amount": totalproductsCost > 0
                //     ? (
                //         totalproductsCost +
                //         (totalproductsCost < 200
                //             ? 40
                //             : 0) -
                //         ((totalproductsCost / 100) * 10) +
                //         ((totalproductsCost / 100) * 18)
                //     ).toFixed(2)
                //     : 0, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
                "currency": response?.data?.orders?.currency,
                "name": "E-commerce",
                "description": "Test Transaction",
                "image": "/logo192.png",
                "order_id": response?.data?.orders?.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
                "handler": async function (response) {
                    const body = { ...response }

                    const validate = await axios.post(`${process.env.REACT_APP_API}/api/v1/product/payment/validate`, body)
                    if (validate?.data?.success) {
                        if (e.target.name == "submitMultiOrder") {
                            submitOrderHandler()
                        }
                        if (e.target.name == "submitSingelOrder") {
                            submitSingelOrderHandler(items)
                        }
                    } else {
                        toast.error("Payment Failed")
                    }
                },
                "prefill": {
                    "name": auth?.user?.name,
                    "email": auth?.user?.email,
                    "contact": auth?.user?.phone
                },
                "notes": {
                    "address": auth?.user?.address
                },
                "theme": {
                    "color": "#3399cc"
                }
            };
            // var rzp1 = new window.Razorpay(options);
            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response) {
                toast.error(response.error.description);
                toast.error(response.error.reason);
            });

            rzp1.open();
            e.preventDefault();

            if (response?.data?.success === true) {
            } else {
                toast.error(response?.data?.message)
            }

        } catch (error) {

        }
    }
    return (
        <Layout title="addToCart E-comm">
            <div style={containerStyle} className="container-fluid m-0 p-4">
                <div className="row ">
                    <div style={leftStyle} className="col-md-3 ">
                        {auth?.user?.role === 1 ? <AdminMenu /> : <UsersMenu />}
                    </div>
                    <style>{lightScrollbarCSS}</style>
                    <div style={rightStyle} className="col-md-9 ">
                        {console.log("length", cartItems)}
                        {
                            sessionStorage.getItem("cCount") == 0 ? (
                                <h3 style={{ color: "red" }}>No item in cart please Add some item into it </h3>
                            ) : (
                                <>
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
                                            Object.keys(cartItems).map((productId) => {
                                                return (
                                                    <>
                                                        <div
                                                            className="cards mb-3"
                                                        // style={{ Width: 140 }}
                                                        >
                                                            <div className="row g-0">
                                                                <div
                                                                    className="col-md-4"
                                                                    style={{
                                                                        height: "150px",
                                                                    }}
                                                                >
                                                                    <img
                                                                        style={{
                                                                            height: "100%",
                                                                            width: "100%",
                                                                            objectFit:
                                                                                "contain",
                                                                        }}
                                                                        src={`${process.env.REACT_APP_API}/api/v1/product/get-product-photo/${cartItems[productId].productId}`}
                                                                        className="img-fluid rounded-start"
                                                                        alt="..."
                                                                    />
                                                                </div>
                                                                {/* <p>{cartItems?._id}</p> */}
                                                                <div className="col-md-8">
                                                                    <div className="card-body">
                                                                        <h5 className="card-title ">
                                                                            {/* {
                                                                        item
                                                                            ?.product
                                                                            ?.name
                                                                    } */}
                                                                            {
                                                                                cartItems[
                                                                                    productId
                                                                                ]?.name
                                                                            }
                                                                            <span
                                                                                style={{
                                                                                    display:
                                                                                        "flex",
                                                                                    justifyContent:
                                                                                        "center",
                                                                                }}
                                                                                className=" float-end"
                                                                            >
                                                                                Quantity
                                                                                <button
                                                                                    style={{
                                                                                        width:
                                                                                            "20px",
                                                                                        borderRadius:
                                                                                            "0%",
                                                                                        backgroundColor:
                                                                                            "#008080",
                                                                                        color:
                                                                                            "white",
                                                                                        marginLeft:
                                                                                            "10px",
                                                                                    }}
                                                                                    // onClick={() => {
                                                                                    //     if (quantityValue > 1) {

                                                                                    //         setQuantityValue(prevQauntity => (prevQauntity - 1))
                                                                                    //     }
                                                                                    // }}
                                                                                    onClick={() =>
                                                                                        decreaseQuantity(
                                                                                            productId
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    -{" "}
                                                                                </button>
                                                                                <input
                                                                                    disabled
                                                                                    style={{
                                                                                        width:
                                                                                            "40px",
                                                                                    }}
                                                                                    // value={item?.product?.quantity}
                                                                                    value={
                                                                                        cartItems[
                                                                                            productId
                                                                                        ]
                                                                                            ?.quantity
                                                                                    }
                                                                                />
                                                                                <button
                                                                                    style={{
                                                                                        width:
                                                                                            "20px",
                                                                                        borderRadius:
                                                                                            "0%",
                                                                                        backgroundColor:
                                                                                            "#008080",
                                                                                        color:
                                                                                            "white",
                                                                                    }}
                                                                                    // onClick={() => {
                                                                                    //     setQuantityValue(prevQauntity => (prevQauntity + 1))
                                                                                    // }}
                                                                                    onClick={() =>
                                                                                        increaseQuantity(
                                                                                            productId
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    +{" "}
                                                                                </button>
                                                                            </span>
                                                                        </h5>
                                                                        <p className="card-text">
                                                                            {
                                                                                cartItems[
                                                                                    productId
                                                                                ]
                                                                                    ?.description
                                                                            }
                                                                        </p>

                                                                        <p className="card-text">
                                                                            {/* <small className="text-muted">
                                                                                Last updated
                                                                                3 mins ago
                                                                            </small> */}

                                                                            <Rating
                                                                                name="hover-feedback"
                                                                                value={cartItems[productId]?.rating}
                                                                                precision={0.5}
                                                                                // getLabelText={getLabelText}
                                                                                onChange={(event, newValue) => {
                                                                                    //   setValue(newValue);
                                                                                }}
                                                                                onChangeActive={(event, newHover) => {
                                                                                    //   setHover(newHover);
                                                                                }}
                                                                                emptyIcon={
                                                                                    <StarIcon
                                                                                        style={{
                                                                                            verticalAlign: "text-bottom",
                                                                                            // Adjust the vertical alignment
                                                                                            opacity: 0.5,
                                                                                        }}
                                                                                        fontSize="inherit"
                                                                                    />
                                                                                }
                                                                                readOnly
                                                                            />
                                                                            <p
                                                                                className="card-text float-end"
                                                                                style={{
                                                                                    fontWeight:
                                                                                        "bold",
                                                                                }}
                                                                            >
                                                                                $
                                                                                {
                                                                                    cartItems[
                                                                                        productId
                                                                                    ]
                                                                                        ?.totalCost
                                                                                }
                                                                            </p>
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                {/* <hr></hr> */}
                                                                <div
                                                                    className=" "
                                                                    style={{
                                                                        display: "flex",
                                                                        justifyContent:
                                                                            "space-around",
                                                                        marginBottom:
                                                                            "10px",
                                                                        marginTop: "7px",
                                                                    }}
                                                                >
                                                                    <button className="btn btn-outline-primary" name="submitSingelOrder" onClick={(e) => {
                                                                        // submitSingelOrderHandler(
                                                                        //     cartItems[
                                                                        //     productId
                                                                        //     ]
                                                                        // )
                                                                        setPaymentName("submitSingelOrder")
                                                                        setSubmitProductData(cartItems[productId])
                                                                        setPaymentConfirmtionFlag(true)
                                                                    }}>
                                                                        <BoltOutlinedIcon />{" "}
                                                                        Buy this now
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-outline-danger"
                                                                        onClick={() =>
                                                                            removeCartItem(
                                                                                cartItems[
                                                                                    productId
                                                                                ]?.cart_id
                                                                            )
                                                                        }
                                                                    >
                                                                        <DeleteSweepOutlinedIcon />{" "}
                                                                        Remove
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-outline-secondary"
                                                                        // onClick={() => {
                                                                        //     // sessionStorage.setItem(
                                                                        //     //     "productId",
                                                                        //     //     item._id
                                                                        //     //   );
                                                                        //     //   sessionStorage.setItem("slug", item.slug);
                                                                        //     //   navigate('/view-product')
                                                                        //     navigate(`${process.env.REACT_APP_API}/api/v1/auth/getCartDetails/${auth?.user?._id}`)
                                                                        // }}

                                                                        onClick={() => {
                                                                            try {
                                                                                if (navigator.share) {
                                                                                    navigator.share({
                                                                                        title: `Share ${cartItems[productId]?.name} product`,
                                                                                        url: `${process.env.REACT_APP_URL}/view-product/${cartItems[productId]?.productId}/slug/${cartItems[productId]?.slug}`
                                                                                    }).then(() => {
                                                                                        console.log('URL shared successfully.');
                                                                                    })
                                                                                }
                                                                            } catch (error) {
                                                                                console.log('URL not shared successfully.');
                                                                            }
                                                                            // navigator.clipboard.writeText(`${process.env.REACT_APP_API}/view-product/${cartItems[productId]?.productId}/${cartItems[productId]?.slug}`);
                                                                            // navigate(`${process.env.REACT_APP_API}/view-product/${cartItems[productId]?.productId}/${cartItems[productId]?.slug}`)

                                                                        }}
                                                                    >
                                                                        <ShareOutlinedIcon />{" "}
                                                                        Share
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                );
                                            })
                                        )}
                                    </List>
                                    <div
                                        className=""
                                        style={{ display: "flex", justifyContent: "end", marginRight: `${auth?.toggle === true ? "40px" : "-9px"}` }}
                                    >
                                        <div
                                            style={{
                                                width: "28%",
                                                marginTop: "30px",
                                                // marginLeft: "-40px",
                                                position: "absolute",
                                                top: "5px"
                                            }}
                                        >
                                            <label style={{ marginBottom: "5px" }}>
                                                ENTER PROMO CODE
                                            </label>
                                            <br></br>
                                            <input
                                                type="text"
                                                placeholder="Enter Promo Code"
                                                style={{
                                                    padding: "4px",
                                                    height: "35px",
                                                    border: "1px solid gray",
                                                }}
                                            />
                                            <button
                                                style={{
                                                    marginBottom: "0px",
                                                    borderRadius: "0%",
                                                    height: "35px",
                                                    marginTop: "-5px",
                                                }}
                                                class="btn btn-primary "
                                            >
                                                Submit
                                            </button>
                                            <br></br>
                                            <label
                                                style={{
                                                    marginLeft: "25px",
                                                    marginBottom: "10px",
                                                    marginTop: "30px",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                Total Cost{" "}
                                                <span style={{ marginLeft: "89px" }}>
                                                    ${totalproductsCost}
                                                </span>
                                            </label>
                                            <br></br>
                                            <label
                                                style={{
                                                    marginLeft: "25px",
                                                    marginBottom: "10px",
                                                }}
                                            >
                                                Shipping Cost{" "}
                                                <span style={{ marginLeft: "65px" }}>
                                                    {totalproductsCost > 200 ? "$0" : "$40"}
                                                </span>
                                            </label>
                                            <br></br>
                                            <label
                                                style={{
                                                    marginLeft: "25px",
                                                    marginBottom: "10px",
                                                }}
                                            >
                                                Discount (10%)
                                                <span style={{ marginLeft: "60px" }}>
                                                    ${parseInt((totalproductsCost / 100) * 10).toFixed(2)}
                                                </span>
                                            </label>
                                            <br></br>
                                            <label
                                                style={{
                                                    marginLeft: "25px",
                                                    marginBottom: "10px",
                                                }}
                                            >
                                                Tax (18%){" "}
                                                <span style={{ marginLeft: "96px" }}>
                                                    ${parseInt((totalproductsCost / 100) * 18).toFixed(2)}
                                                </span>
                                            </label>
                                            <br></br>
                                            <label
                                                style={{
                                                    marginLeft: "25px",
                                                    marginBottom: "10px",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                Estimated Cost{" "}
                                                <span style={{ marginLeft: "51px" }}>
                                                    $

                                                    {totalproductsCost > 0
                                                        ? (
                                                            parseInt(totalproductsCost +
                                                                (totalproductsCost < 200
                                                                    ? 40
                                                                    : 0) -
                                                                ((totalproductsCost / 100) * 10) +
                                                                ((totalproductsCost / 100) * 18))
                                                        ).toFixed(2)
                                                        : 0}
                                                </span>
                                            </label>
                                            <br></br>
                                            <button
                                                className="btn btn-success"
                                                name="submitMultiOrder"
                                                style={{
                                                    marginLeft: "30px",
                                                    marginTop: "30px",
                                                    width: "200px",
                                                }}
                                                onClick={(e) => {
                                                    // submitOrderHandler()
                                                    // submitPaymentTransaction(e)

                                                    loadScripts();
                                                    setPaymentName("submitMultiOrder")
                                                    setPaymentConfirmtionFlag(true)
                                                }}
                                            >
                                                Place Order{" "}
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )
                        }

                    </div>
                </div>
                <Modal open={paymentConfirmtionFlag} style={{ width: "100px" }}>
                    <div
                        className={
                            paymentConfirmtionFlag ? "modal cus-modal fade show" : "modal cus-modal fade"
                        }
                        id="GreetingnModal"
                        tabIndex={-1}
                        aria-labelledby="exampleModalLabel"
                        style={paymentConfirmtionFlag ? { display: "block" } : { display: "none" }}
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
                                        <h4 className=" pt-2"> Confirm Payment </h4>
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                        onClick={() => setPaymentConfirmtionFlag(false)}
                                    ></button>
                                </div>
                                <div className="modal-body cus-m-body gree-m-body pd-t0 pd0">
                                    <div className="filter-container ">
                                        <h2>{auth?.user?.name}</h2>
                                        {/* <h5>{auth?.user?.phone}</h5> */}
                                        {/* <h5>{auth?.user?.address}</h5> */}

                                        <h3 style={{ color: "red" }}>Please confirm the mode of payment !!!</h3>

                                    </div>
                                </div>
                                <div className="modal-footer border-0">

                                    <button
                                        type="button"
                                        name={`${paymentName}`}
                                        className="btn btn-outline-danger"
                                        data-bs-dismiss="modal"
                                        onClick={() => {
                                            if (paymentName == "submitSingelOrder") {
                                                submitSingelOrderHandler(submitProductData)
                                            } else {
                                                submitOrderHandler()
                                            }
                                        }}
                                    >
                                        Cash On Delivery
                                    </button>
                                    <button
                                        type="button"
                                        name={`${paymentName}`}
                                        className="btn btn-outline-primary"
                                        onClick={(e) => {
                                            if (paymentName == "submitSingelOrder") {
                                                submitPaymentTransaction(e, submitProductData)
                                            } else {
                                                submitPaymentTransaction(e, "");
                                            }
                                        }}
                                    >
                                        Pay Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        </Layout>
    );
};

export default CreateProduct;
