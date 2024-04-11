import React from "react";
import Layout from "../../components/layout/Layout";
import UsersMenu from "./UsersMenu";

const Profile = () => {
  return (
    <Layout title="Profile - E-comm">
      <div className="container-fluid p-4 m-0">
        <div className="row">
          <div className="col-md-3">
            <UsersMenu />
          </div>
          <div className="col-md-9">
            <h1>Your Profile</h1>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
