import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";

const AddCityPage = ({user}) => {
  const [message, setMessage] = useState();

  const SendMessage = async () => {
    const token = localStorage.getItem("token");
    let formField = new FormData();
    formField.append("email", user.email);
    formField.append("message", message);
    try {
      await axios({
        method: "post",
        url: `http://127.0.0.1:8000/api/addcity/`,
        data: formField,
        headers: {
            Authorization: `Token ${token}`,
          },
      }).then((response) => {
        alert(response.data);
      });
    } catch {
      alert(
        "Erreur de connexion..."
      );
    }finally{
        setMessage("");
    }
  };

  return (
    <div className="addCityBox">
      <text className="textaddCity1">Un city n'est pas sur la carte ?</text>
      <text className="textaddCity2">Envie de le rajouter ?</text>
      <text className="textaddCity3">
        Donnez nous un max d'info sur votre city (adresse, ville, nom du city)
        pour qu'on puisse le rajouter dans les plus bref delais!
      </text>
      <div className="buttonBoxChat">
        <TextField
          id="message"
          label="Enter message"
          size="normal"
          variant="filled"
          margin="normal"
          multiline
          maxRows={5}
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          sx={{ height: "10vh" }}
        />
        <div className="buttonSend">
          <Button
            variant="contained"
            margin="normal"
            onClick={() => SendMessage()}
            //color="success"
            endIcon={<SendIcon />}
            sx={{ height: "7vh" }}
          ></Button>
        </div>
      </div>
    </div>
  );
};

export default AddCityPage;
