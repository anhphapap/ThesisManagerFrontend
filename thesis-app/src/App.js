import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { UserContext } from "./configs/Contexts";
import UserReducer from "./reducers/UserReducer";
import { Container } from "react-bootstrap";
import Login from "./components/Login";
import { useReducer } from "react";
import Student from "./components/student/Student";
import Lecturer from "./components/lecturer/Lecturer";

const App = () => {
  let [user, dispatch] = useReducer(UserReducer, null);

  return(
    <UserContext.Provider value={[user, dispatch]}>
      <BrowserRouter>
      <Container>
        <Routes>
          <Route path="/login" element={<Login/>}/>
          <Route path="/students" element={<Student/>}/>
          <Route path="/lecturers" element={<Lecturer/>}/>
        </Routes>
      </Container>
      </BrowserRouter>

    </UserContext.Provider>
  )
}

export default App;
