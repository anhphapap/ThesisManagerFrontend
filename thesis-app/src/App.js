import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { UserContext } from "./configs/Contexts";
import UserReducer from "./reducers/UserReducer";
import Login from "./components/Login";
import { useReducer } from "react";
import Lecturer from "./components/views/lecturer/Lecturer";
import Council from "./components/views/council/Council";
import Thesis from "./components/views/student/Thesis";
const App = () => {
  let [user, dispatch] = useReducer(UserReducer, null);
  console.log("user", user);
  return (
    <UserContext.Provider value={[user, dispatch]}>
      <BrowserRouter>
        <Routes>
          {user != null ? (
            user.role === "STUDENT" ? (
              <Route path="/students" element={<Thesis />} />
            ) : user.role === "ROLE_USER" ? (
              <Route path="/lecturers" element={<Lecturer />} />
            ) : ( 
              
              <Route path="/councils" element={<Council />} />
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
