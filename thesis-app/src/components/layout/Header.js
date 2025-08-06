import React, { useContext } from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { PersonCircle } from "react-bootstrap-icons";
import { UserContext } from "../../configs/Contexts";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [user, dispatch] = useContext(UserContext);
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
          {user.avatar ? (
            <img
              src={user.avatar}
              style={{
                height: "32px",
                width: "32px",
                objectFit: "cover",
                marginRight: "8px",
                borderRadius: "50%",
                border: "1px solid white",
              }}
            />
          ) : (
            <PersonCircle size={28} className="me-2 text-white" />
          )}
          <Navbar.Collapse id="navbar-dark-example">
            <Nav>
              <NavDropdown
                id="nav-dropdown-dark-example"
                title={user.fullName}
                menuVariant="dark"
                drop="down-centered"
                align="end"
              >
                <NavDropdown.Item onClick={() => navigate("/profile")}>
                  Thông tin cá nhân
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item
                  onClick={() => {
                    dispatch({ type: "logout" });
                    navigate("/login");
                  }}
                >
                  Đăng xuất
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
          {/* <button
            className="text-white btn btn-danger ms-2"
            onClick={() => {
              dispatch({ type: "logout" });
              navigate("/login");
            }}
          >
            <span>Đăng xuất</span>
          </button> */}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
