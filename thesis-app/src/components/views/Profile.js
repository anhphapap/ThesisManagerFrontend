import React, { useContext, useEffect, useState } from "react";
import Base from "../Base";
import { UserContext } from "../../configs/Contexts";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Spinner,
  Modal,
} from "react-bootstrap";
import { authApis, endpoints } from "../../configs/Apis";

function Profile() {
  const [user, dispatch] = useContext(UserContext);
  const [form, setForm] = useState();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [passwordInput, setPasswordInput] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    setForm(user);
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append(
        "user",
        new Blob([JSON.stringify(form)], { type: "application/json" })
      );
      formData.append("file", form?.file);
      console.log(formData);
      const response = await authApis().post(endpoints.updateUser, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      dispatch({ type: "update", payload: form });
      alert("Cập nhật thành công!");
    } catch (err) {
      alert(err.response?.data?.message || "Đã xảy ra lỗi!");
    }
    setLoading(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (passwordInput.newPassword !== passwordInput.confirmPassword) {
        alert("Mật khẩu mới và xác nhận mật khẩu mới không khớp!");
        setLoading(false);
        return;
      }
      const response = await authApis().post(endpoints.changePassword, {
        ...passwordInput,
        role: user.role,
        id: user.id,
      });
      alert("Đổi mật khẩu thành công!");
      handleClose();
    } catch (err) {
      alert(err.response?.data?.message || "Đã xảy ra lỗi!");
    }
    setLoading(false);
  };

  return (
    <>
      <div className="d-flex flex-column justify-content-center">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h3 className="fw-bold">Thông tin cá nhân</h3>
        </div>
        <button
          className="btn btn-success text-white align-self-end me-5"
          onClick={handleShow}
        >
          Đổi mật khẩu
        </button>
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Đổi mật khẩu</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu cũ</Form.Label>
              <Form.Control
                type="password"
                value={passwordInput.oldPassword}
                onChange={(e) => {
                  setPasswordInput({
                    ...passwordInput,
                    oldPassword: e.target.value,
                  });
                }}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu mới</Form.Label>
              <Form.Control
                type="password"
                value={passwordInput.newPassword}
                onChange={(e) => {
                  setPasswordInput({
                    ...passwordInput,
                    newPassword: e.target.value,
                  });
                }}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Xác nhận mật khẩu mới</Form.Label>
              <Form.Control
                type="password"
                value={passwordInput.confirmPassword}
                onChange={(e) => {
                  setPasswordInput({
                    ...passwordInput,
                    confirmPassword: e.target.value,
                  });
                }}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Đóng
            </Button>
            <Button
              variant="primary"
              onClick={handleChangePassword}
              disabled={
                loading ||
                passwordInput.oldPassword === "" ||
                passwordInput.newPassword === "" ||
                passwordInput.confirmPassword === ""
              }
            >
              {loading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Lưu thay đổi"
              )}
            </Button>
          </Modal.Footer>
        </Modal>
        <Row className="justify-content-center">
          <Col className="px-5">
            <Form onSubmit={handleSubmit}>
              <div className="text-center mb-3">
                <img
                  src={form?.avatar}
                  alt="Avatar"
                  className="rounded-circle"
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                  }}
                />
                <Form.Group className="mt-2">
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      setForm({ ...form, file: e.target.files[0] });
                    }}
                  />
                </Form.Group>
              </div>

              <Form.Group className="mb-3">
                <Form.Label>Tên đăng nhập</Form.Label>
                <Form.Control type="text" value={form?.username} disabled />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Họ và tên</Form.Label>
                <Form.Control
                  type="text"
                  name="fullName"
                  value={form?.fullName}
                  onChange={(e) => {
                    setForm({ ...form, fullName: e.target.value });
                  }}
                  required
                />
              </Form.Group>
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Ngày sinh</Form.Label>
                    <Form.Control
                      type="date"
                      name="birthday"
                      value={form?.birthday}
                      onChange={(e) => {
                        setForm({ ...form, birthday: e.target.value });
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Giới tính</Form.Label>
                    <Form.Select
                      name="gender"
                      value={form?.gender}
                      onChange={(e) => {
                        setForm({ ...form, gender: e.target.value });
                      }}
                    >
                      <option value="">Chọn giới tính</option>
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={form?.email}
                  onChange={(e) => {
                    setForm({ ...form, email: e.target.value });
                  }}
                />
              </Form.Group>

              <div className="d-grid">
                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    "Lưu thay đổi"
                  )}
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Profile;
