import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";


const Spinner = ({ path }) => {
    const [count, setCount] = useState(5);
    const navigate = useNavigate();
    const location = useLocation();
    let actualPath = location.pathname

    console.log("path", path);
    // code to redirect page after some time if not login
    useEffect(() => {

        // Initial navigation if count is already 0
        // if (count === 0) {
        //     navigate(`/${path}`);
        //     // return;
        // }
        // if (count > 0) {
        //     const interval = setInterval(() => {
        //         setCount((prevCount) => prevCount - 1);
        //     }, 100);
        // }
        // Update the condition to prevent unnecessary state updates
        // if (count === 0) {
        //     clearInterval(interval);
        //     navigate(`/${path}`);
        // }
        // return () => clearInterval(interval);
        navigate(`/${path}`);
    }, []);
    // code ends

    return (
        <div>
            <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "100vh" }}
            >
                <h1 className="text-center">
                    {" "}
                    redirecting to you in {count} second{" "}
                </h1>
                <div className="spinner-border" role="status">
                    <span className="sr-only"> </span>
                </div>
            </div>
        </div>
    );
};

export default Spinner;
