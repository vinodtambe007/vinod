import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home.js";
import Register from "./pages/Register.js";
import LoginForm from "./pages/LoginForm.js";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<LoginForm />} />
          <Route path="/register-user" element={<Register />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
