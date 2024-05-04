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

import "../../styles/Homepage.css";
import { BsPersonFill } from "react-icons/bs";
import { HiShoppingBag } from "react-icons/hi";
import { GiBilledCap } from "react-icons/gi";
import { CgPerformance } from "react-icons/cg";
import { Modal } from "@mui/material";

import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import { FaQuestionCircle } from "react-icons/fa";

import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import StarIcon from "@mui/icons-material/Star";
import { useAuth } from "../../context/AuthContext";

const CreateProduct = () => {
  const [loading, setLoading] = useState(false);
  const [auth, setAuth] = useAuth();
  const [filterFlag, setFilterFlag] = useState(false);
  const [totalProduct, setTotalProduct] = useState(0);
  const [filterCategory, setFilterCategory] = useState([]);
  const [filterPrice, setFilterPrice] = useState("");
  const [productLists, setProductLists] = useState([]);
  const [tempProductList, setTempProductList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [allCategory, setAllCategory] = useState([]);
  const navigate = useNavigate();

  const [value, setValue] = React.useState(2);
  const [hover, setHover] = React.useState(-1);
  const params = useParams();

  const priceArray = ["All", "0-10000", "10001-20000", "20001-30000", "above"];

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
  const getProductLists = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/get-products`
      );
      if (data.success) {
        setTempProductList(data.products);
        setProductLists(data.products);
        setTotalProduct(data.count);
        sessionStorage.setItem("totalProducts", JSON.stringify(data.count));
      }
      setLoading(false);
    } catch (error) {
      toast.error("Something went wrong in getting categories");
    }
  };

  const getAllCategory = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/category/category-list`
      );
      if (data.success) {
        const categoryArray = [];
        data.category.map((item, index) => {
          categoryArray.push(item.name);
        });
        setCategoryList(categoryArray);
        setAllCategory(data?.category);
      }
      setLoading(false);
    } catch (error) {
      toast.error("Something went wrong in getting categories");
    }
  };

  useEffect(() => {
    if(!auth){

      sessionStorage.clear()
        localStorage.clear()
      navigate("/login");
    }else{
      getProductLists();
      getAllCategory();
    }
  }, []);

  const handelDelete = async (item) => {
    try {
      setLoading(true);
      const { data } = await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/product//delete-product/${item._id}`
      );
      if (data.success) {
        toast.success(`Successfully deleted product ${item.name}`);
        getProductLists();
      }
      setLoading(false);
    } catch (error) {
      toast.error("Something went wrong in deleting product");
    }
  };

  const onChangeSearchHandler = async (keyword) => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/get-searched-product/${keyword}`
      );
      setProductLists(data);
      setLoading(false);
    } catch (error) {
      getProductLists();
    }
  };

  const onchangeFilterCategoryHandler = (event) => {
    const {
      target: { value },
    } = event;
    if (value !== "") {
      setFilterCategory(typeof value === "string" ? value.split(",") : value);
    } else {
      setFilterCategory([]);
    }
  };

  const ProductFilterHandler = async () => {
    let categoryIds = [];
    const filterMinPrice = "";
    let filterMaxPrice = "";




    if (filterCategory != "") {
      allCategory.map((item, index) => {
        filterCategory.map((name, index) => {
          if (item.name === name) {
            categoryIds.push(item._id);
          }
        });
      });
    }


    try {
      setLoading(true);
      const {
        data,
      } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/product/filter-products`,
        { categoryIds, filterPrice }
      );
      if (data?.success) {
        setProductLists(data.products);
      }
      setFilterFlag(false);
      setLoading(false);
    } catch (error) {
      toast.error("Something went wrong while filtering product ");
      setFilterFlag(false);
      getProductLists();
    }
  };

  const sortProductFunction = (basedOn) => {
    if (basedOn === "name") {
      const sortedData = productLists
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name));
      setProductLists(sortedData);
    } else if (basedOn === "price") {
      const sortedProducts = productLists.sort((a, b) => a.price - b.price);
      setProductLists([...sortedProducts]);
    } else if (basedOn === "createdAt") {
      const sortedProducts = productLists.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setProductLists([...sortedProducts]);
    } else {
      toast.error("not sorted by name");
    }
  };

  console.log("check log", filterCategory, filterPrice);


  return (
    <Layout title="E-commerce">
      <div style={containerStyle} className="container-fluid m-0 p-4">
        <div className="row ">
          <div style={leftStyle} className="col-md-3 ">
            {auth?.user?.role === 1 ? <AdminMenu /> : <UsersMenu />}
          </div>
          <style>{lightScrollbarCSS}</style>
          <div style={rightStyle} className="col-md-9 ">

            {/* <div className="row">
              <div className="col-md-3 col-sm-6 ">
                <div className="content-box">
                  <div className="box-para">
                    23
                  </div>
                  <div className="box-icon">
                    <BsPersonFill />
                  </div>
                </div>
                <p style={{ backgroundColor: "lightgray", fontSize: "larger", color: "gray", marginLeft: "-10px", width: "100%", border: "none", paddingLeft: "13px", paddingBottom: "8px" }}>Total Customers</p>

              </div>
              <div className="col-md-3 col-sm-6 ">
                <div className="content-box">
                  <div className="box-para">
                    {totalProduct}
                  </div>
                  <div className="box-icon">
                    <HiShoppingBag />
                  </div>
                </div>
                <p style={{ backgroundColor: "lightgray", fontSize: "larger", color: "gray", marginLeft: "-10px", width: "100%", border: "none", paddingLeft: "13px", paddingBottom: "8px" }}>Total Products</p>

              </div>
              <div className="col-md-3 col-sm-6 ">
                <div className="content-box">
                  <div className="box-para">
                    23
                  </div>
                  <div className="box-icon">
                    <GiBilledCap />
                  </div>
                </div>
                <p style={{ backgroundColor: "lightgray", fontSize: "larger", color: "gray", marginLeft: "-10px", width: "100%", border: "none", paddingLeft: "13px", paddingBottom: "8px" }}>Total Orders</p>

              </div>
              <div className="col-md-3 col-sm-6 ">
                <div className="content-box">
                  <div className="box-para">
                    23
                  </div>
                  <div className="box-icon">
                    <CgPerformance />
                  </div>
                </div>
                <p style={{ backgroundColor: "lightgray", fontSize: "larger", color: "gray", marginLeft: "-10px", width: "100%", border: "none", paddingLeft: "13px", paddingBottom: "8px" }}>Performance</p>

              </div>
            </div> */}

            <div
              className="row border-1 "
              style={{ border: "1px solid #0000", margin: "20px 0px" }}
            >
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search products..."
                  onChange={(e) => onChangeSearchHandler(e.target.value)}
                />
              </div>
              <div className="col-md-6 text-md-end d-flex justify-content-end">
                <button
                  className="btn btn-primary "
                  style={{ marginRight: "20px" }}
                  onClick={() => setFilterFlag(true)}
                >
                  {filterCategory != "" || filterPrice != ""
                    ? "Update Filter"
                    : "Apply Filter"}
                </button>

                <div class="dropdown">
                  <button
                    class="btn btn-secondary dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Apply Sorting
                  </button>
                  <ul class="dropdown-menu">
                    <li>
                      <button
                        class="dropdown-item"
                        type="button"
                        onClick={() => {
                          sortProductFunction("name");
                        }}
                      >
                        Sort By Name
                      </button>
                    </li>
                    <li>
                      <button
                        class="dropdown-item"
                        type="button"
                        onClick={() => {
                          sortProductFunction("price");
                        }}
                      >
                        Sort By Price
                      </button>
                    </li>
                    <li>
                      <button
                        class="dropdown-item"
                        type="button"
                        onClick={() => {
                          sortProductFunction("createdAt");
                        }}
                      >
                        Newly Created
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="card-container">

              {(loading === false && productLists.length > 0 )? (
                productLists?.map((item, index) => {
                  return (
                    <div
                      className="col "
                    //   onClick={() => {
                    //       // navigate("/view-product");
                    //       sessionStorage.setItem("productId", item. )
                    //       auth?.user?.role == 1 ? navigate("/admin/view-product") : navigate("/user/view-product")
                    //   }}
                    >
                      <div
                        style={{ cursor: "pointer" }}
                        className="card h-100 cardHover"
                        onClick={() => {
                          sessionStorage.setItem(
                            "productId",
                            item._id
                          );
                          sessionStorage.setItem("slug", item.slug);
                          auth?.user?.role == 1 ? navigate("/admin/view-product") : navigate("/user/view-product")
                        }}
                      >
                        {auth?.user?.role == "1" && item?.unansweredQuestionsCount > 0 ? (
                          <div style={{
                            zIndex: 10,

                          }}>

                            <FaQuestionCircle
                              style={{
                                position: "absolute",
                                top: "14px",
                                right: "15px",
                                backgroundColor: "teal",
                                color: "white",
                                fontSize: "30px",
                                borderRadius: "50%",
                                padding: "3px 5px",
                              }}
                            />
                            <span
                              style={{
                                position: "absolute",
                                top: "4px",
                                right: "8px",
                                backgroundColor: "teal",
                                color: "white",
                                fontSize: "15px",
                                borderRadius: "40%",
                                padding: "3px 5px",
                              }}
                            >
                              {item?.unansweredQuestionsCount}
                            </span>


                          </div>
                        ) : ""}


                        <img
                          src={`${process.env.REACT_APP_API}/api/v1/product/get-product-photo/${item._id}`}
                          className="card-img-top"
                          alt="..."
                          style={{ width: "100%", height: "190px" }}
                        />
                        <div className="card-body">
                          <h5 className="card-title">
                            {item.name}
                            {/* $<span>{item.price}</span> */}
                          </h5>
                          <p className="card-text" >{(item.description).split(' ').slice(0, 30).join(' ')}</p>
                          <div>
                            <Box
                              sx={{
                                width: 200,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between"
                              }}
                            >
                              <Rating
                                name="hover-feedback"
                                value={item?.averageRating}
                                precision={0.5}
                                getLabelText={getLabelText}
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
                            <div style={{ fontWeight: "bold", marginTop: "3px" }}>
                              ${item.price}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <>
                  <p style={{ display: "flex", justifyContent: "center" }}> Not Data Available</p>
                </>
              )}

              {
                loading ? (<>
                  <div className="loader"></div>
                  <p className="loadingPara">Loading...</p>
                </>) : null
              }

            </div>
          </div>
        </div>

        {/* Filter modal */}
        <Modal open={filterFlag} style={{ width: "100px" }}>
          <div
            className={
              filterFlag ? "modal cus-modal fade show" : "modal cus-modal fade"
            }
            id="GreetingnModal"
            tabIndex={-1}
            aria-labelledby="exampleModalLabel"
            style={filterFlag ? { display: "block" } : { display: "none" }}
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
                    <h4 className=" pt-2"> Filter Products</h4>
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={() => setFilterFlag(false)}
                  ></button>
                </div>
                <div className="modal-body cus-m-body gree-m-body pd-t0 pd0">
                  <div className="filter-container d-flex justify-content-between">
                    <div className=" w-50">
                      <label className=" mb-2">Category</label>
                      <br></br>
                      <Select
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        placeholder="select category"
                        style={{ width: "300px", height: "40px" }}
                        value={filterCategory}
                        onChange={onchangeFilterCategoryHandler}
                        renderValue={(selected) => selected.join(", ")}
                        MenuProps={MenuProps}
                      >
                        {categoryList.map((name) => (
                          <MenuItem key={name} value={name}>
                            <Checkbox
                              checked={filterCategory.indexOf(name) > -1}
                            />
                            <ListItemText primary={name} />
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                    <div className=" w-50 ">
                      <label className=" mb-2">Price</label>

                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={filterPrice}
                        onChange={(e) => {
                          console.log("filterprice, ", e.target.value);
                          setFilterPrice(e.target.value)
                        }}
                        style={{ width: "300px", height: "40px" }}
                        displayEmpty
                      >
                        <MenuItem value="" disabled>
                          Select Price Range
                        </MenuItem>
                        {priceArray.map((range) => (
                          <MenuItem key={range} value={range}>
                            {range}
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0">
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    data-bs-dismiss="modal"
                    onClick={() => {
                      setFilterCategory([]);
                      setFilterPrice("");
                    }}
                  >
                    Remove Filter
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    data-bs-dismiss="modal"
                    onClick={() => {
                      setFilterCategory([]);
                      setFilterPrice("");
                      setFilterFlag(false);
                    }}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => {
                      ProductFilterHandler();
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

export default CreateProduct;

