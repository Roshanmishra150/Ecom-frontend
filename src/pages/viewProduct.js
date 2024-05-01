import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { toast } from "react-hot-toast";
import axios from "axios";
import { VscSend } from "react-icons/vsc";

import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate } from "react-router-dom";
import { FiEdit2 } from "react-icons/fi";
import { IoMdAdd } from "react-icons/io";
import { FaJediOrder } from "react-icons/fa";
import { AiOutlineFundView } from "react-icons/ai";
import { useAuth } from "../context/AuthContext";
import { v4 as uuidv4 } from 'uuid';
import AdminMenu from "../components/layout/AdminMenu";
import UsersMenu from "../pages/User/UsersMenu";
import { FaHeart } from "react-icons/fa";
import { Input, Modal } from "@mui/material";


const Orders = () => {
  const [productLists, setProductLists] = useState([]);
  const [reviewQuestion, setReviewQuestion] = useState([]);
  const [tempReviewQuestion, setTempReviewQuestion] = useState([]);
  const [similarProductLists, setSimilarProductLists] = useState([]);
  const [wishlistFlag, setWishlistFlag] = useState(true);
  const [sendAnswerFlag, setSendAnswerFlag] = useState(false);
  const [askQuestionValue, setAskQuestionValue] = useState("");
  const [answer, setAnswer] = useState("");
  const [faqs_id, setFaqs_id] = useState("");
  const [askQuestionSearchValue, setAskQuestionSearchValue] = useState("");
  const [value, setValue] = React.useState(2);
  const [hover, setHover] = React.useState(-1);
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [askQuestionFlag, setAskQuestionFlag] = useState(false);
  const [showViewCart, setShowViewCart] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [auth, setAuth] = useAuth()

  const navigate = useNavigate()
  //   const labels = {
  //     0.5: "Useless",
  //     1: "Useless+",
  //     1.5: "Poor",
  //     2: "Poor",
  //     2.5: "Ok",
  //     3: "Ok",
  //     3.5: "Good",
  //     4: "Good",
  //     4.5: "Excellent",
  //     5: "Excellent",
  //   };

  //   function getLabelText(value) {
  //     return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
  //   }

  const getProductLists = async () => {
    // const currentURL = window.location.href;
    // let slug = ""
    // if(currentURL.includes('slug')){
    //   const segments = currentURL.split('/');
    //   const id = segments[segments.length - 2];   
    //   let slug = segments[segments.length - 1];
    //   sessionStorage.setItem('productId', id)
    //   sessionStorage.setItem('slug', slug)
    //   window.location.replace(`${process.env.REACT_APP}/view-product`);
    // }else{
    // }
    const slug = sessionStorage.getItem("slug");
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/get-single-product/${slug}`
      );
      if (data.success) {
        setProductLists(data.product);
        setValue(data.product.rating);
        // getSimilarProductLists()
      }
      setLoading(false);

    } catch (error) {
      toast.error("Something went wrong in getting categories");
      setLoading(false);
    }
  };
  const getSimilarProductLists = async () => {
    // const slug = sessionStorage.getItem("slug");
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/similarProducts/${productLists._id}/${productLists.category}`
      );
      if (data.success) {
        // setSimilarProductLists(data.products);
        setSimilarProductLists(data?.products)
        console.log("similarProductList data..", data.products);

        // setValue(data.product.rating);
      }
      setLoading(false);
    } catch (error) {
      //   toast.error("Something went wrong in getting similar products");
      setLoading(false);
    }
  };
  //   console.log("product", productLists);
  //   console.log("similarProductList", similarProductLists);




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

      response?.data?.cartItems?.map((item, index) => {
        if (sessionStorage.getItem("productId") == item?.product?._id) {
          console.log("prrrrrrr", item?.product?._id);
          setShowViewCart(true)
        }
      })


    }
  };

  useEffect(() => {
    const currentURL = window.location.href;
    if (currentURL.includes('slug')) {
      const segments = currentURL.split('/');
      const id = segments[segments.length - 3];
      const value = segments[segments.length - 1];
      sessionStorage.setItem('productId', id)
      sessionStorage.setItem('slug', value)
      window.location.replace(`${process.env.REACT_APP_URL}/view-product`);
    }
    setShowViewCart(false)
    getProductLists();
    if (auth?.user) {
      addToCartFunc()
      getWishlistData()
      getProductQandAHandler()
    }
  }, []);

  useEffect(() => {
    if (productLists?._id && productLists?.category) {
      getSimilarProductLists();
    }
    getProductQandAHandler()
  }, [productLists]);

  const containerStyleMain = {
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

  const containerStyle = {
    display: "flex",
    // marginLeft:`${sessionStorage.getItem("token") ? (auth?.toggle ? "220px" : "50px") : "0px"}`,
    marginLeft: "5px",
    alignItems: "center",
    gap: "200px",
    width: "400px",
    height: "400px",
  };

  const mainImageStyle = {
    // margin:"60px",
    width: "400px", // Adjust the main image width
    height: "400px", // Adjust the main image height
  };

  const magnifiedImageStyle = {
    marginLeft: "100px",
    width: "780px", // Adjust the magnified image width
    height: "120%", // Adjust the magnified image height
    backgroundImage: `url(${`${process.env.REACT_APP_API}/api/v1/product/get-product-photo/${productLists._id}`})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: `-${mousePosition.x * 1}px -${mousePosition.y * 0.9}px`, // Adjust magnification
    visibility: isHovered ? "visible" : "hidden",
    backgroundSize: "100% auto",
  };

  const handleMouseMove = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  const cursorBoxStyle = {
    position: "absolute",
    width: "150px",
    height: "150px",
    borderRadius: "0%", // Rounded shape
    zIndex: 1,
    background: "rgba(62,172,233,0.4)", // Semi-transparent red background
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)", // Box shadow for blur effect
    pointerEvents: "none",
    transform: "translate(-45%, -10%)",
    left: `${mousePosition.x}px`,
    top: `${mousePosition.y}px`,
    visibility: isHovered ? "visible" : "hidden",
  };

  const getWishlistData = async () => {
    try {
      const productId = sessionStorage.getItem("productId");

      const res = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/get-wishlist/${auth?.user?._id}`)
      if (res?.data?.success) {

        const product = res?.data?.wishlist?.find(item => item.productId._id === productId);
        console.log("productIndex", product);
        if (product) {
          // Assuming wishlistFlag is a state variable
          setWishlistFlag(false);
        }

      }

    } catch (error) {

    }
  }

  const setToWishlistHandler = async () => {
    try {
      const body = {
        "products": sessionStorage.getItem("productId"),
        "userId": auth?.user?._id
      }

      const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/product/set-wishlist`, body)

      if (res?.data?.success) {
        toast.success("Product successfully added to whislist")
        setWishlistFlag(false)
      }

    } catch (error) {

    }
  }


  const addToCartFunction = async (id) => {
    if (sessionStorage.getItem("user")) {

      setLoading(true)
      const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/addToCart`, { productId: id, userId: auth?.user?._id });

      if (data?.success) {
        const cCount = sessionStorage.getItem("cCount")
        sessionStorage.setItem("cCount", parseInt(cCount, 10) + 1)
        setLoading(false)
        toast.success("Product Successfully Added")
        setShowViewCart(true)
      }
    } else {
      navigate("/login")
    }
  };

  const generateInvoiceNumber = () => {
    const timestamp = new Date().getTime();
    const uniqueId = uuidv4().slice(0, 6);
    return `${timestamp}_${uniqueId}`;
  };


  const submitOrderHandler = async () => {
    if (sessionStorage.getItem("user")) {


      const initialCartItemsObject = {
        // ...item.product,
        name: productLists.name,
        slug: productLists.slug,
        description: productLists.description,
        quantity: productLists.quantity,
        totalCost: productLists.price,
        price: productLists.price,
        productId: productLists._id,
        cart_id: productLists?._id,
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
          productLists.price > 0
            ? (
              productLists.price +
              (productLists.price < 200
                ? 40
                : 0) -
              ((productLists.price / 100) * 10) +
              ((productLists.price / 100) * 18)
            ).toFixed(2)
            : 0
      }
      );
      if (response?.data?.success) {
        // cartItems?.map(async(item, index) => {
        //     await axios.delete(
        //         `${process.env.REACT_APP_API}/api/v1/auth/removeCartItem/${cartItems[index].cart_id}`
        //     );
        // })
        // addToCartFunc()
        toast.success("Your Order Is Successful")
        navigate("/user/orders")
      }
    } else {
      navigate("/login")
    }
  }

  const submitPaymentTransaction = async (e) => {
    try {
      if (sessionStorage.getItem("user")) {

        const bodyContant = {
          "amount": productLists.price > 0
            ? (
              productLists.price +
              (productLists.price < 200
                ? 40
                : 0) -
              ((productLists.price / 100) * 10) +
              ((productLists.price / 100) * 18)
            ).toFixed(2)
            : 0,
          // "amount": 100,
          "currency": "INR",
          "receipt": "Receipt no. 1",
        }

        const response = await axios.post(`${process.env.REACT_APP_API}/api/v1/product/payment`, bodyContant)

        console.log("razorpay", response);
        var options = {
          "key": "rzp_test_gDudH6f3qtaRif", // Enter the Key ID generated from the Dashboard
          // "amount":100,
          "amount": productLists.price > 0
            ? (
              productLists.price +
              (productLists.price < 200
                ? 40
                : 0) -
              ((productLists.price / 100) * 10) +
              ((productLists.price / 100) * 18)
            ).toFixed(2)
            : 0,  // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
          "currency": "INR",
          "name": "E-commerce",
          "description": "Test Transaction",
          "image": "/logo192.png",
          "order_id": response?.data?.orders?.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
          "handler": async function (response) {
            const body = { ...response }

            const validate = await axios.post(`${process.env.REACT_APP_API}/api/v1/product/payment/validate`, body)
            if (validate?.data?.success) {
              submitOrderHandler()
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
          alert(response.error.code);
          alert(response.error.description);
          alert(response.error.source);
          alert(response.error.step);
          alert(response.error.reason);
          alert(response.error.metadata.order_id);
          alert(response.error.metadata.payment_id);
        });

        rzp1.open();
        e.preventDefault();

        if (response?.data?.success === true) {
          toast.success(response?.data?.message)
        } else {
          toast.error(response?.data?.message)
        }
      } else {
        navigate("/login")
      }

    } catch (error) {

    }
  }


  const getProductQandAHandler = async () => {
    try {
      const productId = sessionStorage.getItem('productId')
      const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/getProduct-question/${productId}`)

      console.log("getProductQandAHandler", response);

      if (response?.statusText == "OK") {
        setReviewQuestion(response?.data)
        setTempReviewQuestion(response?.data)
      }
    } catch (error) {

    }
  }

  const onChangeAskQuestionSearchHandler = async (e) => {

    const inputValue = e.target.value.toLowerCase(); // Convert input value to lowercase
    if (inputValue != "") {
      const filteredValue = tempReviewQuestion.filter((quest) =>
        quest.question.toLowerCase().includes(inputValue)
      );

      setReviewQuestion(filteredValue);
      setAskQuestionSearchValue(e.target.value);
    } else {
      getProductQandAHandler()
      setAskQuestionSearchValue("")
    }
  }


  const AksQuestionHandler = async () => {
    try {
      const body = {
        "productId": sessionStorage.getItem('productId'),
        "user": auth?.user?._id,
        "question": askQuestionValue
      }
      const response = await axios.post(`${process.env.REACT_APP_API}/api/v1/product/ask-question`, body)
      if (response?.statusText == "Created") {
        toast.success("Question is submited successfully")
        getProductQandAHandler()
        setAskQuestionValue("")
        setAskQuestionFlag(false)
      }
    } catch (error) {

    }
  }
  const sendAnswerHandler = async () => {
    try {
      
      const body = {
        "answer": answer
      }
      const response = await axios.put(`${process.env.REACT_APP_API}/api/v1/product/replyTo-question/${faqs_id}`, body)

      console.log("send res", response);
      if (response?.statusText == "OK") {
        toast.success("Answer is submited successfully")
        setAnswer("")
        setFaqs_id("")
        setSendAnswerFlag(false)
      }
    } catch (error) {

    }
  }

  return (
    <Layout title="viewProduct - E-comm">
      <div style={containerStyle} className="container-fluid p-4 m-0">
        <div style={containerStyle} className="container-fluid m-0 p-4">
          <div className="row ">
            <div style={leftStyle} className="col-md-3 ">
              {auth?.user?.role === 1 ? <AdminMenu /> : (auth?.user?.role === 0) ? <UsersMenu /> : ""}
            </div>
            <style>{lightScrollbarCSS}</style>
            <div style={rightStyle} className="col-md-9 ">

              {loading === true ? (
                <>
                  <div className="loader"></div>
                  <p className="loadingPara">Loading...</p>
                </>
              ) : (
                <div>
                  <div className=" d-flex justify-content-between ">
                    <div className=" d-flex ">
                      <div
                        style={containerStyle}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onMouseMove={handleMouseMove}
                      >
                        <img
                          src={`${process.env.REACT_APP_API}/api/v1/product/get-product-photo/${productLists._id}`}
                          alt={"product_pic"}
                          style={mainImageStyle}
                        />
                      </div>
                      {isHovered === true ? (
                        <>
                          <div
                            className="magnified-image"
                            style={magnifiedImageStyle}
                          />
                          <div style={cursorBoxStyle} />
                          <div
                            className="productContents "
                            style={{ paddingLeft: "25px" }}
                          ></div>
                        </>
                      ) : (
                        <div className="" style={{ marginLeft: "25px" }}>
                          <h1>{productLists.name}</h1>
                          <p>{productLists.details}</p>
                          <p>{productLists.description}</p>
                          <h3> $ {productLists.price}</h3>
                          {/* <h3> $ {productLists.rating}</h3> */}
                          <Rating
                            name="hover-feedback"
                            value={productLists?.averageRating}
                            precision={0.5}
                            // getLabelText={getLabelText}
                            onChange={(event, newValue) => {
                              setValue(newValue);
                            }}
                            onChangeActive={(event, newHover) => {
                              setHover(newHover);
                            }}
                            emptyIcon={
                              <StarIcon
                                style={{
                                  opacity: 0.5,
                                  verticalAlign: "text-bottom",
                                }} // Adjust the vertical alignment
                                fontSize="inherit"
                              />
                            }
                            readOnly
                          />
                          <br></br>
                          {
                            auth && auth?.user?.role == "0" && showViewCart === true ? (
                              <>
                                <button className="btn btn-primary"
                                  onClick={() => {
                                    navigate("/user/carts")
                                  }}
                                >
                                  <AiOutlineFundView
                                    style={{
                                      fontSize: "17px",
                                      marginRight: "6px",
                                      marginTop: "-3px",
                                    }}
                                  />
                                  View To Cart
                                </button>
                                {
                                  wishlistFlag ?
                                    <button className="btn btn-primary"
                                      style={{ marginLeft: "30px" }}
                                      onClick={() => {
                                        setToWishlistHandler()
                                      }}
                                    >
                                      <FaHeart
                                        style={{
                                          fontSize: "17px",
                                          marginRight: "6px",
                                          marginTop: "-3px",
                                        }}
                                      />
                                      Add To Wishlist
                                    </button> : ""
                                }
                              </>
                            ) : (auth?.user?.role == "1") ? ("") : (
                              <>
                                <button className="btn btn-primary"
                                  onClick={() => {
                                    addToCartFunction(sessionStorage.getItem("productId"));
                                  }}>
                                  <IoMdAdd
                                    style={{
                                      fontSize: "17px",
                                      marginRight: "6px",
                                      marginTop: "-3px",
                                    }}
                                  />
                                  Add To Cart
                                </button>
                                <button className="btn btn-success" style={{ marginLeft: "30px" }}
                                  onClick={(e) => {
                                    // submitOrderHandler()
                                    submitPaymentTransaction(e)
                                  }}
                                >
                                  <FaJediOrder
                                    style={{
                                      fontSize: "17px",
                                      marginRight: "9px",
                                      marginTop: "-4px",
                                    }}
                                  />
                                  Order Now
                                </button>
                                {
                                  wishlistFlag ?
                                    <button className="btn btn-primary"
                                      style={{ marginLeft: "30px" }}
                                      onClick={() => {
                                        setToWishlistHandler()
                                      }}
                                    >
                                      <FaHeart
                                        style={{
                                          fontSize: "17px",
                                          marginRight: "6px",
                                          marginTop: "-3px",
                                        }}
                                      />
                                      Add To Wishlist
                                    </button> : ""
                                }
                              </>
                            )
                          }
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="Q_A_containers" style={{ marginTop: "80px" }}>
                    <div className=" d-flex "
                      style={{
                        height: "35px"
                      }}>
                      <h3>FAQ</h3>
                      <input
                        type="text"
                        className="" style={{
                          marginLeft: "20px",
                          width: "40%",
                          padding: "10px",
                        }}
                        value={askQuestionSearchValue}
                        onChange={(e) => {
                          onChangeAskQuestionSearchHandler(e)
                        }}
                        placeholder="Search your question.."

                      />
                      <button className="btn btn-success" style={{
                        marginLeft: "30px"
                      }}
                        onClick={() => setAskQuestionFlag(true)}
                      >
                        Ask question
                      </button>
                    </div>
                    {
                      reviewQuestion?.length > 0 ?
                        <div className="Q_A_container">

                          {auth?.user?.role == "1" && reviewQuestion?.map((item, index) => {
                            return item?.answer == "" && (
                              <div key={index} style={{ marginLeft: "15px", marginTop: "20px" }}>
                                <h5> {index + 1}. {item?.question.charAt(0).toUpperCase() + item?.question.slice(1)}</h5>
                                <span style={{ fontWeight: "bold", marginLeft: "10px" }}> Ans:
                                  <Input
                                    style={{
                                      width: "40%",
                                      marginLeft: "15px",
                                      marginTop: "-5px"
                                    }} 
                                    value={answer}
                                    onChange={(e) => {
                                      setAnswer(e.target.value)
                                      setFaqs_id(item?._id)
                                    }}
                                  />

                                  <button className="btn btn-primary" style={{
                                    marginLeft: "15px"
                                  }}
                                    onClick={() => {
                                      setSendAnswerFlag(true)
                                    }}

                                  >
                                    <VscSend /> Send
                                  </button>
                                </span>
                              </div>
                            );
                          })}
                          {auth?.user?.role == "0" && reviewQuestion?.map((item, index) => {
                            return (
                              <div key={index} style={{ marginLeft: "15px", marginTop: "20px" }}>
                                <h5> {index + 1}. {item?.question.charAt(0).toUpperCase() + item?.question.slice(1)}</h5>
                                <span style={{ marginLeft: "10px" }}>
                                  <span style={{ fontWeight: "bold" }}>Ans:</span> {item?.answer === "" ? (
                                    <span>Waiting For Admin Response...</span>
                                  ) : (
                                    item?.answer.charAt(0).toUpperCase() + item?.answer.slice(1)
                                  )}
                                </span>

                              </div>
                            );
                          })}
                        </div>
                        : <p style={{ marginTop: "15px" }}>No Data Available</p>
                    }

                  </div>

                  <div className="mt-5">
                    <h3>Related Products</h3>
                    <div className="row row-cols-1 row-cols-md-4 g-4 mt-2">
                      {similarProductLists.length > 0 ? (
                        similarProductLists?.map((item, index) => {
                          return (
                            <div className="col " style={{ cursor: "pointer" }}>
                              <div className="card h-100" onClick={() => {
                                sessionStorage.setItem(
                                  "productId",
                                  item._id
                                );
                                sessionStorage.setItem("slug", item.slug);
                                if (auth?.user?.role == "0") {
                                  navigate("/user/view-product")
                                  getProductLists()
                                  // window.location.reload()
                                } else if (auth?.user?.role == "1") {
                                  navigate("/admin/view-product")
                                  getProductLists()
                                  // window.location.reload()
                                } else {
                                  sessionStorage.clear()
                                  navigate("/login")
                                }
                              }}>
                                <img
                                  src={`${process.env.REACT_APP_API}/api/v1/product/get-product-photo/${item._id}`}
                                  className="card-img-top"
                                  alt="..."
                                  style={{ width: "100%", height: "190px" }}
                                />
                                <div className="card-body">
                                  <h5 className="card-title">
                                    {item.name} $<span>{item.price}</span>
                                  </h5>
                                  <p className="card-text">{item.description}</p>
                                  <div>
                                    <Box
                                      sx={{
                                        width: 200,
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Rating
                                        name="hover-feedback"
                                        value={item?.averageRating}
                                        precision={0.5}
                                        // getLabelText={getLabelText}
                                        onChange={(event, newValue) => {
                                          setValue(newValue);
                                        }}
                                        onChangeActive={(event, newHover) => {
                                          setHover(newHover);
                                        }}
                                        emptyIcon={
                                          <StarIcon
                                            style={{
                                              opacity: 0.5,
                                              verticalAlign: "text-bottom",
                                            }} // Adjust the vertical alignment
                                            fontSize="inherit"
                                          />
                                        }
                                        readOnly
                                      />

                                    </Box>
                                  </div>
                                </div>
                                <div className=" d-flex justify-content-around pb-2">
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="">No Data Available</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <Modal open={askQuestionFlag} style={{ width: "100px" }}>
          <div
            className={
              askQuestionFlag ? "modal cus-modal fade show" : "modal cus-modal fade"
            }
            id="GreetingnModal"
            tabIndex={-1}
            aria-labelledby="exampleModalLabel"
            style={askQuestionFlag ? { display: "block" } : { display: "none" }}
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
                    <h4 className=" pt-2"> Ask Question </h4>
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={() => setAskQuestionFlag(false)}
                  ></button>
                </div>
                <div className="modal-body cus-m-body gree-m-body pd-t0 pd0">
                  <h4>Ask your question related this product ? </h4>
                  <textarea
                    style={{
                      width: "100%",
                      outline: "none",
                      border: "solid 1px gray 1px 0px 0px 0px",
                      height: "80px",
                      padding: "5px"
                    }}
                    value={askQuestionValue}
                    onChange={(e) => setAskQuestionValue(e.target.value)}

                    placeholder="Ask question.." />
                </div>
                <div className="modal-footer border-0">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      AksQuestionHandler()
                    }}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal>

        {/* send answer confirmation popup */}
        <Modal open={sendAnswerFlag} style={{ width: "100px" }}>
          <div
            className={
              sendAnswerFlag ? "modal cus-modal fade show" : "modal cus-modal fade"
            }
            id="GreetingnModal"
            tabIndex={-1}
            aria-labelledby="exampleModalLabel"
            style={sendAnswerFlag ? { display: "block" } : { display: "none" }}
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
                    <h4 className=" pt-2"> Confirmation </h4>
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={() => setSendAnswerFlag(false)}
                  ></button>
                </div>
                <div className="modal-body cus-m-body gree-m-body pd-t0 pd0">
                  <h4>Please confirm the below answer. </h4>
                  <textarea
                    style={{
                      width: "100%",
                      outline: "none",
                      border: "solid 1px gray 1px 0px 0px 0px",
                      height: "80px",
                      padding: "5px"
                    }}
                    value={answer}
                    // onChange={(e) => setAskQuestionValue(e.target.value)}

                     />
                </div>
                <div className="modal-footer border-0">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      sendAnswerHandler()
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
  );
};

export default Orders;
