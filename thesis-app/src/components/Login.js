import { useContext, useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserContext } from "../configs/Contexts";
import Apis, { authApis, endpoints } from "../configs/Apis";
import cookie from "react-cookies";
import "../assets/css/Login.css";

const Login = () => {
  const [, dispatch] = useContext(UserContext);

  const info = [
    {
      title: "Tên đăng nhập",
      field: "username",
      type: "text",
    },
    {
      title: "Mật khẩu",
      field: "password",
      type: "password",
    },
  ];

  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const [role, setRole] = useState("student");
  const nav = useNavigate();
  const [q] = useSearchParams();
  const [loading, setLoading] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let res = await Apis.post(endpoints.login, {
        ...user,
        role: role,
      });
      cookie.save("token", res.data.token);
      let u = await authApis().get(endpoints.profile);

      dispatch({ type: "login", payload: u.data });

      let next = q.get("next");
      if (next) {
        nav(next);
      } else {
        if (role === "student") {
          nav("/students/thesis");
        } else if (role === "lecturer") {

          nav("/lecturers/thesis");
        } else {
          nav("/staff/thesis");
        }
      }
    } catch (error) {
      console.error("Login Error:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Đăng nhập</h1>
        <Form onSubmit={login}>
          <Form.Group className="form-group" controlId="role">
            <Form.Label className="form-label">Vai trò</Form.Label>
            <Form.Select
              className="form-control"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="student">Sinh viên</option>
              <option value="lecturer">Giảng viên</option>
              <option value="staff">Giáo vụ</option>
            </Form.Select>
          </Form.Group>
          {info.map((i) => (
            <Form.Group
              className="form-group"
              key={i.field}
              controlId={i.field}
            >
              <Form.Label className="form-label">{i.title}</Form.Label>
              <Form.Control
                className="form-control"
                required
                type={i.type}
                placeholder={i.title}
                onChange={(e) =>
                  setUser({ ...user, [i.field]: e.target.value })
                }
                value={user[i.field]}
              />
            </Form.Group>
          ))}

          <Button type="submit" className="submit-btn" disabled={loading}>
            <span className="submit-btn-text">Submit</span>
            {loading && (
              <span className="submit-btn-loading">
                <Spinner animation="border" variant="light" size="sm" />
              </span>
            )}
          </Button>
          <p className="forgot-password">
            Forgot <a href="#">password?</a>
          </p>
        </Form>
      </div>
    </div>
  );
};

export default Login;
