import "./App.css";
import "./Connect.css";
import "./MemberPage.css";
import "./Chat.css";
import ForgotPassword from "./components/ForgotPassword";
import MemberPage from "./components/MemberPage";
import ResetPassword from "./components/ResetPassword";
import SignIn from "./components/SignIn";
import SignUp2 from "./components/SignUp2";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {

  //a modifier plus tard, il faudrait mettre un date d'expiration au token
  //window.addEventListener("beforeunload", function () {
    // Supprimez le token ici
    //localStorage.removeItem("token");
  //});

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/signin" element={<SignIn />} />
          <Route exact path="/signup" element={<SignUp2 />} />
          <Route exact path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/reset-password/:uid/:token" element={<ResetPassword/>} />
          <Route exact path="/" element={<MemberPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
