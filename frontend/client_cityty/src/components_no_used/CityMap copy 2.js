import React, { useEffect, useState } from "react";

import { Button, Divider, IconButton, InputBase, Paper } from "@mui/material";
import { Directions, Menu, Search } from "@mui/icons-material";

import axios from "axios";

import { MapContainer, TileLayer, Popup, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import { useMap, useMapEvent } from "react-leaflet/hooks";

const CityMap = () => {
  const [cities, setCities] = useState([]);
  const position = [47.394144, 0.68484]; //coordonnée de la ville de tours
  const [init, setInit] = useState(false);

  const MapInit = async () => {
    const map = useMap();
    const bounds = map.getBounds();
    //console.log("map bounds INIT:", map.getBounds());
    getCity(bounds);
    setInit(true); //warning car risque de boucle infini, mais tout va bien si on fait attention
    return null;
  };

  const MapUpdate = () => {
    const map = useMapEvent("moveend", () => {
      //moveend, a chaque fin de mouvement sur la carte, une action se déclenche
      //console.log("map center:", map.getBounds());
      const bounds = map.getBounds(); //recupère les bord de la carte visible
      console.log("map bounds:", bounds);
      console.log(
        "map latMax:",
        bounds._northEast.lat,
        ",map latMin:",
        bounds._southWest.lat,
        ",map lngMax:",
        bounds._northEast.lng,
        ",map lngMin:",
        bounds._southWest.lng
      );
    });
    return null;
  };

  const getCity = async (bounds) => {
    try {
      const response = await axios.get("http://localhost:8000/api/city_map/", {
        headers: {
          LatMax: `${bounds._northEast.lat}`,
          LatMin: `${bounds._southWest.lat}`,
          LngMax: `${bounds._northEast.lng}`,
          LngMin: `${bounds._southWest.lng}`,
        },
      });
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
        {init ? <MapUpdate /> : <MapInit />}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup>
          {cities.map((city) => (
            <Marker
              key={city.id}
              position={[city.latitude, city.longitude]}
              icon={customIcon}
            >
              <Popup>
                {city.name}
                <br />
                {city.ville} {city.code_postal}
                <br />
                <Button variant="contained">Rejoindre le canal</Button>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};

export default CityMap;
