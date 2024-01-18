import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { Button } from "@mui/material";
import CityMap from "../components/CityMap";

const MemberPage = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const [city_map,setCity_map] = useState(true)

  const handleChannel = () => {
    setCity_map(false);
  };

  const handleMap = () => {
    setCity_map(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  useEffect(() => {
    // Fonction asynchrone pour charger les données de l'utilisateur
    const fetchData = async () => {
      // Récupérer le jeton d'accès depuis le stockage local
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(
          "http://localhost:8000/api/user_profil/",
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        setUser(response.data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données de l'utilisateur :",
          error
        );
        navigate("/signin");
      }
    };

    fetchData(); // Appeler la fonction fetchData lorsque le composant est monté.
  }, [navigate]); // Assurez-vous que fetchData soit appelée uniquement lorsque navigate change.

  return (
    <div className="background-member-page">
      <div className="nav-bar">
        <div className="cityty-style-member-page">CITYTY</div>
        <div className="user-nav-bar">{user.email}</div>
      </div>
      <div className="nav-bar2">
        <div className="button-box-nav-bar">
          <Button variant="contained" className="button-nav-bar" onClick={() => handleMap()}>
            Map
          </Button>
        </div>
        <div className="button-box-nav-bar">
          <Button variant="contained" className="button-nav-bar" onClick={() => handleChannel()}>
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
      {city_map ? <CityMap /> : <h1>Page des chats</h1>}
    </div>
  );
};

export default MemberPage;
