import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import axios from "axios";

const ProfilPage = ({ user, setUser }) => {
  const [username, setUsername] = useState();

  const ChangeYourPassword = async () => {
    let formField = new FormData();
    //same names as django database fields
    formField.append("email", user.email);
    try {
      await axios({
        method: "post",
        url: `http://127.0.0.1:8000/api/forgotpassword/`,
        data: formField,
      });
      alert(`Un lien de réinitialisation a été envoyé à ${user.email}`);
    } catch {
      alert("Erreur de connexion, le lien de réinitialisation n'a pas été envoyé...");
    }
  };

  const ChangeUsername = async () => {
    let formField = new FormData();
    //same names as django database fields
    formField.append("username", username);
    const token = localStorage.getItem("token");
    try {
      await axios({
        method: "post",
        url: `http://127.0.0.1:8000/api/change_username/`,
        data: formField,
        headers: {
          Authorization: `Token ${token}`,
        },
      }).then((response) => {
        alert(response.data);
        fetchData();
      });
    } catch {
      alert("Ce nom d'utilisateur ne convient pas ou est déjà utilisé...");
    }
  };

  const fetchData = async () => {
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
      console.log(user)
      setUser(response.data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données de l'utilisateur :",
        error
      );
    }
  };

  return (
    <div className="profilPageBox">
      <text className="textProfil1">Email : {user.email}</text>
      <text className="textProfil1">Nom d'utilisateur : {user.username}</text>
      <div className="boxChangePassword">
        <TextField
          id="password"
          label="Change your username"
          size="normal"
          variant="filled"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <div className="BoxValiderUsername">
          <Button variant="contained" onClick={() => ChangeUsername()}>
            Valider
          </Button>
        </div>
      </div>
      <Button variant="contained" onClick={() => ChangeYourPassword()}>
        Réinitialiser le mot de passe
      </Button>
    </div>
  );
};

export default ProfilPage;
