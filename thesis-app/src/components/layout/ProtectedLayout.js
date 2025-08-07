import { Navigate, Outlet } from "react-router-dom";

const ProtectedLayout = ({ user, allowedRoles }) => {
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === "STUDENT") return <Navigate to="/students/thesis" />;
    if (user.role === "ROLE_USER") return <Navigate to="/lecturers/thesis" />;
    if (user.role === "ROLE_STAFF") return <Navigate to="/staff/thesis" />;
  }

  return <Outlet />;
};

export default ProtectedLayout;
