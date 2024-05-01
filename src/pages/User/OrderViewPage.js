import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import { toast } from "react-hot-toast";
import axios from "axios";
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate, useParams } from "react-router-dom";
import { FiEdit2 } from "react-icons/fi";
import { IoMdAdd } from "react-icons/io";
import { FaJediOrder } from "react-icons/fa";
import { AiOutlineFundView } from "react-icons/ai";
import ReviewsIcon from '@mui/icons-material/Reviews';
import { useAuth } from "../../context/AuthContext";
import { v4 as uuidv4 } from 'uuid';
// import AdminMenu from "../../components";
import UsersMenu from "../User/UsersMenu";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { Modal } from "@mui/material";
import gif from '../../images/thank-you.gif'
import { FaHeart } from "react-icons/fa";



const Orders = () => {
    const [productLists, setProductLists] = useState([]);
    const [orderlist, setOrderlist] = useState({});
    const [similarProductLists, setSimilarProductLists] = useState([]);
    const [value, setValue] = React.useState(2);
    const [hover, setHover] = React.useState(-1);
    const [isHovered, setIsHovered] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showViewCart, setShowViewCart] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [auth, setAuth] = useAuth()
    const navigate = useNavigate()
    const params = useParams()

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAtEnd, setIsAtEnd] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [ratingFlag, setRatingFlag] = useState(false);

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
    const slideWidth = 40;

    const [selectedRating, setSelectedRating] = useState(null);
    const [hoveredEmotion, setHoveredEmotion] = useState(null);
    const [showGif, setShowGif] = useState(false);
    const [wishlistFlag, setWishlistFlag] = useState(true);



    const handleRatingHover = (rating) => {
        setSelectedRating(rating);
        setHoveredEmotion(getEmotionByRating(rating));
    };

    const handleRatingClick = (rating) => {
        console.log('Selected rating:', rating);
        setSelectedRating(rating);
        // You can add logic here to handle the selected rating
    };
    useEffect(() => {
        handleRatingHover(10)
        handleRatingClick(10)
    }, [])

    const getEmotionByRating = (rating) => {
        switch (rating) {
            case 1:
                return 'Very sad 😢';
            case 2:
                return 'Sad 😔';
            case 3:
                return 'Neutral 😐';
            case 4:
                return 'Okay 🙂';
            case 5:
                return 'Happy 😊';
            case 6:
                return 'Excited 😃';
            case 7:
                return 'Thrilled 😄';
            case 8:
                return 'Awesome 🤩';
            case 9:
                return 'Amazing 😍';
            case 10:
                return 'Overwhelmed 🥳';
            default:
                return '';
        }
    };

    const renderEmojis = () => {
        const emojis = ['😢', '😔', '😐', '🙂', '😊', '😃', '😄', '🤩', '😍', '🥳'];
        return emojis.map((emoji, index) => (
            <span
                key={index}
                style={{
                    fontSize: '2rem',
                    margin: '0 5px',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease-in-out',
                    transform: selectedRating === index + 1 ? 'scale(1.5)' : 'scale(1)',
                    ...(selectedRating === index + 1 && {
                        '&:hover': {
                            transform: 'scale(1.2)',
                            '&::after': {
                                transform: 'scaleX(1)',
                            },
                        },
                    })
                }}
                onMouseEnter={() => handleRatingHover(index + 1)}
                // onMouseLeave={() => {
                //     setSelectedRating(null);
                //     setHoveredEmotion(null);
                // }}
                onClick={() => handleRatingClick(index + 1)}
            >
                {emoji}
                <span className="underline" style={{
                    content: '',
                    position: 'absolute',
                    width: '100%',
                    transform: 'scaleX(0)',
                    height: '2px',
                    bottom: '-2px',
                    left: 0,
                    backgroundColor: '#0087ca',
                    transformOrigin: 'bottom left',
                    transition: 'transform 0.25s ease-out',
                }} />
            </span>
        ));
    };


    const images = [
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150'
    ];

    useEffect(() => {
        const sliderImages = document.querySelector('.slider-images');
        if (sliderImages) {
            const handleTransitionEnd = () => {
                setIsAtEnd((currentIndex + 1) >= orderlist?.products?.length);
            };
            sliderImages.addEventListener('transitionend', handleTransitionEnd);
            return () => {
                sliderImages.removeEventListener('transitionend', handleTransitionEnd);
            };
        }
    }, [currentIndex, images.length]);

    const goToPrevSlide = () => {
        const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNextSlide = () => {
        const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    const isAtBeginning = currentIndex === 0;



    // const [scrollPosition, setScrollPosition] = useState(0);
    // const [maxScrollPosition, setMaxScrollPosition] = useState(0);

    const getProductLists = async () => {
        const slug = sessionStorage.getItem("slug");
        setLoading(true);
        try {
            const { data } = await axios.get(
                `${process.env.REACT_APP_API}/api/v1/product/get-single-product/${slug}`
            );
            if (data.success) {
                setProductLists(data.product);
                setValue(data.product.rating);
            }
            setLoading(false);
        } catch (error) {
            toast.error("Something went wrong in getting categories");
            setLoading(false);
        }
    };

    const getSimilarProductLists = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(
                `${process.env.REACT_APP_API}/api/v1/product/similarProducts/${productLists._id}/${productLists.category}`
            );
            if (data.success) {
                setSimilarProductLists(data?.products)
                console.log("similarProductList data..", data.products);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    const addToCartFunc = async () => {
        setLoading(true);
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

    const loadOrderList = async () => {
        const orderListData = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/ordersStatus`, {
            orderId: `${params?.order_id}`,
            // status: "Processing"
        })
        setOrderlist(orderListData?.data?.order);
        sessionStorage.setItem("slug", orderListData?.data?.order?.products[0]?.slug)
        console.log("orderlist", params?.order_id, orderListData?.data?.order);
        setShowViewCart(false)
        getProductLists();
        if (auth?.user) {
            addToCartFunc()
        }
    }

    useEffect(() => {
        loadOrderList()
        // setShowViewCart(false)
        // getProductLists();
        // if (auth?.user) {
        //     addToCartFunc()
        // }
    }, []);

    useEffect(() => {
        if (productLists?._id && productLists?.category) {
            getSimilarProductLists();
        }
    }, [productLists]);

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
        width: "100px",
        height: "100px",
        borderRadius: "0%", // Rounded shape
        zIndex: 1,
        background: "rgba(62,172,233,0.4)", // Semi-transparent red background
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)", // Box shadow for blur effect
        pointerEvents: "none",
        transform: "translate(-25%, 145%)",
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
                toast.success("Your Order Is Successful")
                navigate("/user/orders")
            }
        } else {
            navigate("/login")
        }
    }



    const submitRatingHandler = async (star) => {
        try {

            // productId, rating, comment, userId
            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/product/rating`, { productId: productLists?._id, rating: (selectedRating / 2), comment: "", userId: auth?.user?._id });

            if (data?.success) {
                toast.success(data?.message)
                loadOrderList()
                setRatingFlag(false)
                setShowGif(true);

            }
        } catch (error) {

        } finally {
            // Hide the GIF after 2 minutes
            setTimeout(() => {
                setShowGif(false);
            }, 5000)
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

    return (
        <Layout title="viewOrderProduct - E-comm">
            <div style={containerStyle} className="container-fluid p-4 m-0">
                <div style={containerStyle} className="container-fluid m-0 p-4">
                    <div className="row ">
                        <div style={leftStyle} className="col-md-3 ">
                            <UsersMenu />
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
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '20vh', marginBottom: "30px" }}>
                                        <div style={{ position: 'relative', width: '40%', height: '20vh', overflow: 'hidden' }}>
                                            <div className="slider-images" style={{ display: 'flex', width: `${images.length * slideWidth}%`, height: '100%', transition: 'transform 0.5s', transform: `translateX(-${currentIndex * (100 / images.length)}%)` }}>
                                                {
                                                    orderlist?.products?.map((image, index) => (
                                                        <div
                                                            key={index}
                                                            style={{
                                                                position: 'relative',
                                                                width: `${100 / images.length}%`,
                                                                height: '100%',
                                                                overflow: 'hidden',
                                                                cursor: 'pointer'
                                                            }}
                                                            onMouseEnter={() => setHoveredIndex(index)}
                                                            onMouseLeave={() => setHoveredIndex(null)}
                                                        >

                                                            <img
                                                                key={index}
                                                                src={`${process.env.REACT_APP_API}/api/v1/product/get-product-photo/${image?.productId}`}
                                                                alt={`Slide ${index}`}
                                                                style={{ width: `100%`, height: '100%', objectFit: 'cover' }}

                                                            />
                                                            {hoveredIndex === index && (
                                                                <div
                                                                    style={{
                                                                        position: 'absolute',
                                                                        top: 0,
                                                                        left: 0,
                                                                        width: '100%',
                                                                        height: '100%',
                                                                        background: 'rgba(0, 0, 209, 0.5)',
                                                                        display: 'flex',
                                                                        justifyContent: 'center',
                                                                        alignItems: 'center',
                                                                        color: '#fff',
                                                                        fontSize: '20px'
                                                                    }}
                                                                    onClick={() => {
                                                                        sessionStorage.setItem("slug", image?.slug);
                                                                        sessionStorage.setItem("productId", image?.productId);
                                                                        getProductLists()
                                                                    }}
                                                                >
                                                                    Click Me
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                            <button style={{ position: 'absolute', top: '50%', left: '0', transform: 'translateY(-50%)', zIndex: '1', display: isAtBeginning ? 'none' : 'block', backgroundColor: "none" }} onClick={goToPrevSlide}><ArrowBackIosNewOutlinedIcon /></button>
                                            <button style={{ position: 'absolute', top: '50%', right: '0', transform: 'translateY(-50%)', zIndex: '1', display: isAtEnd ? 'none' : 'block' }} onClick={goToNextSlide}><ArrowForwardIosIcon /></button>
                                        </div>
                                    </div>
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

                                                    <Box
                                                        sx={{
                                                            width: "100%",
                                                            display: "flex",
                                                            alignItems: "center",
                                                        }}
                                                    >
                                                        <Rating
                                                            name="hover-feedback"
                                                            value={productLists?.averageRating}
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
                                                                    }} // Adjust the vertical alignment
                                                                    fontSize="inherit"
                                                                />
                                                            }
                                                            readOnly
                                                        /> <button className="btn btn-link"
                                                            onClick={() => {
                                                                setRatingFlag(true)
                                                            }}
                                                        >
                                                            <ReviewsIcon
                                                                style={{
                                                                    fontSize: "17px",
                                                                    marginLeft: "6px",
                                                                    marginTop: "-3px",
                                                                    marginRight: "2px"
                                                                }}
                                                            />
                                                            Rate this product
                                                        </button>
                                                    </Box>
                                                    {value !== null && (
                                                        <Box sx={{ ml: 2 }}>
                                                            {labels[hover !== -1 ? hover : value]}
                                                        </Box>
                                                    )}
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
                                                                    onClick={() => submitOrderHandler()}
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
                                    <div className="row row-cols-1 row-cols-md-4 g-4 mt-5">
                                        {similarProductLists.length > 0 ? (
                                            similarProductLists?.map((item, index) => {
                                                return (
                                                    <div className="col cardHover" style={{ cursor: "pointer" }}>
                                                        <div className="card h-100" onClick={() => {
                                                            sessionStorage.setItem(
                                                                "productId",
                                                                item._id
                                                            );
                                                            sessionStorage.setItem("slug", item.slug);
                                                            if (auth?.user?.role == "0") {
                                                                navigate("/user/view-product")
                                                                window.location.reload()
                                                            } else if (auth?.user?.role == "1") {
                                                                navigate("/admin/view-product")
                                                                window.location.reload()
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
                            )}
                        </div>
                    </div>
                </div>
                {showGif && (
                    <div style={{
                        position: 'fixed',
                        top: 10,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 1000,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the transparency here
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <img
                            src={gif}
                            alt="Celebration GIF"
                            width={'50%'}
                            style={{ maxWidth: '100%', maxHeight: '100%' }}
                        />
                    </div>
                )}

                <Modal open={ratingFlag} style={{ width: "100px" }}>
                    <div
                        className={
                            ratingFlag ? "modal cus-modal fade show" : "modal cus-modal fade"
                        }
                        id="GreetingnModal"
                        tabIndex={-1}
                        aria-labelledby="exampleModalLabel"
                        style={ratingFlag ? { display: "block" } : { display: "none" }}
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
                                        <h4 className=" pt-2"> Rate Product</h4>
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                        onClick={() => setRatingFlag(false)}
                                    ></button>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <h6>To help us get better, please rate this product.</h6>
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        {renderEmojis()}
                                    </div>
                                    {/* {selectedRating ? ( */}
                                    <div style={{ marginTop: '20px' }}>
                                        <p>Selected emotion: {hoveredEmotion}</p>
                                    </div>
                                    {/* ): ""} */}
                                    <p>Your ratings/feedback will be appreciated. And help us to grow further</p>
                                </div>

                                <div className="modal-footer border-0">

                                    <button
                                        type="button"
                                        className="btn btn-outline-danger"
                                        data-bs-dismiss="modal"
                                        onClick={() => {
                                            setRatingFlag(false)
                                        }}
                                    >
                                        Close
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-outline-primary"
                                        onClick={() => {
                                            submitRatingHandler();
                                        }}
                                    >
                                        Save
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
