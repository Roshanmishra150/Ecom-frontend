import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import AdminMenu from "../../components/layout/AdminMenu";

import { TabContext, TabList, TabPanel } from "@mui/lab";

import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import {
  hashPassword,
  comparePassword,
} from "../../components/components/helper";
import toast from "react-hot-toast";
import UsersMenu from "../User/UsersMenu";

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Tooltip from "@mui/material/Tooltip";
import Typography from '@mui/material/Typography';


const Orders = () => {
  const [auth, setAuth] = useAuth();
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [profileImage, setProfileImage] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [answer, setAnswer] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resendEmailOtp, setResendEmailOtp] = useState(false);

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [answerError, setAnswerError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailOtpError, setEmailOtpError] = useState("");
  const [phoneOtpError, setPhoneOtpError] = useState("");

  // const handleImageChange = (event) => {
  //   const selectedImage = event.target.files[0];
  //   if (selectedImage) {
  //     setProfileImage(URL.createObjectURL(selectedImage));
  //   }
  // };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
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
    left: auth?.toggle ? "280px" : "140px",
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

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    const reader = new FileReader();

    if (file) {
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setProfileImage(""); // Reset selected image when no file is chosen
    }
  };

  const onChangeHandler = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    console.log("event onchangehander", name , value);

    switch (name) {
      case "FirstName":
        if (value == "" || value == undefined) {
          setFirstNameError("Please Enter First Name");
          setFirstName(value);
        } else {
          setFirstNameError("");
          setFirstName(value);
        }
        break;

      case "LastName":
        if (value == "" || value == undefined) {
          setLastNameError("Please Enter Last Name");
          setLastName(value);
        } else {
          setLastNameError("");
          setLastName(value);
        }
        break;

      case "Address":
        if (value == "" || value == undefined) {
          setAddressError("Please Enter Your Address");
          setAddress(value);
        } else {
          setAddressError("");
          setAddress(value);
        }
        break;

      case "Email":
        if (value == "" || value == undefined) {
          setEmailError("Please Enter Your Email ID");
          setEmail(value);
        } else {
          setEmailError("");
          setEmail(value);
        }
        break;

      case "EmailOtp":
        if (value == "" || value == undefined) {
          setEmailOtpError("Please Enter Your Email ID");
          setEmailOtp(value);
        } else {
          setEmailOtpError("");
          setEmailOtp(value);
        }
        break;
      
      case "current_password":
        const strongPasswordRegex1 = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%^*?&])[A-Za-z\d@$!%^*?&]{8,}$/;
        if (value == "" || value == undefined) {
          setCurrentPasswordError("Please Enter Your Current Password ");
          setCurrentPassword("");
        } else if (!strongPasswordRegex1.test(value)) {
          setCurrentPasswordError("Please Enter Strong Password")
          setCurrentPassword(value);
        }
        else {
          setCurrentPasswordError("");
          setCurrentPassword(value);
        }
        break;
      case "new_password":
        const strongPasswordRegex2 = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%^*?&])[A-Za-z\d@$!%^*?&]{8,}$/;
        if (value == "" || value == undefined) {
          setNewPasswordError("Please Enter Your Current Password ");
          setNewPassword("");
        } else if (!strongPasswordRegex2.test(value)) {
          setNewPasswordError("Please Enter Strong Password")
          setNewPassword(value);
        } else if (currentPassword == value) {
          setNewPasswordError("New Password Is Same as Current Password")
          setNewPassword(value);
        }
        else {
          setNewPasswordError("");
          setNewPassword(value);
        }
        break;
      case "confirm_password":
        const strongPasswordRegex3 = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%^*?&])[A-Za-z\d@$!%^*?&]{8,}$/;
        if (value == "" || value == undefined) {
          setConfirmPasswordError("Please Enter Confirm Password ");
          setConfirmPassword("");
        } else if (!strongPasswordRegex3.test(value)) {
          setConfirmPasswordError("Please Enter Strong Password")
          setConfirmPassword(value);
        } else if (newPassword !== value) {
          setConfirmPasswordError("Confirm Password Doesn't Match")
          setConfirmPassword(value);
        }
        else {
          setConfirmPasswordError("");
          setConfirmPassword(value);
        }
        break;
      
      default:
        
    }

    // if(name=="Address"){
    //   setAddressError("Please Enter Your Address")
    // }else{
    //   setAddress(value)
    // }
    // if(name=="Password"){
    //   setPasswordError("Please Enter Your Password")
    // }
    // if(name=="Address"){
    //   setAddressError("Please Enter Your Address")
    // }
  };

  const submitPasswordChangeHandler = () => {
    if (
      (currentPassword != "" && currentPasswordError == "") &&
      (newPassword != "" && newPasswordError == "") &&
      (confirmPassword != "" && confirmPasswordError == "") 
    ) {
      try {
        const response = axios.post(`${process.env.REACT_APP_API}/api/v1/auth/update-password`, {
          email: auth?.user?.email,
          newPassword: confirmPassword,
          currentPassword: currentPassword
        })
        if (response) {
          console.log("password response", response);
          toast.success("Password Updated successfully")
        }
      } catch (error) {
        toast.error("Something went wrong")
      }
    }
  }

  const submitHandler = async (tab) => {
    // onChangeHandler()
    if (tab === 1) {
      if (firstName == "" || firstName == undefined) {
        setFirstNameError("Please Enter First Name");
      } else if (lastName == "" || lastName == undefined) {
        setLastNameError("Please Enter Last Name");
      } else if (address == "" || address == undefined) {
        setAddressError("Please Enter Your Address");
      } else {
        try {
          const userData = new FormData();
          userData.append("name", firstName + " " + lastName);
          userData.append("address", address);
          userData.append("answer", answer);
          userData.append("phone", auth?.user?.phone);
          userData.append("photo", profileImage);
          userData.append("email", auth?.user?.email);
          // userData.append("password", password);

          const data = await axios.put(
            `${process.env.REACT_APP_API}/api/v1/auth/updateProfile/${auth.user._id}`,
            userData
          );
          if (data?.data?.success) {
            console.log("set", data);
            setAuth({
              // ...auth,
              user: data.data.UserDetails,
              token: JSON.parse(sessionStorage.getItem("token")),
              // token: sessionStorage.getItem('token')
            });
            sessionStorage.setItem("user", JSON.stringify(data?.data?.UserDetails));
            toast.success(data?.data?.message);
          }
        } catch (error) {toast.error(error)}
      }
    }
    if (tab === 2) {
      if (emailOtp == "" || emailOtp == undefined) {
        setEmailOtpError("Invalid OTP");
      } else {
        try {
          const userData = new FormData();
          userData.append("name", auth?.user?.name);
          userData.append("address", auth?.user?.address);
          userData.append("answer", auth?.user?.answer);
          userData.append("phone", phone);
          userData.append("photo", profileImage);
          userData.append("email", email);
          userData.append("emailOtp", emailOtp);
          // userData.append("phoneOtp", "emailOtp");
          // userData.append("password", password);

          const data = await axios.put(
            `${process.env.REACT_APP_API}/api/v1/auth/updateProfile/${auth.user._id}`,
            userData
          );
          if (data?.data?.success === true) {
            console.log("set", data);
            setAuth({
              ...auth,
              user: data?.data?.UserDetails,
              token: JSON.parse(sessionStorage.getItem("token")),
            });
            sessionStorage.setItem("user", JSON.stringify(data?.data?.UserDetails));
            toast.success(data?.data?.message);
            setEmail(data?.data?.UserDetails?.email)
            setEmailOtp("")
            setResendEmailOtp(false)
          } else {
            toast.error(data?.data?.message)
          }
        } catch (error) {toast.error(error)}
      }
    }
  };

  // Function to convert the buffer data to a data URL.
  const bufferToDataURL = (buffer, contentType) => {
    const blob = new Blob([new Uint8Array(buffer)], { type: contentType });
    return URL.createObjectURL(blob);
  };

  useEffect(() => {
    setAuth({
      ...auth,
      user: JSON.parse(sessionStorage.getItem("user")),
      token: JSON.parse(sessionStorage.getItem("token")),
    });
    console.log("auth...", auth);
    try {
      const mockImageData = {
        contentType: "image/png",
        data: auth.user.photo.data.data,
      };
      setProfileImage(mockImageData);
    } catch (error) {
    }
    console.log("imgaesss.....", profileImage);

    const name = auth?.user?.name.split(" ");

    if (name !== undefined) {
      
      setFirstName(name[0]);
    
      if (name[1] == undefined || name[1] == null) {
        setLastName("");
      } else {
        setLastName(name[1]);
      }
    }
    setEmail(auth.user.email);
    setPhone(auth.user.phone);
    setAnswer(auth.user.answer);
    setAddress(auth.user.address);
    setPassword(auth.user.password);

  }, []);


  const sendEmailOTPHandler = async () => {
    const response = await axios.post(
      `${process.env.REACT_APP_API}/api/v1/auth/sendOtpEmail`,
      {email}
    );

    if (response?.data?.success) {
      toast.success(response?.data?.message);
      setResendEmailOtp(true);
    }
  };
