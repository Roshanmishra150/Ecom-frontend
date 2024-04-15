import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { toast } from "react-hot-toast";
import axios from "axios";

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

const Orders = () => {
  const [productLists, setProductLists] = useState([]);
  const [similarProductLists, setSimilarProductLists] = useState([]);
  const [value, setValue] = React.useState(2);
  const [hover, setHover] = React.useState(-1);
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(false);
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
    if(currentURL.includes('slug')){
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
    }
  }, []);

  useEffect(() => {
    if(productLists?._id && productLists?.category){
      getSimilarProductLists();
    }
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
width: auth?.toggle ? "85.4%"  : "96.6%",
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
    marginLeft:"5px",
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
    height: "100%", // Adjust the magnified image height
    backgroundImage: `url(${`${process.env.REACT_APP_API}/api/v1/product/get-product-photo/${productLists._id}`})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: `-${mousePosition.x * 3}px -${mousePosition.y * 0.9}px`, // Adjust magnification
    visibility: isHovered ? "visible" : "hidden",
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
        `${process.env.REACT_APP_API}/api/v1/auth/orders`,{productIds: [initialCartItemsObject],
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
        : 0}
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
    }else{
      navigate("/login")
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
                          onClick={()=>submitOrderHandler()}
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
                                </>
                    )
                  }




                </div>
              )}
              </div>
              </div>
              <div className="row row-cols-1 row-cols-md-4 g-4 mt-5">
              {similarProductLists.length > 0 ? (
                similarProductLists?.map((item, index) => {
                  return (
                    <div className="col cardHover" style={{cursor:"pointer"}}>
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
                              {/* {value !== null && (
                                <Box sx={{ ml: 2 }}>
                                  {labels[hover !== -1 ? hover : value]}
                                </Box>
                              )} */}
                            </Box>
                          </div>
                        </div>
                        <div className=" d-flex justify-content-around pb-2">
                          {/* <button
                                type=""
                                className="btn btn-outline-danger "
                                onClick={() => handelDelete(item)}
                                style={{ paddingBottom: "3px" }}
                              >
                                <MdDeleteForever
                                  style={{
                                    fontSize: "17px",
                                    marginRight: "3px",
                                    marginTop: "-3px",
                                  }}
                                />{" "}
                                Delete
                              </button> */}

                          {/* <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={() => {
                              sessionStorage.setItem("productId", item._id);
                              sessionStorage.setItem("slug", item.slug);
                              navigate("/admin/product-details");
                            }}
                          >
                            <FiEdit2
                              style={{
                                fontSize: "17px",
                                marginRight: "6px",
                                marginTop: "-3px",
                              }}
                            />{" "}
                            Edit
                          </button> */}
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
        )}
            </div>
          </div>
          </div>

        {/* <div className="row row-cols-1 row-cols-md-4 g-4 mt-5">
              {similarProductLists.length > 0 ? (
                similarProductLists?.map((item, index) => {
                  return (
                    <div className="col">
                      <div className="card h-100">
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
                                value={value}
                                precision={0.5}
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
                                    }}
                                    fontSize="inherit"
                                  />
                                }
                                readOnly
                              />
                              
                            </Box>
                          </div>
                        </div>
                        <div className=" d-flex justify-content-around pb-2">
                          

                          <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={() => {
                              sessionStorage.setItem("productId", item._id);
                              sessionStorage.setItem("slug", item.slug);
                              navigate("/admin/product-details");
                            }}
                          >
                            <FiEdit2
                              style={{
                                fontSize: "17px",
                                marginRight: "6px",
                                marginTop: "-3px",
                              }}
                            />{" "}
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="">No Data Available</p>
              )}
        </div> */}
      </div>
    </Layout>
  );
};

export default Orders;
