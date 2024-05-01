import React from "react";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <div className="footer " style={{
      marginBottom:"-20px"
    }}>
      <h5 className="text-center mt-5">All Right Reserved By &copy; {new Date().getFullYear()} E-Commerec</h5>
      <p className="text-center mt-5" style={{padding:"0px 30px", textAlign:"justify"}}>The product images displayed on our website are for illustrative purposes only. While we strive to provide accurate representations of our products, please note that actual colors, dimensions, and textures may vary slightly due to factors such as lighting, screen resolution, and manufacturing variations.

        We make every effort to ensure that product descriptions and specifications are accurate and up-to-date. However, we cannot guarantee that all information provided is error-free. If you have any questions or concerns about a product, please contact our customer service team for assistance before making a purchase.

        Additionally, please be aware that accessories or additional items shown in product photos may not be included unless explicitly stated in the product description. Please review the product details carefully before placing your order.

        Thank you for your understanding.</p>
      <p className="text-center mt-0">

        <Link to="/about">About</Link>|<Link to="/contact">Contact</Link>|
        <Link to="/policy">Privacy Policy</Link>
      </p>
    </div>
  );
};

export default Footer;