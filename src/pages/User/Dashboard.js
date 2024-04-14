import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import AdminMenu from "../../components/layout/AdminMenu";
import axios from "axios";
import { toast } from "react-hot-toast";
import "antd/dist/reset.css";
import { useNavigate } from "react-router-dom";
import { MdDeleteForever } from "react-icons/md";
import { FiEdit2 } from "react-icons/fi";

import { BsPersonFill } from "react-icons/bs";
import { HiShoppingBag } from "react-icons/hi";
import { GiBilledCap } from "react-icons/gi";
import { CgPerformance } from "react-icons/cg";
import { Modal } from "@mui/material";

import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";

import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import StarIcon from "@mui/icons-material/Star";
import UsersMenu from "./UsersMenu";
import { useAuth } from "../../context/AuthContext";


// import { PowerBIEmbed } from "powerbi-client-react";
// import { models } from "powerbi-client";

const CreateProduct = () => {
  const [loading, setLoading] = useState(false);
  const [filterFlag, setFilterFlag] = useState(false);
  const [totalProduct, setTotalProduct] = useState(0);
  const [filterCategory, setFilterCategory] = useState([]);
  const [filterPrice, setFilterPrice] = useState([]);
  const [productLists, setProductLists] = useState([]);
  const [tempProductList, setTempProductList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [allCategory, setAllCategory] = useState([]);
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  const [value, setValue] = React.useState(2);
  const [hover, setHover] = React.useState(-1);




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
    // height:"100vh",
    left: auth?.toggle ? "220px" : "50px",
    width: auth?.toggle ? "85.4%"  : "96.6%",
    padding: "20px",
    overflowY: "scroll",
  };

  const poweBiStyle = {
    height:"80%"
  }

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
    getProductLists();
    getAllCategory();
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

    if (filterCategory != "") {
      // filterCategory.map((item) => {
      //   allCategory?.map((item, index) => {
      //     filterCategory?.map((f) => {
      //       if (item.name === f) {
      //         categoryIds.push(item._id);
      //       }
      //     });
      //   });
      // });

      allCategory.map((item, index) => {
        filterCategory.map((name, index) => {
          if (item.name === name) {
            categoryIds.push(item._id);
          }
        });
      });

      
      try {
        setLoading(true);
        const {
          data,
        } = await axios.post(
          `${process.env.REACT_APP_API}/api/v1/product/filter-products`,
          { categoryIds }
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
    }
    if (filterPrice != "") {
      const filteredProducts = tempProductList.filter((product) => {
        const price = product.price;
        if (filterPrice === "above") {
          return price > 30000;
        }
        if (filterPrice === "All") {
          getProductLists();
        } else {
          const [min, max] = filterPrice.split("-").map(Number);
          return price >= min && price <= max;
        }
      });
      setProductLists(filteredProducts);
      setFilterFlag(false);
    } else {
      getProductLists();
      setFilterFlag(false);
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



  console.log("auth?.token",auth?.token);

  return (
    <Layout title="create-product admin">
      <div style={containerStyle} className="container-fluid m-0 p-4">
        <div className="row ">
          <div style={leftStyle} className="col-md-3 ">
            <UsersMenu />
          </div>

          <style>{lightScrollbarCSS}</style>
          <div style={rightStyle} className="col-md-9 ">
            





            
          {/* <PowerBIEmbed
            embedConfig={{
            type: "report",
              id: "53986f37-c95e-44ca-b7d5-ae4ac3a170ae",
              embedUrl: "https://app.powerbi.com/reportEmbed?reportId=53986f37-c95e-44ca-b7d5-ae4ac3a170ae&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVNPVVRILUVBU1QtQVNJQS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldCIsImVtYmVkRmVhdHVyZXMiOnsidXNhZ2VNZXRyaWNzVk5leHQiOnRydWUsImRpc2FibGVBbmd1bGFySlNCb290c3RyYXBSZXBvcnRFbWJlZCI6dHJ1ZX19",
              // accessToken:"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjVCM25SeHRRN2ppOGVORGMzRnkwNUtmOTdaRSIsImtpZCI6IjVCM25SeHRRN2ppOGVORGMzRnkwNUtmOTdaRSJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvNDQ3MzgzNDMtYTM2NC00ZDUwLWFlNDItMmFiOWIwNzI0YjRkLyIsImlhdCI6MTcwNTE1NjE5NSwibmJmIjoxNzA1MTU2MTk1LCJleHAiOjE3MDUxNjAzMzAsImFjY3QiOjAsImFjciI6IjEiLCJhaW8iOiJBVlFBcS84VkFBQUEwS0dUdG9ZUlNQc2ttbisyWkZ1ckdsSlFRVzJlcFY5WWlrQ3RmMk1yM1lBeWVQbmpubk1kWXQ2STMxZzI1My85NmdjekRPY1V0L1dGMnJuZ3pJSDA0SG9FMWF5OGkyT2o5ZUx6MUd3Mi9sTT0iLCJhbXIiOlsicHdkIiwibWZhIl0sImFwcGlkIjoiODcxYzAxMGYtNWU2MS00ZmIxLTgzYWMtOTg2MTBhN2U5MTEwIiwiYXBwaWRhY3IiOiIwIiwiZmFtaWx5X25hbWUiOiJNaXNocmEiLCJnaXZlbl9uYW1lIjoiUm9zaGFuIiwiaXBhZGRyIjoiMTM2LjIyNi4yNTQuMTc0IiwibmFtZSI6IlJvc2hhbiBNaXNocmEiLCJvaWQiOiJkNmU3ZDYyOC03YjYwLTRiYjktYTZlOS1jMTE0YjFlOGM5MWEiLCJwdWlkIjoiMTAwMzIwMDIwQ0Y4MzFCRiIsInJoIjoiMC5BVlFBUTROelJHU2pVRTJ1UWlxNXNISkxUUWtBQUFBQUFBQUF3QUFBQUFBQUFBQlVBUEEuIiwic2NwIjoidXNlcl9pbXBlcnNvbmF0aW9uIiwic2lnbmluX3N0YXRlIjpbImttc2kiXSwic3ViIjoiWElZa0hHTi1jQ1prak8zd3NvbHluNktnMlduR2twMVg4cjhTTUJXLWVmMCIsInRpZCI6IjQ0NzM4MzQzLWEzNjQtNGQ1MC1hZTQyLTJhYjliMDcyNGI0ZCIsInVuaXF1ZV9uYW1lIjoiUm9zaGFuTUB3aW5qaXQuY29tIiwidXBuIjoiUm9zaGFuTUB3aW5qaXQuY29tIiwidXRpIjoiZTB0cVJhZG96RWFXSGFzb0FNT0JBQSIsInZlciI6IjEuMCIsIndpZHMiOlsiYjc5ZmJmNGQtM2VmOS00Njg5LTgxNDMtNzZiMTk0ZTg1NTA5Il19.gTUUDHkoW2xbAjs9L1W-KdjDLbWNqX36zRGVYngqOGkoQaKanmOj_4qs4S_emzzFpbcuUtBIr5T8Tro77cJ0j97G_71IwG72wgBmFhkVbqzAvbGHYG7egpDefRNcsZlIzsAZ7mmdYuxUJYRYaFzRfN6t8jTY-8r63oWChkuVripxk8ZbGMEPpI0jiFMR-leQf0GjJ3hROL7tHjz9ZCpwfe24MnnV81XN3LimzCaa_lX3tBiCIoJinhMkiep-xNct5R7FS93ECy569R-uGTt12NoL2y4k584ymH8MyOVf2_qSQdlpHmz7N42k1t3XEQf9OlHX_iK3fG0ThVqgdIBkSg",
                accessToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjVCM25SeHRRN2ppOGVORGMzRnkwNUtmOTdaRSIsImtpZCI6IjVCM25SeHRRN2ppOGVORGMzRnkwNUtmOTdaRSJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvNDQ3MzgzNDMtYTM2NC00ZDUwLWFlNDItMmFiOWIwNzI0YjRkLyIsImlhdCI6MTcwNTM0MjU0MiwibmJmIjoxNzA1MzQyNTQyLCJleHAiOjE3MDUzNDcwNDAsImFjY3QiOjAsImFjciI6IjEiLCJhaW8iOiJBVlFBcS84VkFBQUFmK0pFbzhsMTIrVElpZnFPYU94SGFOSVZnRnZ3M09tV3k4dUxrK2NTbjFjbWVUS2hKWHVsclBuRnRkS3ZZeWxaRi9yK3VESUxMWEZPekFId2pqK3lsWndQczRseU1BR2hYb0NVTi9EejMwOD0iLCJhbXIiOlsicHdkIiwibWZhIl0sImFwcGlkIjoiODcxYzAxMGYtNWU2MS00ZmIxLTgzYWMtOTg2MTBhN2U5MTEwIiwiYXBwaWRhY3IiOiIwIiwiZmFtaWx5X25hbWUiOiJNaXNocmEiLCJnaXZlbl9uYW1lIjoiUm9zaGFuIiwiaXBhZGRyIjoiMTM2LjIyNi4yNTQuMTc1IiwibmFtZSI6IlJvc2hhbiBNaXNocmEiLCJvaWQiOiJkNmU3ZDYyOC03YjYwLTRiYjktYTZlOS1jMTE0YjFlOGM5MWEiLCJwdWlkIjoiMTAwMzIwMDIwQ0Y4MzFCRiIsInJoIjoiMC5BVlFBUTROelJHU2pVRTJ1UWlxNXNISkxUUWtBQUFBQUFBQUF3QUFBQUFBQUFBQlVBUEEuIiwic2NwIjoidXNlcl9pbXBlcnNvbmF0aW9uIiwic2lnbmluX3N0YXRlIjpbImttc2kiXSwic3ViIjoiWElZa0hHTi1jQ1prak8zd3NvbHluNktnMlduR2twMVg4cjhTTUJXLWVmMCIsInRpZCI6IjQ0NzM4MzQzLWEzNjQtNGQ1MC1hZTQyLTJhYjliMDcyNGI0ZCIsInVuaXF1ZV9uYW1lIjoiUm9zaGFuTUB3aW5qaXQuY29tIiwidXBuIjoiUm9zaGFuTUB3aW5qaXQuY29tIiwidXRpIjoiMVVxYjBNa09WVUdYUDJ5VU1YN1VBQSIsInZlciI6IjEuMCIsIndpZHMiOlsiYjc5ZmJmNGQtM2VmOS00Njg5LTgxNDMtNzZiMTk0ZTg1NTA5Il19.P8QvEkuKoxtRNjlodDcx3SwQIGZiyqdOfgRNmW1g06KSiMl3F_goNn2atjaKKz96rAoeatjm-R2Evt_1cCqmsRu_67LHRjAbJhiztLUaUbTdrSE_Q8KpOlHZN9LMejRZL56yX1rCk84aGy00U8Z2uVTGjDnxYY1aYBxr-XHi7PXcGkEe3z1bt8qL-RMEJjMP7P1lOP7XOWVCBxfeNRs_Wzx4l46quzecuTdMG49_sBqRjdeP-6MlNO8Ci0uRFnMjIjurBWpgi1fp3Y_6JKarmDAmnJJ9XGcQAWLwfApLfRgx37gy3Mr6_stTc7sg6j8-sa3HzlJ7LvPteZDBFzBffA",
                  tokenType: models.TokenType.Aad, 
              settings: {
                panes: {
                  filters: {
                    expanded: false,
                    visible: false,
                  },
                },
                background: models.BackgroundType.Transparent,
              },
            }}
            eventHandlers={
              new Map([
                [
                  "loaded",
                  function () {
                    console.log("Report loaded");
                  },
                ],
                [
                  "rendered",
                  function () {
                    console.log("Report rendered");
                  },
                ],
                [
                  "error",
                  function (event) {
                    console.log(event.detail);
                  },
                ],
                ["visualClicked", () => console.log("visual clicked")],
                ["pageChanged", (event) => console.log(event)],
              ])
            }
              cssClassName={"report-style-class"}
            getEmbeddedComponent={(embeddedReport) => {
              window.report = embeddedReport;
            }}
          /> */}

















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
                        onChange={(e) => setFilterPrice(e.target.value)}
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
                      setFilterPrice([]);
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
                      setFilterPrice([]);
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
