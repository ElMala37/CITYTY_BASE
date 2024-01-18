import { Button, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";

const ChannelsPage = () => {
  const [newMessage, setNewMessage] = useState(null);
  const [MessageList,setMessageList] = useState([]);
  const [message, setMessage] = useState("");
  const roomName = "salle"; // Remplacez par le nom de votre salle
  const user = "Thomas";

  const ws = new WebSocket(`ws://localhost:8000/ws/chat/${roomName}/`);

  ws.onopen = () => console.log("ws opened");

  ws.onclose = () => console.log("ws closed");

  ws.onmessage = (e) => {
    const data = JSON.parse(e.data);
    setNewMessage(data);
  };

  const SendMessage = () => {
    ws.send(
      JSON.stringify({
        message: message,
        user: user,
      })
    );
  };

  useEffect(() => {
    if (newMessage){
      setMessageList((pm)=>[...pm,newMessage]);
    }
  }, [newMessage]);

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
      {MessageList.map((m,index) => (
        <h1 key={index}>{m.message}</h1>
      ))}
    </div>
  );
};

export default ChannelsPage;
