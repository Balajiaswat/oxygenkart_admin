import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./Components/Login/Login";
// import Dashboard from "./Components/Dashboard";
import Account from "./Pages/Account";
import User from "./Pages/User";
import Register from "./Pages/Register";
import ForgotPassword from "./Components/ForgotPassword";
import ResetPassword from "./Components/ResetPassword";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard/*" element={<Account />} />
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user" element={<User />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset/:id" element={<ResetPassword />} />
        </Routes>
        {/* <Footer /> */}
      </BrowserRouter>
    </div>
  );
}

export default App;
