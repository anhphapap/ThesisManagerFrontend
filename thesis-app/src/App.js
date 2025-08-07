import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { UserContext } from "./configs/Contexts";
import UserReducer from "./reducers/UserReducer";
import Login from "./components/Login";

import Lecturer from "./components/views/lecturer/Lecturer";
import Council from "./components/views/staff/Council";
import LecturerThesis from "./components/views/lecturer/LecturerThesis";
import Base from "./components/Base";
import StudentThesis from "./components/views/student/StudentThesis";
import StaffThesis from "./components/views/staff/StaffThesis";
import Profile from "./components/views/Profile";
import ProtectedLayout from "./components/layout/ProtectedLayout";
import { useReducer, useEffect } from "react";

const App = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  let [user, dispatch] = useReducer(UserReducer, storedUser || null);

  console.log("user", user);
  return (
    <UserContext.Provider value={[user, dispatch]}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={user ? <Navigate to={"/"} /> : <Login />}
          />

          <Route
            element={
              <ProtectedLayout
                user={user}
                allowedRoles={["STUDENT", "ROLE_USER", "ROLE_STAFF"]}
              />
            }
          >
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route
            element={<ProtectedLayout user={user} allowedRoles={["STUDENT"]} />}
          >
            <Route path="/students/thesis" element={<StudentThesis />} />
          </Route>

          <Route
            element={
              <ProtectedLayout user={user} allowedRoles={["ROLE_USER"]} />
            }
          >
            <Route path="/lecturers/thesis" element={<LecturerThesis />} />
          </Route>

          <Route
            element={
              <ProtectedLayout user={user} allowedRoles={["ROLE_STAFF"]} />
            }
          >
            <Route path="/staff/thesis" element={<StaffThesis />} />
            <Route path="/staff/councils" element={<Council />} />
          </Route>

          <Route
            path="*"
            element={
              <Navigate
                to={
                  user
                    ? `/${
                        user.role === "ROLE_USER"
                          ? "lecturers"
                          : user.role === "ROLE_STAFF"
                          ? "staff"
                          : "students"
                      }/thesis`
                    : "/login"
                }
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
};

export default App;
