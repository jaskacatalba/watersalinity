import React from "react";
import { Outlet } from "react-router-dom";
import ViewerHeader from "../components/ViewerHeader";

const FrontPageLayout = () => {
  return (
    <>
      <ViewerHeader />
      <Outlet />
    </>
  );
};

export default FrontPageLayout;
