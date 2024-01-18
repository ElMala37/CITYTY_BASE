import React, { useEffect, useState } from "react";

import { Button, Divider, IconButton, InputBase, Paper } from "@mui/material";
import { Directions, Menu, Search } from "@mui/icons-material";

import axios from "axios";

import { MapContainer, TileLayer, Popup, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";

const CityMap = () => {
  const [cities, setCities] = useState([]);
  const position = [47.394144, 0.68484]; //coordonnée de la ville de tours

  const getCity = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/city_map/");
      setCities(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données de l'utilisateur :",
        error
      );
    }
  };

  // Créez une icône personnalisée
  const customIcon = new L.Icon({
    iconUrl: require("../images/placeholder.png"), // Remplacez 'url_de_votre_icone.png' par l'URL de votre icône
    iconSize: [32, 32], // Définissez la taille de l'icône selon vos besoins
  });

  useEffect(() => {
    getCity();
  }, []);

  return (
    <div className="map-box">
      <div className="search_bar">
        <Paper
          component="form"
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: 400,
          }}
        >
          <IconButton sx={{ p: "10px" }} aria-label="menu">
            <Menu />
          </IconButton>
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search a city"
            inputProps={{ "aria-label": "search google maps" }}
          />
          <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
            <Search />
          </IconButton>
          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
          <IconButton
            color="primary"
            sx={{ p: "10px" }}
            aria-label="directions"
          >
            <Directions />
          </IconButton>
        </Paper>
      </div>
      <MapContainer
        center={position}
        zoom={11}
        style={{ height: "55vh", width: "50vw" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup>
          {cities.map((city) => (
            <Marker key={city.id} position={[city.latitude,city.longitude]} icon={customIcon}>
                <Popup>
                    {city.name}<br/>{city.ville} {city.code_postal}<br/>
                    <Button variant="contained" >Rejoindre le canal</Button>
                </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};

export default CityMap;
