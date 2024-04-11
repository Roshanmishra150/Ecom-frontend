import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import AdminMenu from "../../components/layout/AdminMenu";
import axios from "axios";
import { toast } from "react-hot-toast";
import "antd/dist/reset.css";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { BsPersonFill } from "react-icons/bs";
import { HiShoppingBag } from "react-icons/hi";
import { GiBilledCap } from "react-icons/gi";
import { CgPerformance } from "react-icons/cg";
import { Modal } from "@mui/material";
import { styled } from "@mui/material/styles";

import MenuItem from "@mui/material/MenuItem";
import { HiMiniViewColumns } from "react-icons/hi2";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";

import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import StarIcon from "@mui/icons-material/Star";
import { DataGrid } from "@mui/x-data-grid";
import { useAuth } from "../../context/AuthContext";
import { Tooltip } from "antd";

const CreateProduct = () => {
  const [loading, setLoading] = useState(false);
  const [filterFlag, setFilterFlag] = useState(false);
  const [totalProduct, setTotalProduct] = useState(0);
  const [filterCategory, setFilterCategory] = useState([]);
  const [filterPrice, setFilterPrice] = useState();
  const [filterQuantityValue, setFilterQuantityValue] = useState();
  const [filterQuantityError, setFilterQuantityError] = useState("");
  const [filterQuantityOperator, setFilterQuantityOperator] = useState("");
  const [filterRating, setFilterRating] = useState(0);
  const [productLists, setProductLists] = useState([]);
  const [tempProductList, setTempProductList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [allCategory, setAllCategory] = useState([]);
  const [totalUser, setTotalUser] = useState("");
  const [auth, setAuth] = useAuth("");
  const navigate = useNavigate();
  const [showEmptyContent, setShowEmptyContent] = useState(
    "{showEmptyContent}."
  );

  const priceArray = ["All", "0-10000", "10001-20000", "20001-30000", "above"];
  const quantityArray = ["equal to", "greater than", "Less than"];

  const StyledGridOverlay = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    "& .ant-empty-img-1": {
      fill: theme.palette.mode === "light" ? "#aeb8c2" : "#262626",
    },
    "& .ant-empty-img-2": {
      fill: theme.palette.mode === "light" ? "#f5f5f7" : "#595959",
    },
    "& .ant-empty-img-3": {
      fill: theme.palette.mode === "light" ? "#dce0e6" : "#434343",
    },
    "& .ant-empty-img-4": {
      fill: theme.palette.mode === "light" ? "#fff" : "#1c1c1c",
    },
    "& .ant-empty-img-5": {
      fillOpacity: theme.palette.mode === "light" ? "0.8" : "0.08",
      fill: theme.palette.mode === "light" ? "#f5f5f5" : "#fff",
    },
  }));

  function CustomNoRowsOverlay() {
    return (
      <StyledGridOverlay>
        <svg
          width="120"
          height="100"
          viewBox="0 0 184 152"
          aria-hidden
          focusable="false"
        >
          <g fill="none" fillRule="evenodd">
            <g transform="translate(24 31.67)">
              <ellipse
                className="ant-empty-img-5"
                cx="67.797"
                cy="106.89"
                rx="67.797"
                ry="12.668"
              />
              <path
                className="ant-empty-img-1"
                d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
              />
              <path
                className="ant-empty-img-2"
                d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
              />
              <path
                className="ant-empty-img-3"
                d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
              />
            </g>
            <path
              className="ant-empty-img-3"
              d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
            />
            <g className="ant-empty-img-4" transform="translate(149.65 15.383)">
              <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
              <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
            </g>
          </g>
        </svg>
        <Box sx={{ mt: 1 }}>{showEmptyContent}</Box>
      </StyledGridOverlay>
    );
  }

  const columns = [
    { field: "row", headerName: "Sr. No", width: 60, align: "left" },
    {
      field: "_id",
      headerName: "Product Image",
      width: 130,
      align: "left",
      renderCell: (params) => (
        <div style={{ display: "flex", alignItems: "left" }}>
          <img
            src={`${process.env.REACT_APP_API}/api/v1/product/get-product-photo/${params.row.id}`}
            alt={`Product ${params.row.id}`}
            style={{
              width: "50px",
              height: "50px",
              objectFit: "cover",
              padding: "8px 0px",
            }}
          />
        </div>
      ),
    },
    {
      field: "name",
      headerName: "Product Name",
      width: 130,
      align: "left",
      filterable: true,
      filterOperators: ["Equal", "Greater", "Lower"],
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      align: "left",
      renderCell: (params) => (
        <div>
          <EditIcon
            style={{ cursor: "pointer", marginRight: "10px", color: "#297FFD" }}
            onClick={() => {
              sessionStorage.setItem("productId", params.row.id);
              sessionStorage.setItem("slug", params.row.slug);
              navigate("/admin/edit-product");
            }} // Replace with your edit logic
          />
          <DeleteIcon
            style={{ cursor: "pointer", marginRight: "10px", color: "#DC3545" }}
            onClick={() => handelDelete(params.row)} // Replace with your delete logic
          />
          <VisibilityIcon
            style={{ cursor: "pointer", color: "drakgray" }}
            onClick={() => {
              sessionStorage.setItem("productId", params.row.id);
              sessionStorage.setItem("slug", params.row.slug);
              navigate("/admin/view-product");
            }} // Replace with your view logic
          />
        </div>
      ),
    },
    {
      field: "category",
      headerName: "Category",
      width: 130,
      align: "left",
      renderCell: (params) => (
        <div>
          {console.log("category admin", params)}
          {params.row.category?.length > 0 ? (
            params.row.category[0].name
            ) : (params?.row?.category?.name) ? 
              params?.row?.category?.name
            :
            (
            <span>NA</span>
          )}
        </div>
      ),
    },
    {
      field: "description",
      headerName: "Description",
      width: 150,
      align: "left",
      margin: "40px",
    },
    {
      field: "price",
      headerName: "Price",
      width: 110,

      align: "left",
    },
    {
      field: "quantity",
      headerName: "Quantity",
      width: 90,
      alignItems: "center",
      align: "left",
    },

    {
      field: "averageRating",
      headerName: "Ratings",
      width: 150,
      // flex: 1,
      align: "left",
      renderCell: (params) => (
        <div style={{ display: "flex", alignItems: "left" }}>
          {console.log("valuerating", params)}
          <Rating
            name={`rating-${params.row.id}`}
            value={params.row.averageRating}
            precision={0.5}
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
        </div>
      ),
    },
    {
      field: "createdAt",
      headerName: "Date Onboarded",
      width: 150,

      valueFormatter: (params) => {
        const date = new Date(params.value);
        const formattedDate = date.toISOString().split("T")[0]; // Adjust formatting as needed
        return formattedDate;
      },
      align: "left",
    },
    {
      field: "updatedAt",
      headerName: "Updated On",
      width: 140,

      valueFormatter: (params) => {
        const date = new Date(params.value);
        const formattedDate = date.toISOString().split("T")[0]; // Adjust formatting as needed
        return formattedDate;
      },
      align: "left",
    },
  ];

  const [visibleColumns, setVisibleColumns] = useState(
    columns.map((column) => column.field)
  );

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
    width: "25%",
    padding: "20px",
    overflow: "hidden",
  };

  const rightStyle = {
    position: "fixed",
    top: "50px",
    bottom: 0,
    left: auth?.toggle ? "240px" : "70px",
    width: auth?.toggle ? "85.4%"  : "96.6%",
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
      setShowEmptyContent("Loading Data...");
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
    getUserList()
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

  const onchangeFilterHandler = (event) => {
    const { value, name } = event.target;
    if (value !== "" && name == "category") {
      // setFilterCategory(typeof value === "string" ? value.split(",") : value);
      setFilterCategory(value);
    } else if (name == "quantityValue") {
      setFilterQuantityValue(value);
      if (filterQuantityOperator == "") {
        setFilterQuantityError("Select operator ");
      } else if (value == "") {
        setFilterQuantityError("Enter quantity value");
      } else {
        setFilterQuantityError("");
      }
    } else if (name == "quantityOperator") {
      setFilterQuantityOperator(value);
      if (filterQuantityValue == "") {
        setFilterQuantityError("Enter Quantity value");
      } else {
        setFilterQuantityError("");
      }
    } else if (value !== "" && name == "price") {
      setFilterPrice(value);
    } else if (value !== "" && name == "rating") {
      setFilterRating(value);
    } else {
    }
  };

  const ProductFilterHandler = async () => {
    let categoryIds = [];

    if (
      filterCategory != "" ||
      filterPrice != "" ||
      filterQuantityOperator != "" ||
      filterQuantityValue != "" ||
      filterRating != ""
    ) {
      allCategory.map((item, index) => {
        filterCategory.map((name, index) => {
          if (item.name === name) {
            categoryIds.push(item._id);
          }
        });
      });

      try {
        setLoading(true);
        const { data } = await axios.post(
          `${process.env.REACT_APP_API}/api/v1/product/filter-products`,
          {
            categoryIds,
            filterPrice,
            filterQuantityValue,
            filterQuantityOperator,
            filterRating,
          }
        );
        if (data?.success) {
          setProductLists(data.products);
        }
        setFilterFlag(false);
        setLoading(false);
      } catch (error) {
        toast.error("Something went wrong while filtering product ");
        setFilterFlag(false);
      }
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

  console.log(productLists);
  const userListWithId = productLists.map((user, index) => ({
    ...user,
    id: user._id,
    row: index + 1,
  }));

  const handleColumnToggle = (columnName) => {
    if (visibleColumns.includes(columnName)) {
      setVisibleColumns(visibleColumns.filter((col) => col !== columnName));
    } else {
      setVisibleColumns([...visibleColumns, columnName]);
    }
  };
  const getUserList = async () => {
    const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/auth/users`
    );

    console.log("users", data);

  if (data?.success) {
    const userIdToRemove = auth?.user?._id; // Replace with the ID of the user you want to remove
    const filteredUsers = data?.users.filter(user => user._id !== userIdToRemove);
            // setUserList(filteredUsers);
        setTotalUser(filteredUsers?.length);
    } else {
        toast("fail to fetch user's list");
    }
};

  return (
    <Layout title="create-product admin">
      <div style={containerStyle} className="container-fluid m-0 p-4">
        <div className="row ">
          <div style={leftStyle} className="col-md-3 ">
            <AdminMenu />
          </div>
          <style>{lightScrollbarCSS}</style>
          <div style={rightStyle} className="col-md-9 ">
            <div className=" d-flex justify-content-between">
              <h3>Manage Products</h3>
              <button
                class="btn btn-primary h-25"
                type="button"
                onClick={() => {
                  navigate("/admin/create-product");
                }}
              >
                + Create New Product
              </button>
            </div>

            {/* <div className="row">
              <div className="col-md-3 col-sm-6 ">
                <div className="content-box">
                  <div className="box-para">
                    {totalUser}
                  </div>
                  <div className="box-icon">
                    <BsPersonFill />
                  </div>
                </div>
                <p style={{ backgroundColor: "lightgray", fontSize: "larger", color: "gray", marginLeft: "-10px", width: "100%", border: "none", paddingLeft: "13px", paddingBottom: "8px" }}>Total Users</p>

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
                <p style={{ backgroundColor: "lightgray", fontSize: "larger", color: "gray", marginLeft: "-10px", width: "100%", border: "none", paddingLeft: "13px", paddingBottom: "8px" }}>Total Orders </p>

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
              style={{ border: "1px solid #0000", margin: "10px 0px" }}
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
                  {filterCategory != "" ||
                  filterPrice !== undefined ||
                  filterQuantityOperator != "" ||
                  filterQuantityValue !== undefined ||
                  filterRating != ""
                    ? "Update Filter"
                    : "Apply Filter"}
                </button>

                <div class="dropdown">
                  <button
                    class="btn btn-secondary dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ marginRight: "20px" }}
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
                  {/* <Tooltip title="Manage Columns" > */}
                <div class="dropdown">
                  <button
                    class="btn btn-secondary dropdown-toggle"
                    type="button"
                    // style={{backgroundColor:"#062133"}}
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Manage Columns
                    {/* <HiMiniViewColumns /> */}
                  </button>

                  <ul
                    class="dropdown-menu"
                    style={{ height: "45vh", overflow: "auto" }}
                  >
                    {columns.map((column) => (
                      <MenuItem
                        key={column.field}
                        style={{ display: "flex", alignItems: "center" }}
                        value={column.field}
                        onClick={() => handleColumnToggle(column.field)}
                      >
                        <Checkbox
                          checked={visibleColumns.indexOf(column.field) > -1}
                        />
                        <ListItemText primary={column.field} />
                      </MenuItem>
                    ))}
                  </ul>
                </div>
                {/* </Tooltip> */}

              </div>
            </div>

            {
              productLists.length > 0 ? (
              
            <div style={{ height: "auto", width: "100%", overflowX: "auto" }}>
              <DataGrid
                rows={userListWithId}
                rowHeight={45}
                columns={columns.filter((column) =>
                  visibleColumns.includes(column.field)
                )}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 7 },
                  },
                }}
                pageSizeOptions={[7, 50, 100]}
                disableDensitySelector
                disableColumnMenu
                slots={{
                  noRowsOverlay: CustomNoRowsOverlay,
                }}
              ></DataGrid>
            </div>
              ):(<>
                <div className="loader"></div>
                <p className="loadingPara">Loading...</p>
              </>)
            }

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
                      <label className=" mb-1">Category</label>
                      <br></br>
                      <Select
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        name="category"
                        placeholder="select category"
                        style={{ width: "300px", height: "40px" }}
                        value={filterCategory}
                        onChange={onchangeFilterHandler}
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
                      <label className=" mb-1">Price</label>

                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name="price"
                        value={filterPrice}
                        onChange={(e) => onchangeFilterHandler(e)}
                        style={{ width: "300px", height: "40px" }}
                        displayEmpty
                      >
                        {priceArray.map((range) => (
                          <MenuItem key={range} value={range}>
                            {range}
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                  </div>

                  <div className="filter-container d-flex justify-content-between mt-4">
                    <div className=" w-50 ">
                      <label className=" mb-1">Quantity</label>
                      <br></br>
                      <div className=" d-flex">
                        <Select
                          labelId="demo-multiple-checkbox-label"
                          id="demo-multiple-checkbox"
                          style={{ width: "170px", height: "40px" }}
                          displayEmpty
                          name="quantityOperator"
                          value={filterQuantityOperator}
                          onChange={(e) => onchangeFilterHandler(e)}
                        >
                          {quantityArray.map((range) => (
                            <MenuItem key={range} value={range}>
                              {range}
                            </MenuItem>
                          ))}
                        </Select>
                        <input
                          type="text"
                          name="quantityValue"
                          className="form-control "
                          style={{ marginLeft: "15px", width: "100px" }}
                          value={filterQuantityValue}
                          onChange={(e) => onchangeFilterHandler(e)}
                        />
                      </div>
                      {filterQuantityError}
                    </div>
                    <div className=" w-50 ">
                      <label className=" mb-1">Rating</label>
                      <br></br>

                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={filterRating}
                        name="rating"
                        onChange={(e) => onchangeFilterHandler(e)}
                        style={{ width: "300px", height: "40px" }}
                        displayEmpty
                      >
                        <MenuItem value="" disabled>
                          Select Price Range
                        </MenuItem>
                        {[0, 1, 2, 3, 4, 5].map((range) => (
                          <MenuItem key={range} value={range}>
                            <Rating
                              name={`rating-${range}`}
                              value={range}
                              precision={0.5}
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
                      setFilterQuantityOperator("");
                      setFilterQuantityValue("");
                      setFilterRating("");
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
                      setFilterQuantityOperator("");
                      setFilterQuantityValue("");
                      setFilterRating("");
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