console.log("imgaess....", profileImage);
  return (
    <Layout title="setting - E-comm">
      <div style={containerStyle}  className="container-fluid p-4 m-0">
        <div className="row">
          <div style={leftStyle} className="col-md-3">
            {
              auth?.user?.role === 1 ? <AdminMenu/> : <UsersMenu/>
            }
            {/* <AdminMenu /> */}
          </div>
          <style>{lightScrollbarCSS}</style>
          <div style={rightStyle} className="col-md-9">
            {/* <h1>Setting</h1> */}
            <Box sx={{ width: "100%", typography: "" }}>
              <TabContext value={value}>
                <Box>
                  <TabList
                    onChange={handleChange}
                    aria-label="secondary tabs example"
                    indicatorColor="primary"
                    TabIndicatorProps={{
                      style: {
                        marginTop: "-30px",
                      },
                    }}
                  >
                    <Tab
                      style={{ color: "black" }}
                      label="Update Account"
                      value="1"
                      disableRipple
                    />
                    <Tab
                      label="Change Email / Phone no."
                      value="2"
                      disableRipple
                    />
                    <Tab
                      label="Change / Update Password."
                      value="3"
                      disableRipple
                    />
                  </TabList>
                </Box>
                <TabPanel
                  // style={{ marginTop: "-20px", display: "flex" }}
                  value="1"
                >
                  <div style={{ marginTop: "-20px", display: "flex" }}>
                    <div>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          p: 3,
                          mt: 3,
                        }}
                      >
                        {profileImage?.data ? (
                          <img
                            style={{
                              width: 260,
                              height: 260,
                              marginBottom: 20,
                              borderRadius: "50%",
                            }}
                            src={
                              profileImage?.data
                                ? bufferToDataURL(
                                    profileImage.data,
                                    profileImage.contentType
                                  )
                                :
                                profileImage
                            }
                            alt="Profile"
                          />
                        ) : [profileImage]?.length == 1 ? (
                          <img
                            style={{
                              width: 260,
                              height: 260,
                              marginBottom: 20,
                              borderRadius: "50%",
                            }}
                            src={profileImage}
                            alt="Profile"
                          />
                        ) : (
                          <div
                            style={{
                              backgroundColor: "lightblue",
                              width: 250,
                              height: 245,
                              marginTop: "-10px",
                              marginBottom: 20,
                              borderRadius: "50%",
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <p
                              className=" text-capitalize "
                              style={{
                                fontSize: "190px",
                                fontWeight: "bolder",
                                marginTop: "-35px",
                              }}
                            >
                              {auth?.user?.name[0]}
                            </p>
                          </div>
                        )}
                        {!profileImage || profileImage == "" ? (
                          <div
                            style={{
                              backgroundColor: "lightblue",
                              width: 250,
                              height: 245,
                              marginTop: "-280px",
                              marginBottom: 20,
                              borderRadius: "50%",
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <p
                              className=" text-capitalize "
                              style={{
                                fontSize: "190px",
                                fontWeight: "bolder",
                                marginTop: "-35px",
                              }}
                            >
                              {auth?.user?.name[0]}
                            </p>
                          </div>
                        ) : (
                          ""
                        )}
                        <input
                          accept="image/*"
                          id="profile-image-upload"
                          type="file"
                          style={{ display: "none" }}
                          onChange={handleImageChange}
                        />
                        <label htmlFor="profile-image-upload">
                          <Button variant="contained" component="span">
                            Select Profile Image
                          </Button>
                        </label>
                      </Box>
                    </div>
                    <div className=" ms-4 mt-3">
                      <TextField
                        id="standard-basic"
                        label="First Name"
                        name="FirstName"
                        variant="standard"
                        style={{
                          width: "500px",
                          marginTop: "20px",
                        }}
                        value={firstName}
                        onChange={(e) => {
                          onChangeHandler(e);
                        }}
                        InputLabelProps={{
                          style: {
                            fontFamily: "Arial",
                            fontSize: "20px",
                          },
                        }}
                      />
                      {firstNameError ? (
                        <p style={{ color: "red", marginBottom: "-10px" }}>
                          {firstNameError}
                        </p>
                      ) : (
                        ""
                      )}<br></br>
                      <TextField
                        id="standard-basic"
                        label="Last Name"
                        name="LastName"
                        variant="standard"
                        style={{
                          width: "500px",
                          marginTop: "40px",
                        }}
                        value={lastName}
                        onChange={(e) => {
                          onChangeHandler(e);
                        }}
                        InputLabelProps={{
                          style: {
                            fontFamily: "Arial",
                            fontSize: "20px",
                          },
                        }}
                      />
                      {lastNameError ? (
                        <p style={{ color: "red", marginBottom: "-10px" }}>
                          {lastNameError}
                        </p>
                      ) : (
                        ""
                      )}<br></br>

                      <TextField
                        id="standard-basic"
                        label="Address"
                        name="Address"
                        variant="standard"
                        style={{
                          width: "500px",
                          marginTop: "40px",
                        }}
                        value={address}
                        onChange={(e) => {
                          onChangeHandler(e);
                        }}
                        InputLabelProps={{
                          style: {
                            fontFamily: "Arial",
                            fontSize: "20px",
                          },
                        }}
                      />
                      {addressError ? (
                        <p style={{ color: "red", marginBottom: "-5px" }}>
                          {addressError}
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <button
                    className="btn btn-outline-primary"
                    style={{
                      marginLeft: "80%",
                      marginTop: "-110px",
                      padding: "8px 20px",
                    }}
                    onClick={(e) => submitHandler(1)}
                  >
                    {" "}
                    Submit{" "}
                  </button>
                </TabPanel>

                <TabPanel value="2">
                  <div>
                    <div className="">
                      <TextField
                        id="standard-basic"
                        label="email"
                        name="Email"
                        type="email"
                        variant="standard"
                        style={{
                          width: "250px",
                          marginTop: "20px",
                        }}
                        value={email}
                        onChange={(e) => {
                          onChangeHandler(e);
                        }}
                        InputLabelProps={{
                          style: {
                            fontFamily: "Arial",
                            fontSize: "20px",
                          },
                        }}
                      />
                      {auth?.user?.email !== email ? (
                        <button
                          className="btn btn-primary"
                          style={{ marginTop: "25px", marginLeft: "30px" }}
                          onClick={() => sendEmailOTPHandler()}
                        >
                          {resendEmailOtp === false ? "Send OTP" : "Resend OTP"}
                        </button>
                      ) : (
                        ""
                      )}
                      {resendEmailOtp && (auth?.user?.email !== email) ? (
                        <TextField
                          id="standard-basic"
                          label="Email OTP"
                          name="EmailOtp"
                          variant="standard"
                          style={{
                            width: "100px",
                            marginTop: "20px",
                            marginLeft: "30px" ,
                          }}
                          value={emailOtp}
                          onChange={(e) => {
                            onChangeHandler(e);
                          }}
                          InputLabelProps={{
                            style: {
                              fontFamily: "Arial",
                              fontSize: "20px",
                            },
                          }}
                        />
                      ) : (
                        ""
                      )}
                      {(emailOtp=="" || emailOtp==undefined || emailOtp==null) ? (
                        ""
                      ) :(auth?.user?.email !== email) ?(
                        <button
                          className="btn btn-primary"
                          style={{ marginTop: "25px", marginLeft: "30px" }}
                          onClick={() => submitHandler(2)}
                        >
                          Submit
                        </button>
                      ):""}
                    </div>

                    {emailError ? (
                      <p style={{ color: "red" }}>{emailError}</p>
                    ) : (
                      ""
                    )}
                    <p style={{ color: "", marginTop: "5px" }}>
                      Note: "Your new email will be used for all future logins
                      and communication. Important updates and account-related
                      information will be sent to your new email address. Your
                      previous email address will no longer be used for
                      communication or verification. It's crucial to use a valid
                      and accessible email for uninterrupted access to our
                      services."
                    </p>
                    <div className="">
                      <TextField
                        id="standard-basic"
                        label="phone"
                        name="phone"
                        variant="standard"
                        style={{
                          marginTop: "20px",
                        }}
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                        }}
                        InputLabelProps={{
                          style: {
                            fontFamily: "Arial",
                            fontSize: "20px",
                          },
                        }}
                      />
                      <p style={{ color: "", marginTop: "5px" }}>
                        Note: "Your new phone number will be updated as your
                        primary contact. You will receive important
                        notifications, including account-related information, on
                        your updated number. Your previous phone number will no
                        longer be associated with your account for notifications
                        or verification purposes. Please ensure your new number
                        is accurate to avoid any disruptions in service."
                        <br></br>
                      </p>
                    </div>
                    {/* <button
                      className="btn btn-outline-primary"
                      style={{
                        marginLeft: "80%",
                        marginTop: "10px",
                        padding: "8px 20px",
                      }}
                      onClick={(e) => submitHandler(2)}
                    >
                      {" "}
                      Submit{" "}
                    </button> */}
                  </div>
                </TabPanel>

                <TabPanel value="3">
                  <div>
                    <div className="">
                    <FormControl sx={{ m: 1, width: '30ch' }} variant="standard">
                      <InputLabel htmlFor="standard-adornment-password" style={{fontSize:"18px"}}>Current Password</InputLabel>
                      <Input
                        id="standard-adornment-password"
                          type={showCurrentPassword ? 'text' : 'password'}
                          name="current_password"
                          onChange={(e) => { onChangeHandler(e) }}
                          value={currentPassword}
                          endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => {
                                  setShowCurrentPassword(!showCurrentPassword)
                                }}
                              onMouseDown={(e)=>handleMouseDownPassword(e)}
                            >
                              {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        }
                        />
                      </FormControl>

                      <Tooltip title={
                        <Typography fontSize="14px">
                          Password should contain at least one lowercase letter, one uppercase letter, one digit,  special character, and password length should be minimum 8 characters.
                        </Typography>} placement="right" >
                        <IconButton style={{marginLeft:"40px", marginTop:"15px"}}>
                        <InfoOutlinedIcon style={{fontSize:"27px", color:"#5298dd"}}/>
                        </IconButton>
                      </Tooltip>
                      {
                        currentPasswordError ? 
                          (
                            <p style={{marginLeft:"15px", color:"red"}}>
                              {currentPasswordError}
                            </p>
                          ) : ""
                      }
                  </div>
                      <br></br>
                    

                    <div className="">
                    <FormControl sx={{ m: 1, width: '30ch' }} variant="standard">
                      <InputLabel htmlFor="standard-adornment-password" style={{fontSize:"18px"}}>New Password</InputLabel>
                      <Input
                        id="standard-adornment-password"
                          type={showNewPassword ? 'text' : 'password'}
                          name="new_password"
                          onChange={(e) => { onChangeHandler(e) }}
                          value={newPassword}
                          endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => { setShowNewPassword(!showNewPassword) }}
                              onMouseDown={(e) => handleMouseDownPassword(e)}
                            >
                              {showNewPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        }
                        />
                      </FormControl>
                      <Tooltip title={
                        <Typography fontSize="14px">
                          Password should contain at least one lowercase letter, one uppercase letter, one digit,  special character, and password length should be minimum 8 characters.
                        </Typography>} placement="right" >
                        <IconButton style={{marginLeft:"40px", marginTop:"15px"}}>
                        <InfoOutlinedIcon style={{fontSize:"27px", color:"#5298dd"}}/>
                        </IconButton>
                      </Tooltip>
                      {
                        newPasswordError ? 
                          (
                            <p style={{marginLeft:"15px", color:"red"}}>
                              {newPasswordError}
                            </p>
                          ) : ""
                      }
                  </div>
                  <br></br>
                    <div className="">
                    <FormControl sx={{ m: 1, width: '30ch' }} variant="standard">
                      <InputLabel htmlFor="standard-adornment-password" style={{fontSize:"18px"}}>Confirm Password</InputLabel>
                      <Input
                        id="standard-adornment-password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirm_password"
                          onChange={(e) => { onChangeHandler(e) }}
                          value={confirmPassword}
                          endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => { setShowConfirmPassword(!showConfirmPassword) }}
                              onMouseDown={(e) => handleMouseDownPassword(e)}
                            >
                              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        }
                        />
                      </FormControl>
                      <Tooltip title={
                        <Typography fontSize="14px">
                          Password should contain at least one lowercase letter, one uppercase letter, one digit,  special character, and password length should be minimum 8 characters.
                        </Typography>} placement="right" >
                        <IconButton style={{marginLeft:"40px", marginTop:"15px"}}>
                        <InfoOutlinedIcon style={{fontSize:"27px", color:"#5298dd"}}/>
                        </IconButton>
                      </Tooltip>
                      {
                        confirmPasswordError ? 
                          (
                            <p style={{marginLeft:"15px", color:"red"}}>
                              {confirmPasswordError}
                            </p>
                          ) : ""
                      }
                    </div>
                    <br></br>
                    <p style={{ color: "", marginTop: "5px" }}>
                      Note: "Your current password will be no longer in used for all future logins
                      and communication. Your
                      new password will be in used for logins."
                    </p>

                  <button className="btn  btn-primary float-end " style={{marginRight:"200px", marginTop:"30px"}} onClick={()=>{ submitPasswordChangeHandler()}}>Submit</button>
                  </div>
                </TabPanel>
              </TabContext>
            </Box>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
