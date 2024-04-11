import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Helmet } from "react-helmet";
import { Toaster } from 'react-hot-toast';

const Layout = (props) => {
  
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{props.title}</title>
        <meta name="description" content={props.description} />
        <meta name="keywords" content={props.keywords} />
        <meta name="author" content={props.author} />
      </Helmet>
      <Header />
      <main >
        <Toaster/>
        {props.children}
        </main>
      {/* <Footer /> */}
    </>
  );
};

Layout.defaultProps = {
  title: "E-commerce",
  author: "Roshan Mishra",
  description: "MERN e-commerce website",
  keywords: "React Node.js Html Css Mongodb MERN",
};

export default Layout;
