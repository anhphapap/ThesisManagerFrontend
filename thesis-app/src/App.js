import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { UserContext } from "./configs/Contexts";
import UserReducer from "./reducers/UserReducer";
import Login from "./components/Login";
import { useReducer, useEffect } from "react";
import Lecturer from "./components/views/lecturer/Lecturer";
import Base from "./components/Base";
import StudentThesis from "./components/views/student/StudentThesis";
import StaffThesis from "./components/views/staff/StaffThesis";
const App = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  let [user, dispatch] = useReducer(UserReducer, storedUser || null);
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);
  console.log("user", user);
  return (
    <UserContext.Provider value={[user, dispatch]}>
      <BrowserRouter>
        <Routes>
          {user != null ? (
            user.role === "STUDENT" ? (
              <Route path="/students/thesis" element={<StudentThesis />} />
            ) : user.role === "ROLE_USER" ? (
              <Route path="/lecturers" element={<Lecturer />} />
            ) : (
              <Route path="/staff/thesis" element={<StaffThesis />} />
            )
          ) : (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="" element={<Navigate to="/login" />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
};

export default App;
