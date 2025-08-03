import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { PersonCircle } from "react-bootstrap-icons";

const Header = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="px-3">
      <Container fluid>
        <Navbar.Brand className="d-flex align-items-center justify-content-center">
          <img
            src="https://ou.edu.vn/wp-content/uploads/2016/08/Logo.png"
            style={{ height: "40px", marginRight: "16px" }}
          />
          <div className="d-flex flex-column">
            <span
              className="fw-bold"
              style={{ fontSize: "20px", textTransform: "uppercase" }}
            >
              Hệ thống quản lý khóa luận tốt nghiệp
            </span>
          </div>
        </Navbar.Brand>
        <Nav className="ms-auto align-items-center">
          <PersonCircle size={28} className="me-2 text-white" />
          <span className="text-white">Nguyễn Văn B,</span>
          <a href="#" className="text-white">
            <span className="ms-2">Đăng xuất</span>
          </a>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
