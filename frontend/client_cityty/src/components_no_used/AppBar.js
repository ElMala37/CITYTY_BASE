import { Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const AppBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="nav-bar">
      <div className="cityty-style-member-page">CITYTY</div>
      <div className="nav-bar2">
        <div className="button-box-nav-bar">
          <Button variant="contained" className="button-nav-bar">
            Map
          </Button>
        </div>
        <div className="button-box-nav-bar">
          <Button variant="contained" className="button-nav-bar">
            Channels
          </Button>
        </div>
        <div className="button-box-nav-bar">
          <Button variant="contained" className="button-nav-bar">
            Add
          </Button>
        </div>
        <div className="button-box-nav-bar">
          <Button variant="contained" className="button-nav-bar">
            Profil
          </Button>
        </div>
        <div className="button-box-nav-bar">
          <Button
            variant="contained"
            color="error"
            className="button-nav-bar"
            onClick={() => handleLogout()}
          >
            LogOut
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AppBar;
