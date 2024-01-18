import { Button, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from "axios";
import SendIcon from "@mui/icons-material/Send";

const ChannelsPage = ({ user, ws, setInRoom, room_name, room_surname, getSub }) => {
  const [DatasList, setDatasList] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const getMsg = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `http://localhost:8000/api/get_msg/?room_name=${room_name}`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        //console.log("message precedents:", response.data);
        setDatasList(response.data);
      } catch {
        alert("Erreur du serveur...");
      }
    };
    getMsg();
  }, [room_name]);

  ws.onopen = () => {}; //console.log("ws opened");
  ws.onmessage = (e) => {
    const data = JSON.parse(e.data);
    setDatasList((prevDatasList) => [...prevDatasList, data]);
  };
  ws.onclose = () => {}; //console.log("ws closed");
  const SendMessage = () => {
    ws.send(
      JSON.stringify({
        message: message,
        user: user.username,
      })
    );
    setMessage("");
  };

  const ExitFromRoom = () => {
    setInRoom(false);
  };

  const UnSub = async () => {
    let formField = new FormData();
    //same names as django database fields
    formField.append("city_id", room_name);
    const token = localStorage.getItem("token");
    try {
      await axios({
        method: "post",
        url: `http://localhost:8000/api/city_map/subscribe`,
        data: formField,
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      alert(
        "La déconnexion de cette conversation a bien été prise en compte !"
      );
    } catch {
      alert("Erreur du serveur...");
    }
    getSub();
    setInRoom(false);
  };

  return (
    <div className="room">
      <div className="titleRoom">
        <div className="titleText">{room_surname}</div>
        <div className="buttonSend">
          <Button
            variant="contained"
            margin="normal"
            onClick={() => ExitFromRoom()}
            color="secondary"
            sx={{ height: "7vh" }}
          >
            Retour
          </Button>
        </div>
        <div className="buttonSend">
          <Button
            variant="contained"
            margin="normal"
            onClick={() => UnSub()}
            color="error"
            sx={{ height: "7vh" }}
          >
            Se désabonner
          </Button>
        </div>
      </div>
      <div className="convBox">
        {DatasList.slice()
          .reverse()
          .map(
            (
              d,
              index //.slice() sert a faire une copie de la liste afin de ne pas inverser l'ordre de la liste originale
            ) => (
              <div key={index}>
                {user.username === d.user ? (
                  <div className="bulleUser">
                    <text className="textBulle">{d.message}</text>
                  </div>
                ) : (
                  <div>
                    <text className="infoUser">{d.user}</text>
                    <div className="bulle">
                      <text className="textBulle">{d.message}</text>
                    </div>
                  </div>
                )}
              </div>
            )
          )}
      </div>
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

export default ChannelsPage;
