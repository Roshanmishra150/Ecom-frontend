import React, { useEffect, useState, useRef } from "react";
import Layout from "../../components/layout/Layout";
import AdminMenu from "../../components/layout/AdminMenu";
import { AutoComplete, Button, Select } from "antd";
import axios from "axios";
import { toast } from "react-hot-toast";
import "antd/dist/reset.css";
import { useLocation, useNavigate } from "react-router-dom";

const CreateEditProduct = () => {
  const [category, setCategory] = useState([]);
  const fileInputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState();
  const [datas, setData] = useState({
    category: "",
    photo: "",
    name: "",
    description: "",
    price: "",
    quantity: "",
    shipping: Boolean,
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState([
    {
      categoryError: "",
      photoError: "",
      nameError: "",
      descriptionError: "",
      priceError: "",
      quantityError: "",
      shippingError: "",
    },
  ]);
  const [productPhoto, setProductPhoto] = useState([]);
  const [editFlag, setEditFlag] = useState(false);

  const customStyles = {
    placeholder: {
      color: "red", // Change the color of the placeholder text
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
    left: "25%",
    width: "75%",
    padding: "20px",
    overflowY: "scroll",
  };

  
  const getAllCategory = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/category/category-list`
      );
      if (data.success) {
        setCategory(data.category);
      }
      setLoading(false);
    } catch (error) {
      toast.error("Something went wrong in getting categories");
    }
  };

  useEffect(() => {
    if (location.pathname === "/admin/edit-product") {
      setEditFlag(true);
    }
    getAllCategory();
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setData((prevData) => ({
      ...prevData,
      photo: file,
    }));
    const reader = new FileReader();

    if (file) {
      setErrorMessage((prevErrorMessage) => ({
        ...prevErrorMessage,
        photoError: "",
      }));
      reader.onloadend = () => {
        setProductPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setProductPhoto(""); // Reset selected image when no file is chosen
    }
  };

  console.log("productphoto", productPhoto);

  const onChangeDropdownHandler = (value, name) => {
    if (name == "category") {
      if (value !== "") {
        console.log("category e value", value);
        setData((prevData) => ({
          ...prevData,
          category: value,
        }));
        setErrorMessage((prevErrorMessage) => ({
          ...prevErrorMessage,
          categoryError: "",
        }));
      } else {
        setErrorMessage((prevErrorMessage) => ({
          ...prevErrorMessage,
          categoryError: "Category is required.",
        }));
        setData((prevData) => ({
          ...prevData,
          category: "",
        }));
      }
    }
    if (name == "shipping") {
      if (value !== "") {
        setData((prevData) => ({
          ...prevData,
          shipping: value,
        }));
        setErrorMessage((prevErrorMessage) => ({
          ...prevErrorMessage,
          shippingError: "",
        }));
      } else {
        setErrorMessage((prevErrorMessage) => ({
          ...prevErrorMessage,
          shippingError: "Shipping type is required.",
        }));
        setData((prevData) => ({
          ...prevData,
          shipping: "",
        }));
      }
    }
  };

  const onChangeDateHandler = (e) => {
    // const selectedValue = e.target.options[e.target.selectedIndex].value;
    // console.log("value", selectedValue);

    console.log("value", e);
    let { name, value } = e.target;
    switch (name) {
      case "name":
        if (value !== "") {
          setData((prevData) => ({
            ...prevData,
            name: value,
          }));
          setErrorMessage((prevErrorMessage) => ({
            ...prevErrorMessage,
            nameError: "",
          }));
        } else {
          setErrorMessage((prevErrorMessage) => ({
            ...prevErrorMessage,
            nameError: "Product Name is required.",
          }));
          setData((prevData) => ({
            ...prevData,
            name: "",
          }));
        }
        break;

      case "description":
        if (value !== "") {
          setData((prevData) => ({
            ...prevData,
            description: value,
          }));
          setErrorMessage((prevErrorMessage) => ({
            ...prevErrorMessage,
            descriptionError: "",
          }));
        } else {
          setErrorMessage((prevErrorMessage) => ({
            ...prevErrorMessage,
            descriptionError: "Product Description is required.",
          }));
          setData((prevData) => ({
            ...prevData,
            description: "",
          }));
        }
        break;
      case "price":
        if (value !== "") {
          setData((prevData) => ({
            ...prevData,
            price: value,
          }));
          setErrorMessage((prevErrorMessage) => ({
            ...prevErrorMessage,
            priceError: "",
          }));
        } else {
          setErrorMessage((prevErrorMessage) => ({
            ...prevErrorMessage,
            priceError: "Product Price is required.",
          }));
          setData((prevData) => ({
            ...prevData,
            price: "",
          }));
        }
        break;
      case "quantity":
        if (value !== "") {
          setData((prevData) => ({
            ...prevData,
            quantity: value,
          }));
          setErrorMessage((prevErrorMessage) => ({
            ...prevErrorMessage,
            quantityError: "",
          }));
        } else {
          setErrorMessage((prevErrorMessage) => ({
            ...prevErrorMessage,
            quantityError: "Product Quantity is required.",
          }));
          setData((prevData) => ({
            ...prevData,
            quantity: "",
          }));
        }
        break;

      default:
        break;
    }
  };

  const submitProductForm = async () => {
    // onChangeDateHandler()
    // onChangeDropdownHandler()
    // handleImageChange()
    console.log("error", errorMessage);
    if (datas.name === "") {
      setErrorMessage((prevErrorMessage) => ({
        ...prevErrorMessage,
        nameError: "Product Name is required.",
      }));
    }
    if (datas.description === "") {
      setErrorMessage((prevErrorMessage) => ({
        ...prevErrorMessage,
        descriptionError: "Product Description is required.",
      }));
    }
    if (datas.price === "") {
      setErrorMessage((prevErrorMessage) => ({
        ...prevErrorMessage,
        priceError: "Product price is required.",
      }));
    }
    if (datas.quantity === "") {
      setErrorMessage((prevErrorMessage) => ({
        ...prevErrorMessage,
        quantityError: "Product quantity is required.",
      }));
    }
    if (datas.shipping === "") {
      setErrorMessage((prevErrorMessage) => ({
        ...prevErrorMessage,
        shippingError: "Product shipping is required.",
      }));
    }
    // if(editFlag === false){

        if (datas.photo === "") {
          setErrorMessage((prevErrorMessage) => ({
            ...prevErrorMessage,
            photoError: "Product photo is required.",
          }));
        }
    // }else{
    //     if (datas.photo === "") {
    //         setErrorMessage((prevErrorMessage) => ({
    //           ...prevErrorMessage,
    //           photoError: "",
    //         }));
    //       }
    // }
    if (datas.category === "") {
      setErrorMessage((prevErrorMessage) => ({
        ...prevErrorMessage,
        categoryError: "Product category is required.",
      }));
    }
    console.log("datasave",errorMessage);
    if (
      errorMessage[0].nameError === "" &&
      errorMessage[0].descriptionError === "" &&
      errorMessage[0].priceError === "" &&
      errorMessage[0].quantityError === "" &&
      errorMessage[0].photoError === "" &&
      errorMessage[0].shippingError === "" &&
      errorMessage[0].categoryError === ""
    ) {
      console.log("mallll");
      try {
        setLoading(true);
        const productData = new FormData();
        console.log("data in is", datas, productPhoto);
        productData.append("name", datas.name);
        productData.append("description", datas.description);
        productData.append("price", datas.price);
        // productData.append("photo", editFlag === true ? productPhoto : datas.photo);
        productData.append("photo", datas.photo);
        productData.append("quantity", datas.quantity);
        productData.append("category",  datas.category);
        productData.append("shipping", datas.shipping == "No" ? false : true);
        console.log("productdata", productData, editFlag);

        if(editFlag === false){
            console.log("mmmmmmmmmm");
            const { data } = await axios.post(
                `${process.env.REACT_APP_API}/api/v1/product/create-product`,
                productData
            )

            if (data?.success) {
                toast.success(data.message);
                setData({
                  category: "",
                  photo: "",
                  name: "",
                  description: "",
                  price: "", 
                  quantity: "",
                  shipping: "",
                });
                setProductPhoto("");
      
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }
              navigate("/admin/manage-product");
              setLoading(false);
        } else{
            console.log("lllllllllll");
            const productId = sessionStorage.getItem("productId");

            const { data } = await axios.put(
              `${process.env.REACT_APP_API}/api/v1/product/update-product/${productId}`,
              productData
            );

            if (data?.success) {
                toast.success(data.message);
                setData({
                  category: "",
                  photo: "",
                  name: "",
                  description: "",
                  price: "",
                  quantity: "",
                  shipping: "",
                });
                setProductPhoto("");
      
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }
              navigate("/admin/manage-product");
              setLoading(false);
        }

        // if (data?.success) {
        //   toast.success(data.message);
        //   setData({
        //     category: "",
        //     photo: "",
        //     name: "",
        //     description: "",
        //     price: "",
        //     quantity: "",
        //     shipping: "",
        //   });
        //   setProductPhoto("");

        //   if (fileInputRef.current) {
        //     fileInputRef.current.value = "";
        //   }
        // }
        // navigate("/admin/manage-product");
        // setLoading(false);
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong while creating product");
      }
    }
  };

  console.log("data", datas);

  console.log("category", productPhoto);

  useEffect(() => {
    const fetchData = async () => {
      if (editFlag === true) {
        const slug = sessionStorage.getItem("slug");
        const productId = sessionStorage.getItem("productId");

        const { data } = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/product/get-single-product/${slug}`
        );

        // console.log("edit data", data);

        const getSingleProductCategory  = await axios.get(
            `${process.env.REACT_APP_API}/api/v1/category/single-category/${data?.product?.category}`
          );

          console.log("single category", getSingleProductCategory);
          

        setData({
          category: getSingleProductCategory?.data?.category?._id,
          // photo: `${process.env.REACT_APP_API}/api/v1/product/get-product-photo/${productId}`,
          name: data?.product?.name,
          description: data?.product?.description,
          price: data?.product?.price,
          quantity: data?.product?.quantity,
          shipping: data?.product?.shipping === true ? "yes" : "No",
        });
        setProductPhoto(`${process.env.REACT_APP_API}/api/v1/product/get-product-photo/${productId}`);
      }
    };
    fetchData();
  }, [editFlag]);

  console.log("photo.", productPhoto);
  return (
    <Layout title="create-product E-comm">
      <div style={containerStyle} className="container-fluid m-0 p-4">
        <div className="row">
          <div style={leftStyle} className="col-md-3">
            <AdminMenu />
          </div>
          <div style={rightStyle} className="col-md-9">
            <h3>Manage Products </h3>
            <form>
              <div className=" w-75 m-1">
                <label style={{ marginBottom: "4px" }}>
                  {" "}
                  Category{" "}
                  <span
                    style={{
                      color: "red",
                      marginRight: "3px",
                      fontSize: "20px",
                      paddingTop: "10px",
                    }}
                  >
                    *
                  </span>
                </label>
                <Select
                  bordered={false}
                  placeholder="Categories"
                  name="category"
                  dropdownStyle={customStyles}
                  size="large"
                  className="form-select mb-3"
                  // value={selectedCategory}
                  value={datas.category}
                  // onChange={(value) => setSelectedCategory(value)}
                  onChange={(value) => {
                    onChangeDropdownHandler(value, "category")                
                }}
                >
                  {category.map((item, index) => {
                    return (
                      <Select.Option key={item._id} value={item._id}>
                        {item.name}
                      </Select.Option>
                    );
                  })}
                </Select>
                {errorMessage.categoryError != "" ? (
                  <p style={{ color: "red" }}>{errorMessage.categoryError}</p>
                ) : (
                  ""
                )}
              </div>
              <div>
                <img
                  className="selected-image mb-3"
                  src={productPhoto}
                  alt="product_img"
                  style={{
                    height: "35vh",
                    width: "300px",
                    position: "relative",
                    top: 10,
                    left: "20%",
                  }}
                />
                {errorMessage.photoError != "" ? (
                  <p style={{ color: "red" }}>{errorMessage.photoError}</p>
                ) : (
                  ""
                )}
                <br></br>
                <input
                  type="file"
                  ref={fileInputRef}
                  name="photo"
                  accept="image/*"
                  // value={data.photo}
                  onChange={handleImageChange}
                  className="input-file w-75"
                  style={{ display: "none" }}
                  id="fileInput"
                />
                <label
                  htmlFor="fileInput"
                  className="input-file"
                  style={{ position: "relative", top: 10, left: "20%" }}
                >
                  
                  {(productPhoto?.length === 0 || editFlag===false) ? "Choose Image" : "Change Image"}
                </label>
              </div>
              <br></br>
              <div className="inputFields">
                <label style={{ marginBottom: "4px" }}>
                  Product Name{" "}
                  <span
                    style={{
                      color: "red",
                      marginRight: "3px",
                      fontSize: "20px",
                      paddingTop: "10px",
                    }}
                  >
                    *
                  </span>{" "}
                </label>
                <input
                  type="text"
                  name="name"
                  className="form-control "
                  placeholder=" name"
                  value={datas.name}
                  onChange={onChangeDateHandler}
                  required
                />
                {errorMessage.nameError != "" ? (
                  <p style={{ color: "red" }}>{errorMessage.nameError}</p>
                ) : (
                  ""
                )}
                <br></br>
                <label style={{ marginBottom: "4px" }}>
                  Product Descriptions{" "}
                  <span
                    style={{
                      color: "red",
                      marginRight: "3px",
                      fontSize: "20px",
                      paddingTop: "10px",
                    }}
                  >
                    *
                  </span>
                </label>
                <textarea
                  rows="3"
                  name="description"
                  className="form-control "
                  type="text"
                  placeholder=" Descriptions"
                  value={datas.description}
                  onChange={onChangeDateHandler}
                />
                {errorMessage.descriptionError != "" ? (
                  <p style={{ color: "red" }}>
                    {errorMessage.descriptionError}
                  </p>
                ) : (
                  ""
                )}
                <br></br>
                <label style={{ marginBottom: "4px" }}>
                  Product Price{" "}
                  <span
                    style={{
                      color: "red",
                      marginRight: "3px",
                      fontSize: "20px",
                      paddingTop: "10px",
                    }}
                  >
                    *
                  </span>
                </label>
                <input
                  type="number"
                  name="price"
                  className="form-control "
                  value={datas.price}
                  onKeyDown={(evt) =>
                    ["e", "E", "+", "-"].includes(evt.key) &&
                    evt.preventDefault()
                  }
                  placeholder=" Price"
                  onChange={onChangeDateHandler}
                />
                {errorMessage.priceError != "" ? (
                  <p style={{ color: "red" }}>{errorMessage.priceError}</p>
                ) : (
                  ""
                )}
                <br></br>
                <label style={{ marginBottom: "4px" }}>
                  Product Quantity{" "}
                  <span
                    style={{
                      color: "red",
                      marginRight: "3px",
                      fontSize: "20px",
                      paddingTop: "10px",
                    }}
                  >
                    *
                  </span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  className="form-control "
                  value={datas.quantity}
                  onKeyDown={(evt) =>
                    ["e", "E", "+", "-"].includes(evt.key) &&
                    evt.preventDefault()
                  }
                  placeholder=" Quantity"
                  onChange={onChangeDateHandler}
                />
                {errorMessage.quantityError != "" ? (
                  <p style={{ color: "red" }}>{errorMessage.quantityError}</p>
                ) : (
                  ""
                )}
              </div>
              <br></br>
              <div className=" w-75 m-1">
                <label style={{ marginBottom: "4px" }}>
                  {" "}
                  Shipping{" "}
                  <span
                    style={{
                      color: "red",
                      marginRight: "3px",
                      fontSize: "20px",
                      paddingTop: "10px",
                    }}
                  >
                    *
                  </span>
                </label>
                <Select
                  bordered={false}
                  name="shipping"
                  placeholder="shipping type"
                  size="large"
                  className="form-select mb-3"
                  value={datas.shipping } 
                  // onChange={onChangeDateHandler}
                  onChange={(e) => onChangeDropdownHandler(e, "shipping")}
                >
                  <Select.Option value={true}>Yes</Select.Option>
                  <Select.Option value={false}>No</Select.Option>
                </Select>
                {errorMessage.shippingError != "" ? (
                  <p style={{ color: "red" }}>{errorMessage.shippingError}</p>
                ) : (
                  ""
                )}
              </div>
              <Button type="primary" onClick={submitProductForm}>
                {editFlag?"Update Product":"Add Product"} 
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateEditProduct;
