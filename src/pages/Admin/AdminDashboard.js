import React, { useEffect, useRef, useState } from "react";
import Layout from "../../components/layout/Layout";
import AdminMenu from "../../components/layout/AdminMenu";
import { useAuth } from "../../context/AuthContext";


import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { FaJediOrder } from "react-icons/fa";
import { FaSellcast } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";
import { FaSackDollar } from "react-icons/fa6";
import { GrDocumentPerformance } from "react-icons/gr";
import Chart from 'chart.js/auto';
import axios from "axios";
import toast from "react-hot-toast";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "antd";



const Orders = () => {
  const [auth, setAuth] = useAuth()
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [dashboardDatas, setDashboardDatas] = useState([]);
  const [productMonthlyLength, setProductMonthlyLength] = useState([]);
  const [productsOrders, setProductsOrders] = useState([]);
  const [dataAvaliable, setDataAvaliable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoryListData, setCategoryListData] = useState([]);
  const [categoryCountPerProduct, setCategoryCountPerProduct] = useState([]);
  const [categoryNames, setCategoryNames] = useState([]);
  const [totalSale, setTotalSale] = useState(0);
  const [totalUser, setTotalUser] = useState(0);
  const [analytics, setAnalytics] = useState("");
  const [productMonths, setProductMonths] = useState([]);
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
    width: "20%",
    padding: "20px",
    overflow: "hidden",
  };

  const rightStyle = {
    position: "fixed",
    top: "50px",
    bottom: 0,
    left: auth?.toggle ? "233px" : "64px",
    width: auth?.toggle ? "85.4%" : "96.6%",
    padding: "20px",
    overflowY: "scroll",
    backgroundColor: "#F5F7F9"
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


  const chartRef1 = useRef(null);
  const chartRef2 = useRef(null);
  const chartRef3 = useRef(null);


  let chartInstance1 = null;
  let chartInstance2 = null;
  let chartInstance3 = null;

  useEffect(() => {
    getDashboardRecord();
    getUserList()
  }, [selectedYear]); // Fetch data when selected year changes

  useEffect(() => {
    productsOrders?.map((item, inde) => {
      categoryListData?.map((i, ind) => {
        if (item?.category == i?._id) {

          const index = categoryListData.findIndex(ite => ite._id == item?.category);
          const itemAtIndex = categoryCountPerProduct[index]
          const itemAtIndexplus = itemAtIndex + 1
          categoryCountPerProduct[index] = itemAtIndexplus
          // categoryCountPerProduct.splice(index, 0, itemAtIndexplus);
          console.log("categ", categoryCountPerProduct);
          setCategoryCountPerProduct(categoryCountPerProduct)
        }
      })
    })
  }, [categoryListData, productsOrders])

  useEffect(() => {
    if (dashboardDatas) {
      // Update bar chart
      if (chartRef1.current) {
        const ctx = chartRef1.current.getContext('2d');
        const lineChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: productMonths,
            datasets: [{
              label: 'Sales Analytics Per Month',
              data: dashboardDatas?.totalCosts,
              backgroundColor: '#7FBDA8',
              borderColor: '#7FBDA8',
              borderWidth: 2,
              tension: 0.4
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: false
              }
            }
          }
        });
        return () => lineChart.destroy(); // Cleanup function to destroy the chart
      }
    }
  }, [dashboardDatas]); // Re-render line chart when dashboard data changes

  useEffect(() => {
    // Create pie chart
    if (chartRef2.current) {
      const ctx = chartRef2.current.getContext('2d');
      const pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: categoryNames,
          datasets: [{
            label: 'Product Distribution',
            data: categoryCountPerProduct,
            backgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#8A2BE2',
              '#00FFFF',
              '#FF69B4',
              '#FFD700',
            ],
            hoverBackgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#8A2BE2',
              '#00FFFF',
              '#FF69B4',
              '#FFD700',
            ],
          }],
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: 'Product Distribution by Category',
            },
          },
        },
      });
      return () => pieChart.destroy(); // Cleanup function to destroy the chart
    }
  }, [categoryCountPerProduct, categoryNames]); // Create pie chart only once
  console.log("productMonthlyLength", productMonthlyLength);
  useEffect(() => {
    // Create line chart
    if (chartRef3.current) {
      const ctx = chartRef3.current.getContext('2d');
      const barChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: productMonths,
          datasets: [{
            label: 'Product Sales per Month',
            data: productMonthlyLength,
            backgroundColor: '#7FBDA8',
            borderColor: '#7FBDA8',
            borderWidth: 2
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: false
            }
          }
        }
      });
      return () => barChart.destroy(); // Cleanup function to destroy the chart
    }
  }, [productMonthlyLength]); // Create bar chart only once

  const getDashboardRecord = async () => {
    try {
      const categoryArray = [];
      const categoryNameArray = [];
      const categoryNameArrayCount = [];
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/category/category-list`
      );
      if (data.success) {
        data.category.map((item, index) => {
          categoryArray.push(item);
          categoryNameArray.push(item?.name);
          categoryNameArrayCount.push(0)
        });
        setCategoryNames(categoryNameArray)
        setCategoryListData(categoryArray);
      }

      const dashboard = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/adminDashboard/${selectedYear}`);
      if (dashboard?.data?.success) {
        console.log("len", dashboard?.data?.data?.length);
        if (dashboard?.data?.data?.length > 0) {
          setDataAvaliable(true)
          // setDataAvaliable(dashboard?.data?.data)
          setDashboardDatas(dashboard?.data?.data[0]);
          console.log("dashboard", dashboard?.data?.data[0]);

          let productArrayLength = []
          let productsOrders = []
          let Months = []
          dashboard?.data?.data[0]?.months?.map((item, index) => {
            if (item == 1) {
              Months?.push("January")
            } else if (item == 2) {
              Months?.push('February')
            } else if (item == 3) {
              Months.push('March');
            } else if (item == 4) {
              Months.push('April')
            } else if (item == 5) {
              Months.push('May')
            } else if (item == 6) {
              Months.push('June')
            } else if (item == 7) {
              Months.push('July')
            } else if (item == 8) {
              Months.push('August')
            } else if (item == 9) {
              Months.push('September')
            } else if (item == 10) {
              Months.push('October')
            } else if (item == 11) {
              Months.push('November')
            } else {
              Months.push('December')
            }
          })
          setProductMonths(Months)
          dashboard?.data?.data[0]?.product_orders?.map((item, index) => {
            productArrayLength.push(item?.length)
            item?.map((ite, ind) => {
              productsOrders.push(ite)
            })
          })
          let AnalyticsValue = ""
          let totalCost = 0
          dashboard?.data?.data[0]?.totalCosts?.map((sale, index) => {
            totalCost += sale
            if (index === 0) {
              AnalyticsValue = "Good";
            } else {
              if (sale > dashboard?.data?.data[0]?.totalCosts[index - 1]) {
                AnalyticsValue = "Good";
              } else {
                AnalyticsValue = "Bad";
              }
            }
          })

          //   dashboard?.data?.data[0]?.totalCosts.map((currentValue, index) => {
          //     if (index === 0) {
          //         AnalyticsValue = "Good";
          //     } else {
          //         if (currentValue > dashboard?.data?.data[0]?.totalCosts[index - 1]) {
          //             AnalyticsValue = "Good";
          //         } else {
          //             AnalyticsValue = "Bad";
          //         }
          //     }
          // });
          setAnalytics(AnalyticsValue)
          setTotalSale(totalCost)
          setCategoryCountPerProduct(categoryNameArrayCount)
          setProductMonthlyLength(productArrayLength)
          setProductsOrders(productsOrders)
        } else {
          setDataAvaliable(false)
        }



      } else {
        toast.error('Error in fetching records');
      }
    } catch (error) {
      toast.error('Error in fetching records');
    }
  };



  const getDropList = () => {
    const year = new Date().getFullYear();
    return (
      Array.from(new Array(10), (v, i) =>
        <option key={i} value={year - i}>{year - i}</option>
      )
    );
  };



  const getUserList = async () => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API}/api/v1/auth/users`
    );

    console.log("users", data);

    if (data?.success) {
      const userIdToRemove = auth?.user?._id; // Replace with the ID of the user you want to remove
      const filteredUsers = data?.users.filter(user => user._id !== userIdToRemove);
      setTotalUser(filteredUsers?.length);
    } else {
      toast("fail to fetch user's list");
    }
  };



  console.log("category", analytics);




  return (
    <Layout title="order-page admin">
      <div style={containerStyle} className="container-fluid m-0 p-4">
        <div className="row ">
          <div style={leftStyle} className="col-md-2 ">
            <AdminMenu />
          </div>
          <style>{lightScrollbarCSS}</style>
          <div style={rightStyle} className="col-md-10 ">
            <div className="row justify-content-center">
              <div className="col-md-2 col-sm-4" style={{ padding: "10px 20px" }}>
                <div style={{ margin: "0px 1px", backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "2px 10px " }}>

                  <div className="d-flex justify-content-between">
                    <div
                      style={{ fontSize: "2rem", fontWeight: "bold" }}
                    >{sessionStorage.getItem('totalProducts')}</div>
                    <div
                      style={{
                        backgroundColor: "#ffffff",
                      }}
                    >
                      <MdOutlineProductionQuantityLimits
                        style={{
                          color: "#7fbda8",
                          fontSize: "3em",
                          fontWeight: "bold",

                        }}
                      />
                    </div>
                  </div>
                  <p>Total Products</p>
                </div>
              </div>
              <div className="col-md-2 col-sm-4" style={{ padding: "10px 20px" }}>
                <div style={{ margin: "0px 1px", backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "2px 10px " }}>

                  <div className="d-flex justify-content-between">
                    <div
                      style={{ fontSize: "2rem", fontWeight: "bold" }}
                    >{totalUser}</div>
                    <div
                      style={{
                        backgroundColor: "#ffffff",
                      }}
                    >
                      <FaUsers
                        style={{
                          color: "#7fbda8",
                          fontSize: "3em",
                          fontWeight: "bold",
                        }}
                      />
                    </div>
                  </div>
                  <p>Total Customer</p>
                </div>
              </div>
              <div className="col-md-2 col-sm-4" style={{ padding: "10px 20px" }}>
                <div style={{ margin: "0px 1px", backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "2px 10px " }}>

                  <div className="d-flex justify-content-between">
                    <div
                      style={{ fontSize: "2rem", fontWeight: "bold" }}
                    >{productsOrders?.length}</div>
                    <div
                      style={{
                        backgroundColor: "#ffffff",
                      }}
                    >
                      <FaJediOrder
                        style={{
                          color: "#7fbda8",
                          fontSize: "3em",
                          fontWeight: "bold",
                        }}
                      />
                    </div>
                  </div>
                  <p>Total Orders</p>
                </div>
              </div>
              <div className="col-md-2 col-sm-4" style={{ padding: "10px 20px" }}>
                <div style={{ margin: "0px 1px", backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "2px 10px " }}>

                  <div className="d-flex justify-content-between">
                    <div
                      style={{ fontSize: "2rem", fontWeight: "bold" }}
                    >
                      <Tooltip placement="top" title={totalSale.toLocaleString()}>
                        {totalSale.toString()?.length > 3 ? totalSale.toLocaleString()?.substring(0, 5) + '+' : totalSale.toLocaleString()}
                      </Tooltip>
                    </div>
                    <div
                      style={{
                        backgroundColor: "#ffffff",
                      }}
                    >
                      <FaSellcast
                        style={{
                          color: "#7fbda8",
                          fontSize: "3em",
                          fontWeight: "bold",
                        }}
                      />
                    </div>
                  </div>
                  <p>Total Sales</p>
                </div>
              </div>
              
              <div className="col-md-2 col-sm-4" style={{ padding: "10px 20px" }}>
                <div style={{ margin: "0px 1px", backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "2px 10px " }}>

                  <div className="d-flex justify-content-between">
                    <div
                      style={{ fontSize: "2rem", fontWeight: "bold" }}
                    >
                      {
                        <Tooltip placement="top" title={(parseInt(totalSale) * 0.15).toFixed(2)}>
                          {totalSale.toString()?.length > 2 ? (parseInt(totalSale) * 0.15).toFixed(2)?.substring(0, 5) + '+' : (parseInt(totalSale) * 0.15).toFixed(2)}
                        </Tooltip>
                      }
                    </div>
                    <div
                      style={{
                        backgroundColor: "#ffffff",
                      }}
                    >
                      <FaSackDollar
                        style={{
                          color: "#7fbda8",
                          fontSize: "3em",
                          fontWeight: "bold",
                        }}
                      />
                    </div>
                  </div>
                  <p>Total Profit</p>
                </div>
              </div>
              <div className="col-md-2 col-sm-4" style={{ padding: "10px 20px" }}>
                <div style={{ margin: "0px 1px", backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "2px 10px " }}>

                  <div className="d-flex justify-content-between">
                    <div
                      style={{ fontSize: "1.7rem", fontWeight: "bold" }}
                    >{analytics}</div>
                    <div
                      style={{
                        backgroundColor: "#ffffff",
                      }}
                    >
                      <GrDocumentPerformance
                        style={{
                          color: "#7fbda8",
                          fontSize: "2.5em",
                          fontWeight: "bold",
                        }}
                      />
                    </div>
                  </div>
                  <p>Analytics</p>

                  <select className=" float-end"
                    style={{ marginTop: "-30px", backgroundColor: "#7FBDA8", color: "#fff", height: "23px" }}
                    onChange={(event) => { 
                      setSelectedYear(parseInt(event.target.value))
                      setTotalSale(0)
                     }}
                    value={selectedYear}>
                    {
                      getDropList()
                    }
                  </select>
                </div>
              </div>
            </div>

            {
              dataAvaliable === true ? (<>
                <div className="row d-flex justify-content-between">
                  <div className="Product-graph col-md-8 col-sm-6 ">
                    <canvas ref={chartRef1} height="145"></canvas>
                  </div>
                  <div className="col-md-4 col-sm-5">
                    <canvas ref={chartRef2} height="10px"></canvas>
                  </div>
                </div>


                <div className="row d-flex justify-content-between">
                  <div className="Product-graph col-md-7 col-sm-7" >
                    <canvas id="barChart" ref={chartRef3} />
                  </div>

                  {/* <div className="col-md-5 col-sm-5" style={{ maxHeight: "200px", overflowY: "auto", marginTop:"20px" }}>
              <h5>Top Trending Products</h5>
                <table className="table" style={{ maxHeight: "200px", overflowY: "auto", marginTop:"20px" }}> 
                  <thead>
                    <tr>
                      <th scope="col"> </th>
                      <th scope="col"> </th>
                      <th scope="col">Product Name</th>
                      <th scope="col">Price</th>
                    </tr>
                  </thead>
                  <tbody >
                    <tr>
                      <td>1</td>
                      <td>Row 1, Col 2</td>
                      <td>Row 1, Col 3</td>
                      <td>Row 1, Col 4</td>
                    </tr>
                    <tr>
                      <td>1</td>
                      <td>Row 1, Col 2</td>
                      <td>Row 1, Col 3</td>
                      <td>Row 1, Col 4</td>
                    </tr>
                    <tr>
                      <td>1</td>
                      <td>Row 1, Col 2</td>
                      <td>Row 1, Col 3</td>
                      <td>Row 1, Col 4</td>
                    </tr>
                    <tr>
                      <td>1</td>
                      <td>Row 1, Col 2</td>
                      <td>Row 1, Col 3</td>
                      <td>Row 1, Col 4</td>
                    </tr>
                    <tr>
                      <td>1</td>
                      <td>Row 1, Col 2</td>
                      <td>Row 1, Col 3</td>
                      <td>Row 1, Col 4</td>
                    </tr>
                    <tr>
                      <td>1</td>
                      <td>Row 1, Col 2</td>
                      <td>Row 1, Col 3</td>
                      <td>Row 1, Col 4</td>
                    </tr>
                    <tr>
                      <td>1</td>
                      <td>Row 1, Col 2</td>
                      <td>Row 1, Col 3</td>
                      <td>Row 1, Col 4</td>
                    </tr>
                    <tr>
                      <td>1</td>
                      <td>Row 1, Col 2</td>
                      <td>Row 1, Col 3</td>
                      <td>Row 1, Col 4</td>
                    </tr>
                    <tr>
                      <td>1</td>
                      <td>Row 1, Col 2</td>
                      <td>Row 1, Col 3</td>
                      <td>Row 1, Col 4</td>
                    </tr>
                    <tr>
                      <td>1</td>
                      <td>Row 1, Col 2</td>
                      <td>Row 1, Col 3</td>
                      <td>Row 1, Col 4</td>
                    </tr>
                    <tr>
                      <td>1</td>
                      <td>Row 1, Col 2</td>
                      <td>Row 1, Col 3</td>
                      <td>Row 1, Col 4</td>
                    </tr>
                    <tr>
                      <td>1</td>
                      <td>Row 1, Col 2</td>
                      <td>Row 1, Col 3</td>
                      <td>Row 1, Col 4</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>Row 2, Col 2</td>
                      <td>Row 2, Col 3</td>
                      <td>Row 2, Col 4</td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>Row 3, Col 2</td>
                      <td>Row 3, Col 3</td>
                      <td>Row 3, Col 4</td>
                    </tr>
                  </tbody>
                </table>
              </div> */}

                  <div className="col-md-5 col-sm-5">
                    <h5>Top Trending Products</h5>
                    <div style={{ maxHeight: "350px", overflowY: "auto", marginTop: "20px" }}>

                      <div className="row" style={{ marginBottom: "15px" }} >
                        {console.log("products", dashboardDatas?.product_orders)}
                        <div className="col-md-1 " style={{ fontWeight: 'bold' }}> #</div>
                        <div className="col-md-3 " style={{ fontWeight: 'bold' }}> Name</div>
                        <div className="col-md-4 " style={{ fontWeight: 'bold' }}> Description</div>
                        <div className="col-md-2 " style={{ fontWeight: 'bold' }}> Price</div>
                        <div className="col-md-2 " style={{ fontWeight: 'bold' }}> View</div>
                      </div>
                      {
                        productsOrders?.map((item, index) => {
                          return (
                            <div className="row" style={{ marginBottom: "5px" }} >
                              {console.log("products", dashboardDatas?.product_orders)}
                              <div className="col-md-1"> {index + 1}</div>
                              <div className="col-md-3"> {item?.name}</div>
                              <div className="col-md-4"> {item?.description?.length > 25 ? item?.description.substring(0, 25) + '...' : item?.description + '.'}</div>
                              <div className="col-md-2"> {item?.price}</div>
                              <div className="col-md-2 " ><Tooltip title="View Product"> <VisibilityIcon style={{ cursor: "pointer" }}
                                onClick={() => {
                                  sessionStorage.setItem("productId", item?.productId);
                                  sessionStorage.setItem("slug", item?.slug);
                                  navigate("/admin/view-product");
                                }} />
                              </Tooltip>
                              </div>
                            </div>
                          )
                        })
                      }
                    </div>
                  </div>
                </div>

              </>) : (
                <div className=" d-flex justify-content-center mt-5">
                  {/* <p>No Data Found!!!</p>
                  <br></br> */}
                  <h4 style={{ color: 'red' }}>Please Deliver Your First Order To See The DashBoard...</h4>
                </div>
              )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
