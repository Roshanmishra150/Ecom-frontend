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



const CreateProduct = () => {
    const [auth, setAuth] = useAuth();
    const [totalproductsCost, setTotalproductsCost] = useState(0);
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
                        category : item?.product?.category,
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
            toast.success("Your Order Is Successful")
        }
    }

    const submitSingelOrderHandler = async (item) => {
        console.log("productlist", item);
        const initialCartItemsObject = {
            ...item.product,
            name: item.name,
            slug: item.slug,
            category : item?.category,
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
            toast.success("Your Order Is Successful")
            navigate("/user/orders")
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
                                                            className="card mb-3"
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
                                                                    <button className="btn btn-outline-primary" onClick={() =>
                                                                        submitSingelOrderHandler(
                                                                            cartItems[
                                                                            productId
                                                                            ]
                                                                        )
                                                                    }>
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
                                                    ${((totalproductsCost / 100) * 10).toFixed(2)}
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
                                                    ${((totalproductsCost / 100) * 18).toFixed(2)}
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
                                                            totalproductsCost +
                                                            (totalproductsCost < 200
                                                                ? 40
                                                                : 0) -
                                                            ((totalproductsCost / 100) * 10) +
                                                            ((totalproductsCost / 100) * 18)
                                                        ).toFixed(2)
                                                        : 0}
                                                </span>
                                            </label>
                                            <br></br>
                                            <button
                                                className="btn btn-success"
                                                style={{
                                                    marginLeft: "30px",
                                                    marginTop: "30px",
                                                    width: "200px",
                                                }}
                                                onClick={() => {
                                                    submitOrderHandler()
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
            </div>
        </Layout>
    );
};

export default CreateProduct;
