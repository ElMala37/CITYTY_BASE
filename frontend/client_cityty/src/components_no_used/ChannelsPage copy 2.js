import { Button, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const ChannelsPage = () => {
  const [DatasList,setDatasList] = useState([]);
  const [message, setMessage] = useState("");
  const roomName = "salle"; // Remplacez par le nom de votre salle
  const user = "Thomas";

  //const ws = new WebSocket(`ws://localhost:8000/ws/chat/${roomName}/`);
  const socket = io(`ws://localhost:8000/ws/chat/${roomName}/`);

  socket.on("connect", () => {
    console.log("Socket.IO connected");
  });
  
  socket.on("disconnect", () => {
    console.log("Socket.IO disconnected");
  });
  
  socket.on("message", (data) => {
    setDatasList(data);
  });

  const SendMessage=()=>{
    socket.emit(JSON.stringify({
      message: message,
      user: user,
    }));
  }

  return (
    <div>
      <h1>Page des chats</h1>
      <TextField
        id="message"
        label="Enter message"
        size="normal"
        variant="filled"
        margin="normal"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button
        variant="contained"
        margin="normal"
        onClick={() => SendMessage()}
        color="success"
      >
        Send Message
      </Button>
      {DatasList.map((d,index) => (
        <h1 key={index}>{d.message}</h1>
      ))}
    </div>
  );
};

export default ChannelsPage;
