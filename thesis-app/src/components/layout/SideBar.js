import React, { useState } from "react";
import { Nav } from "react-bootstrap";
import {
  House,
  People,
  PersonBadge,
  FileEarmarkText,
  PeopleFill,
  BarChart,
  Gear,
  ChevronLeft,
  ChevronRight,
} from "react-bootstrap-icons";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { icon: <House />, label: "Quản lý đào tạo" },
    { icon: <PersonBadge />, label: "Quản lý giảng viên" },
    { icon: <People />, label: "Quản lý sinh viên" },
    { icon: <FileEarmarkText />, label: "Quản lý khóa luận" },
    { icon: <PeopleFill />, label: "Quản lý hội đồng" },
    { icon: <BarChart />, label: "Tổng quan" },
    { icon: <Gear />, label: "Thiết lập hệ thống" },
  ];

  return (
    <div
      className="d-flex flex-column bg-primary text-white"
      style={{
        width: collapsed ? "60px" : "220px",
        transition: "0.3s",
      }}
    >
      <Nav className="flex-column mt-2">
        {menuItems.map((item, index) => (
          <Nav.Link
            key={index}
            href="#"
            className="d-flex align-items-center text-white px-3 py-2"
            style={{ fontSize: "14px" }}
          >
            {item.icon}
            {!collapsed && <span className="ms-2">{item.label}</span>}
          </Nav.Link>
        ))}
      </Nav>
      <div
        className="mt-auto text-center py-2 border-top"
        style={{ cursor: "pointer" }}
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight /> : <ChevronLeft />}
        {!collapsed && <span className="ms-2">Thu gọn</span>}
      </div>
    </div>
  );
};

export default Sidebar;
