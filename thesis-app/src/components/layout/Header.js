import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { PersonCircle } from "react-bootstrap-icons";

const Header = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="px-3">
      <Container fluid>
        <Navbar.Brand className="d-flex align-items-center">
          <img
            src="/logo.png"
            alt="logo"
            style={{ height: "30px", marginRight: "8px" }}
          />
          <div className="d-flex flex-column">
            <span className="fw-bold">Trường Đại học Công nghệ - ĐHQGHN</span>
            <small className="text-white-50">
              Hệ thống quản lý khóa luận tốt nghiệp
            </small>
          </div>
        </Navbar.Brand>
        <Nav className="ms-auto align-items-center">
          <PersonCircle size={28} className="me-2 text-white" />
          <span className="text-white">Nguyễn Văn B</span>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
