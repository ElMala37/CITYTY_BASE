import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { Button } from "@mui/material";
import CityMap from "./CityMap";
import ChannelsPage from "./ChannelsPage";
import ProfilPage from "./ProfilPage";
import AddCityPage from "./AddCityPage";

const ChatPage = ({ notif }) => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const [page, setPage] = useState("chat");
  const [inRoom, setInRoom] = useState(false);
  const [sub, setSub] = useState([]);
  const [ws, setWs] = useState(null);
  const [room_name, setRoom_name] = useState("");
  const [room_surname, setRoom_surname] = useState("");

  notif.onopen = () => {}; //console.log("ws opened");
  notif.onmessage = (e) => {
    getSub();
  };
  notif.onclose = () => {}; //console.log("ws closed");

  const getSub = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`http://localhost:8000/api/get_sub`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setSub(
        response.data.sort(
          (a, b) => new Date(b.dateLastMsg) - new Date(a.dateLastMsg)
        )
      );
      console.log(response.data);
    } catch {
      alert("Erreur du serveur...");
    }
  };

  useEffect(() => {
    getSub();
  }, []);

  const handleChannel = () => {
    setPage("chat");
  };

  const handleMap = () => {
    setPage("city_map");
  };

  const handleAdd = () => {
    setPage("add");
  };

  const handleProfil = () => {
    setPage("profil");
  };

  const handleLogout = () => {
    alert("Vous vous êtes déconnecté de : " + user.email);
    try {
      ws.close();
    } catch {}
    localStorage.removeItem("token");
    navigate("/signin");
  };

  useEffect(() => {
    // Fonction asynchrone pour charger les données de l'utilisateur
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

  const GoToRoom = (room_name, room_surname) => {
    setWs(new WebSocket(`ws://localhost:8000/ws/chat/${room_name}/`));
    setRoom_name(room_name);
    setRoom_surname(room_surname);
    setInRoom(true);
  };

  return (
    <div className="background-member-page">
      <div className="nav-bar">
        <div className="cityty-style-member-page">CITYTY</div>
        <div className="user-nav-bar">{user.email}</div>
      </div>
      <div className="nav-bar2">
        <div className="button-box-nav-bar">
          <Button
            variant="contained"
            className="button-nav-bar"
            onClick={() => handleChannel()}
          >
            Channels
          </Button>
        </div>
        <div className="button-box-nav-bar">
          <Button
            variant="contained"
            className="button-nav-bar"
            onClick={() => handleMap()}
          >
            Map
          </Button>
        </div>
        <div className="button-box-nav-bar">
          <Button
            variant="contained"
            className="button-nav-bar"
            onClick={() => handleProfil()}
          >
            Profil
          </Button>
        </div>
        <div className="button-box-nav-bar">
          <Button
            variant="contained"
            className="button-nav-bar"
            onClick={() => handleAdd()}
          >
            Add
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

      {page === "city_map" ? <CityMap getSub={getSub} /> : <div></div>}

      {page === "chat" ? (
        <div>
          {inRoom ? (
            <ChannelsPage
              user={user}
              ws={ws}
              notif={notif}
              setInRoom={setInRoom}
              room_name={room_name}
              room_surname={room_surname}
              getSub={getSub}
            />
          ) : (
            <div className="BoxHome">
              <h1>Page des chats</h1>
              <div className="roomButtonBox">
                {sub.map((s, index) => (
                    <button
                      onClick={() => GoToRoom(s.city_id, s.surname)}
                      className="conversation-button"
                      key={index}
                    >
                      {s.vue ===true ? (
                        <div className="InsideButton">
                          <text className="NameChannel">
                            {s.surname}, {s.ville}
                          </text>
                          {s.LastMsg !== null ? (
                            <div className="InsideButton">
                              <text className="NameChannel">
                                {s.userLastMsg} : {s.LastMsg}
                              </text>
                              {s.secLastMsg < 60 ? (
                                <text className="DateChannel">
                                  {s.secLastMsg}sec ago
                                </text>
                              ) : (
                                <div className="InsideButton">
                                  {s.minLastMsg < 60 ? (
                                    <text className="DateChannel">
                                      {s.minLastMsg}min ago
                                    </text>
                                  ) : (
                                    <div className="InsideButton">
                                      {s.heuresLastMsg < 24 ? (
                                        <text className="DateChannel">
                                          {s.heuresLastMsg}h ago
                                        </text>
                                      ) : (
                                        <text className="DateChannel">
                                          {s.joursLastMsg}d ago
                                        </text>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div></div>
                          )}
                        </div>
                      ) : (
                        <div className="InsideButton">
                          <text className="NameChannelBold">
                            {s.surname}, {s.ville}
                          </text>
                          {s.LastMsg !== null ? (
                            <div className="InsideButton">
                              <text className="NameChannelBold">
                                {s.userLastMsg} : {s.LastMsg}
                              </text>
                              {s.secLastMsg < 60 ? (
                                <text className="DateChannelBold">
                                  {s.secLastMsg}sec ago
                                </text>
                              ) : (
                                <div className="InsideButton">
                                  {s.minLastMsg < 60 ? (
                                    <text className="DateChannelBold">
                                      {s.minLastMsg}min ago
                                    </text>
                                  ) : (
                                    <div className="InsideButton">
                                      {s.heuresLastMsg < 24 ? (
                                        <text className="DateChannelBold">
                                          {s.heuresLastMsg}h ago
                                        </text>
                                      ) : (
                                        <text className="DateChannelBold">
                                          {s.joursLastMsg}d ago
                                        </text>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div></div>
                          )}
                        </div>
                      )}
                    </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div></div>
      )}

      {page === "profil" ? (
        <ProfilPage user={user} setUser={setUser} />
      ) : (
        <div></div>
      )}

      {page === "add" ? <AddCityPage user={user} /> : <div></div>}
    </div>
  );
};

export default ChatPage;
