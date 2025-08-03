import Base from "./components/Base";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Thesis from "./components/views/Thesis";
import Committee from "./components/views/Committee";
import Test from "./components/views/Test";

function App() {
  return (
    <BrowserRouter>
      <Base>
        <Routes>
          <Route path="/thesis" element={<Thesis />} />
          <Route path="/committee" element={<Committee />} />
          <Route path="/test" element={<Test />} />
        </Routes>
      </Base>
    </BrowserRouter>
  );
}

export default App;
