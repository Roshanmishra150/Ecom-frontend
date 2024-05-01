import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import AdminMenu from "../../components/layout/AdminMenu";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Modal, Button } from "antd";
import { useAuth } from "../../context/AuthContext";

const CreateCategory = () => {
  const [category, setCategory] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [editFlag, setEditFlag] = useState(false);
  const [deleteFlag, setDeleteFlag] = useState(false);
  const [editId, setEditId] = useState("");
  const [expandSubCategory, setExpandSubCategory] = useState("");
  const [auth, setAuth] = useAuth();
  const [selectedCategoryName, setSelectedCategoryName] = useState("");

  // get category list
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
    getAllCategory();
  }, []);

  // Add/Update category
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newCategory !== "") {
      if (!editFlag) {
        try {
          setLoading(true);
          const {
            data,
          } = await axios.post(
            `${process.env.REACT_APP_API}/api/v1/category/create-category`,
            { name: newCategory }
          );
          if (data?.success) {
            if(data?.message == "Category Already Exists"){
              toast.success("Category Already Exists");
            }
            toast.success(`Successfully create ${newCategory} Category`);
            getAllCategory();
            setNewCategory("");
          }
          setLoading(false);
        } catch (error) {
          if (newCategory == "") {
            toast.error(`Enter category name to create`);
          } else {
            toast.error(`Failure to add Category`);
          }
          getAllCategory();
        }
      } else {
        try {
          setLoading(true);
          const {
            data,
          } = await axios.put(
            `${process.env.REACT_APP_API}/api/v1/category/update-category/${editId}`,
            { name: newCategory }
          );
          if (data.success) {
            setEditId("");
            setEditFlag(false);
            setNewCategory("");
            toast.success("Category successfully updated");
            getAllCategory();
          }
          setLoading(false);
        } catch (error) {
          if (newCategory == "") {
            toast.error(`Enter category name to create`);
          } else {
            toast.error(`Failure to update Category`);
          }
          getAllCategory();
        }
      }
    } else {
      toast.error("Please Enter something");
    }
  };

  // Delete category
  const deleteHandler = async (id, name) => {
    try {
      setLoading(true);
      const { data } = await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/category/delete-category/${id}`
      );
      if (data?.success) {
        toast.success(`Successfully deleted ${name} category`);
        getAllCategory();
      }
      setLoading(false);
      setDeleteFlag(false)
    } catch (error) {
      toast.error(`Failure to delete ${name} Category`);
      getAllCategory();
    }
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

  return (
    <Layout title="create-category E-comm">
      <div style={containerStyle} className="container-fluid m-0 p-4">
        <div className="row">
          <div style={leftStyle} className="col-md-3">  
            <AdminMenu />
          </div>
          <style>{lightScrollbarCSS}</style>
          <div style={rightStyle} className="col-md-9">
            <h3>Manage Category </h3>
            <div>
              <input
                type="text"
                value={newCategory}
                placeholder={editFlag ? `Update ${newCategory} Category`:"Enter category name "}
                className="p-1 w-50"
                style={{ marginRight: "30px" }}
                onChange={(e) => setNewCategory(e.target.value)}
              />

              <button
                className="btn btn-primary"
                style={{ marginBottom: "5px" }}
                onClick={handleSubmit}
              >
                {editFlag === true  ? "Update Category" : "Add Category"}
              </button>
            </div>

            {category && (
              <table className="table table-group-divider table-responsive table-striped w-75 ">
                <thead>
                  <tr>
                    <th scope="col">Sr.No</th>
                    <th scope="col">Name</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                {loading ? (
                  <div className="loader"></div>
                ) : (
                  // <tbody>
                  //   {category.map((items, index) => {
                  //     return (
                  //       <>
                  //       <tr key={index} className="align-items-center w-50 ">
                  //         <td className="">{index + 1}</td>
                  //         <td className="">{items.name}</td>
                  //         <td>
                  //           <button
                  //             style={{
                  //               marginRight: "10px",
                  //               marginTop: "-5px",
                  //               marginBottom: "-5px",
                  //             }}
                  //             className="btn btn-primary"
                  //             onClick={() => {
                  //               setEditId(items._id);
                  //               setEditFlag(true);
                  //               setNewCategory(items.name);
                  //             }}
                  //           >
                  //             Edit
                  //           </button>
                  //           <button
                  //             style={{
                  //               marginTop: "-5px",
                  //               marginBottom: "-5px",
                  //             }}
                  //             className="btn btn-danger"
                  //             onClick={
                  //               () => {
                  //                 setDeleteFlag(true);
                  //                 setEditId(items._id);
                  //                 setSelectedCategoryName(items.name)
                  //               }
                  //               // deleteHandler(items._id, items.name)
                  //             }
                  //           >
                  //             Delete
                  //           </button>
                  //           <button
                  //             style={{
                  //               marginTop: "-5px",
                  //               marginBottom: "-5px",
                  //               marginLeft:"10px"
                  //             }}
                  //             className="btn btn-secondary"
                  //             onClick={
                  //               () => {
                  //                 setExpandSubCategory(index);
                  //                 setSelectedCategoryName(items.name)
                  //               }
                  //             }
                  //           >
                  //             Add Sub Category
                  //           </button>
                            
                  //         </td>
                  //       </tr>
                  //       {
                  //         expandSubCategory === index && (
                  //           <div>
                  //           <table className="table table-group-divider table-responsive table-striped w-75 ">
                  //             <thead>
                  //               <tr>
                  //                 <th scope="col">Sr.No</th>
                  //                 <th scope="col">Name</th>
                  //                 <th scope="col">Action</th>
                  //               </tr>
                  //             </thead>
                  //             <tbody>
                  //               <tr>
                  //                 <td>1.</td>
                  //                 <td>roshan</td>
                  //                 <td>mishra</td>
                  //               </tr>
                  //               <tr>
                  //                 <td>1.</td>
                  //                 <td>roshan</td>
                  //                 <td>mishra</td>
                  //               </tr>
                  //             </tbody>
                  //           </table>
                  //           </div>
                  //         ) 
                  //       }
                  //       </>
                  //     );
                  //   })}
                  // </tbody>
                  <tbody>
  {category.map((items, index) => (
    <React.Fragment key={index}>
      <tr className="align-items-center w-50">
        <td>{index + 1}</td>
        <td>{items.name}</td>
        <td>
          <button
            style={{
              marginRight: "10px",
              marginTop: "-5px",
              marginBottom: "-5px",
            }}
            className="btn btn-primary"
            onClick={() => {
              setEditId(items._id);
              setEditFlag(true);
              setNewCategory(items.name);
            }}
          >
            Edit
          </button>
          <button
            style={{
              marginTop: "-5px",
              marginBottom: "-5px",
            }}
            className="btn btn-danger"
            onClick={() => {
              setDeleteFlag(true);
              setEditId(items._id);
              setSelectedCategoryName(items.name);
            }}
          >
            Delete
          </button>
          {/* <button
            style={{
              marginTop: "-5px",
              marginBottom: "-5px",
              marginLeft: "10px",
            }}
            className="btn btn-secondary"
            onClick={() => {
              setExpandSubCategory(index);
              setSelectedCategoryName(items.name);
            }}
          >
            Add Sub Category
          </button> */}
        </td>
      </tr>
      {/* {expandSubCategory === index && (
        <tr>
          <td colSpan="3">
            <div style={{ display: "inline-block" }}>
              <table className="table table-group-divider table-responsive table-striped w-75">
                <thead>
                  <tr>
                    <th scope="col">Sr.No</th>
                    <th scope="col">Name</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1.</td>
                    <td>roshan</td>
                    <td>mishra</td>
                  </tr>
                  <tr>
                    <td>2.</td>
                    <td>john</td>
                    <td>doe</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      )} */}
    </React.Fragment>
  ))}
</tbody>

                )}
              </table>
            )}
          </div>
        </div>
        <Modal
          title="Confirmation"
          open={deleteFlag}
          onOk={()=>deleteHandler(editId,"name")}
          onCancel={()=>setDeleteFlag(false)}
          okText="Yes"
          cancelText="No"
          
        >
          <div style={{padding:"20px 0px"}}>
            <h5 className=""> Are you sure you want to delete <span className=" text-danger">{selectedCategoryName} </span>  Category! </h5>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

export default CreateCategory;
