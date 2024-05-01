import React from "react";
import { BiMailSend, BiPhoneCall, BiSupport } from "react-icons/bi";
import Layout from "../components/layout/Layout";
import { calc } from "antd/es/theme/internal";


const Contact = () => {
  return (
    <Layout title={"ContactUs - E-comm"}>
      <div className="d-flex justify-content-center align-items-center " style={{ height: `calc(100vh - 50px)` }}>
  <div className="text-center w-50" style={{ height: `calc(100vh - 100px)` }}>
    <h1 className="bg-dark p-2 text-white">CONTACT US</h1>
    <p className="text-justify mt-2" >
          Have a question, feedback, or just want to say hello? We'd love to hear from you! Feel free to reach out using any of the following methods:
        </p>
        <p className="text-left mt-3"><h6>Customer Support:</h6> 
          Our dedicated support team is available 24/7 to assist you with any inquiries or concerns you may have. Whether it's about our products, your order, or anything else, we're here to help.
        </p>
        <p className="mt-3"><h6>Email:</h6> 
          Drop us an email at <BiMailSend /> <a href="mailto:help@ecommerceapp.com">help@ecommerceapp.com</a> and we'll get back to you as soon as possible. We strive to respond to all emails within 24 hours.
        </p>
        <p className="mt-3"><h6>Phone:</h6> 
          Prefer to speak with someone directly? Give us a call at <BiPhoneCall /> 012-3456789 or <BiSupport /> 1800-000-000. Our friendly representatives are standing by to assist you.
        </p>
        <p className="mt-3"><h6>Social Media:</h6> 
          Connect with us on social media for the latest updates, promotions, and more. Follow us on <a href="#">Facebook</a>, <a href="#">Twitter</a>, and <a href="#">Instagram</a> to stay in the loop.
        </p>
        <p className="mt-3"><h6>Visit Us:</h6> 
          If you're in the area, feel free to drop by our office. We'd love to meet you in person! Our office is located at <h6>123 Main Street, Mumbai, Maharashtra, 452895.</h6>
        </p>
  </div>
</div>

    </Layout>
  );
};

export default Contact;