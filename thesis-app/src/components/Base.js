import React from "react";
import Header from "./layout/Header";
import Sidebar from "./layout/SideBar";

const Base = () => {
  return (
    <div>
      <Header />
      <div className="d-flex">
        <Sidebar />
        <div
          className="flex-grow-1 p-3"
          style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
        >
          <p>Nội dung chính</p>
        </div>
      </div>
    </div>
  );
};

export default Base;
