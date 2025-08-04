import React, { useContext, useState } from "react";
import { Nav } from "react-bootstrap";
import {
  FileEarmarkText,
  PeopleFill,
  ChevronLeft,
  ChevronRight,
} from "react-bootstrap-icons";
import { UserContext } from "../../configs/Contexts";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState(window.location.pathname);
  const [user] = useContext(UserContext);

  const menuItems = [
    {
      icon: <FileEarmarkText />,
      label: "Quản lý khóa luận",
      path: "/students/thesis",
      role: "STUDENT",
    },
    {
      icon: <PeopleFill />,
      label: "Quản lý hội đồng",
      path: "/lecturers",
      role: "ROLE_USER",
    },
    {
      icon: <FileEarmarkText />,
      label: "Quản lý khóa luận",
      path: "/staff/thesis",
      role: "ROLE_STAFF",
    },
  ];

  return (
    <div
      className="d-flex flex-column text-white bg-dark"
      style={{
        width: collapsed ? "50px" : "220px",
        transition: "0.3s",
        height: "100%",
      }}
    >
      <Nav className="flex-column mt-2">
        {menuItems
          .filter((item) => item.role === user.role)
          .map((item, index) => (
            <Nav.Link
              key={index}
              href={item.path}
              className={`d-flex align-items-center px-3 py-2 ${
                active === item.path
                  ? "bg-light text-dark border-start border-3 border-danger"
                  : "text-white"
              }`}
              style={{ fontSize: "16px" }}
              onClick={() => setActive(item.path)}
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
