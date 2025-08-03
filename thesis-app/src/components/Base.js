import React from "react";
import Header from "./layout/Header";
import Sidebar from "./layout/SideBar";

const Base = ({ children }) => {
  return (
    <div className="d-flex flex-column" style={{ height: "100vh" }}>
      <Header />
      <div className="d-flex" style={{ height: "100%" }}>
        <Sidebar />
        <div className="flex-grow-1 p-3" style={{ backgroundColor: "#f6f7fc" }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Base;
