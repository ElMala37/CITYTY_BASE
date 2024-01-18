import React, { useState } from "react";

import {
  Autocomplete,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

import axios from "axios";

import { MapContainer, TileLayer, Popup, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";

const CityMap = () => {
  const [cities, setCities] = useState([]);
  const position = [47.394144, 0.68484]; //coordonnée de la ville de tours
  //const departement = 93;
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [location, setLocation] = useState(null);
  const [init, setInit] = useState(true);

  const getCity = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/city_map/?departement=${selectedDepartment.numero}`
      );
      setCities(response.data);
      //console.log(response.data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données de l'utilisateur :",
        error
      );
    }
  };

  const getCityNearby = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/city_map_nearby/?lat=${location.lat}&lng=${location.lng}`
      );
      setCities(response.data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données de l'utilisateur :",
        error
      );
      console.log("location");
    }
  };

  // Créez une icône personnalisée
  const customIcon = new L.Icon({
    iconUrl: require("../images/placeholder.png"), // Remplacez 'url_de_votre_icone.png' par l'URL de votre icône
    iconSize: [32, 32], // Définissez la taille de l'icône selon vos besoins
  });

  const customIconUser = new L.Icon({
    iconUrl: require("../images/user.png"), // Remplacez 'url_de_votre_icone.png' par l'URL de votre icône
    iconSize: [32, 32], // Définissez la taille de l'icône selon vos besoins
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedDepartment) {
      // Effectuer votre action de soumission ici
      //console.log('Département sélectionné :', selectedDepartment);
      //console.log("Département sélectionné :", selectedDepartment.numero);
      getCity();
    } else {
      alert("Aucun département sélectionné.");
    }
  };

  const CityNearby = () => {
    if (location !== null) {
      getCityNearby();
    } else {
      alert("Votre localisation n'est pas activée");
    }
  };

  const MarkerCity = () => {
    const map = useMap();
    map.locate();
    map.on("locationfound", (e) => {
      setLocation(e.latlng);
      //console.log("location");
      //console.log(location);
    });
    setInit(false);
    return null;
  };

  const frenchDepartments = [
    { label: "Ain (01)", numero: "01" },
    { label: "Aisne (02)", numero: "02" },
    { label: "Allier (03)", numero: "03" },
    { label: "Alpes-de-Haute-Provence (04)", numero: "04" },
    { label: "Hautes-Alpes (05)", numero: "05" },
    { label: "Alpes-Maritimes (06)", numero: "06" },
    { label: "Ardèche (07)", numero: "07" },
    { label: "Ardennes (08)", numero: "08" },
    { label: "Ariège (09)", numero: "09" },
    { label: "Aube (10)", numero: "10" },
    { label: "Aude (11)", numero: "11" },
    { label: "Aveyron (12)", numero: "12" },
    { label: "Bouches-du-Rhône (13)", numero: "13" },
    { label: "Calvados (14)", numero: "14" },
    { label: "Cantal (15)", numero: "15" },
    { label: "Charente (16)", numero: "16" },
    { label: "Charente-Maritime (17)", numero: "17" },
    { label: "Cher (18)", numero: "18" },
    { label: "Corrèze (19)", numero: "19" },
    { label: "Côte-d'Or (21)", numero: "21" },
    { label: "Côtes-d'Armor (22)", numero: "22" },
    { label: "Creuse (23)", numero: "23" },
    { label: "Dordogne (24)", numero: "24" },
    { label: "Doubs (25)", numero: "25" },
    { label: "Drôme (26)", numero: "26" },
    { label: "Eure (27)", numero: "27" },
    { label: "Eure-et-Loir (28)", numero: "28" },
    { label: "Finistère (29)", numero: "29" },
    { label: "Gard (30)", numero: "30" },
    { label: "Haute-Garonne (31)", numero: "31" },
    { label: "Gers (32)", numero: "32" },
    { label: "Gironde (33)", numero: "33" },
    { label: "Hérault (34)", numero: "34" },
    { label: "Ille-et-Vilaine (35)", numero: "35" },
    { label: "Indre (36)", numero: "36" },
    { label: "Indre-et-Loire (37)", numero: "37" },
    { label: "Isère (38)", numero: "38" },
    { label: "Jura (39)", numero: "39" },
    { label: "Landes (40)", numero: "40" },
    { label: "Loir-et-Cher (41)", numero: "41" },
    { label: "Loire (42)", numero: "42" },
    { label: "Haute-Loire (43)", numero: "43" },
    { label: "Loire-Atlantique (44)", numero: "44" },
    { label: "Loiret (45)", numero: "45" },
    { label: "Lot (46)", numero: "46" },
    { label: "Lot-et-Garonne (47)", numero: "47" },
    { label: "Lozère (48)", numero: "48" },
    { label: "Maine-et-Loire (49)", numero: "49" },
    { label: "Manche (50)", numero: "50" },
    { label: "Marne (51)", numero: "51" },
    { label: "Haute-Marne (52)", numero: "52" },
    { label: "Mayenne (53)", numero: "53" },
    { label: "Meurthe-et-Moselle (54)", numero: "54" },
    { label: "Meuse (55)", numero: "55" },
    { label: "Morbihan (56)", numero: "56" },
    { label: "Moselle (57)", numero: "57" },
    { label: "Nièvre (58)", numero: "58" },
    { label: "Nord (59)", numero: "59" },
    { label: "Oise (60)", numero: "60" },
    { label: "Orne (61)", numero: "61" },
    { label: "Pas-de-Calais (62)", numero: "62" },
    { label: "Puy-de-Dôme (63)", numero: "63" },
    { label: "Pyrénées-Atlantiques (64)", numero: "64" },
    { label: "Hautes-Pyrénées (65)", numero: "65" },
    { label: "Pyrénées-Orientales (66)", numero: "66" },
    { label: "Bas-Rhin (67)", numero: "67" },
    { label: "Haut-Rhin (68)", numero: "68" },
    { label: "Rhône (69)", numero: "69" },
    { label: "Haute-Saône (70)", numero: "70" },
    { label: "Saône-et-Loire (71)", numero: "71" },
    { label: "Sarthe (72)", numero: "72" },
    { label: "Savoie (73)", numero: "73" },
    { label: "Haute-Savoie (74)", numero: "74" },
    { label: "Paris (75)", numero: "75" },
    { label: "Seine-Maritime (76)", numero: "76" },
    { label: "Seine-et-Marne (77)", numero: "77" },
    { label: "Yvelines (78)", numero: "78" },
    { label: "Deux-Sèvres (79)", numero: "79" },
    { label: "Somme (80)", numero: "80" },
    { label: "Tarn (81)", numero: "81" },
    { label: "Tarn-et-Garonne (82)", numero: "82" },
    { label: "Var (83)", numero: "83" },
    { label: "Vaucluse (84)", numero: "84" },
    { label: "Vendée (85)", numero: "85" },
    { label: "Vienne (86)", numero: "86" },
    { label: "Haute-Vienne (87)", numero: "87" },
    { label: "Vosges (88)", numero: "88" },
    { label: "Yonne (89)", numero: "89" },
    { label: "Territoire de Belfort (90)", numero: "90" },
    { label: "Essonne (91)", numero: "91" },
    { label: "Hauts-de-Seine (92)", numero: "92" },
    { label: "Seine-Saint-Denis (93)", numero: "93" },
    { label: "Val-de-Marne (94)", numero: "94" },
    { label: "Val-d'Oise (95)", numero: "95" },
    { label: "Guadeloupe (971)", numero: "971" },
    { label: "Martinique (972)", numero: "972" },
    { label: "Guyane (973)", numero: "973" },
    { label: "La Réunion (974)", numero: "974" },
    { label: "Mayotte (976)", numero: "976" },
    { label: "Saint-Pierre-et-Miquelon (975)", numero: "975" },
    { label: "Nouvelle-Calédonie (988)", numero: "988" },
    { label: "Polynésie Française (987)", numero: "987" },
    { label: "Wallis-et-Futuna (986)", numero: "986" },
  ];

  return (
    <div className="map-box">
      <div className="boite-city-autour">
        <div className="city_autour">
          <Button
            variant="contained"
            className="button-nav-bar"
            color="secondary"
            onClick={() => CityNearby()}
          >
            Voir les city autour de moi
          </Button>
        </div>
        <FormControl >
          <InputLabel id="demo-simple-select-label">Distance</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            //value={distance}
            label="Distance"
            //onChange={handleDistance}
          >
            <MenuItem value={10}>10 km</MenuItem>
            <MenuItem value={20}>20 km</MenuItem>
            <MenuItem value={30}>30 km</MenuItem>
          </Select>
        </FormControl>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="search_bar">
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={frenchDepartments}
            sx={{ width: 400 }}
            value={selectedDepartment}
            onChange={(event, newValue) => setSelectedDepartment(newValue)}
            renderInput={(params) => (
              <div className="departement-bar">
                <div className="textfield_bar">
                  <TextField
                    {...params}
                    label="Choisir un département"
                    variant="filled"
                  />
                </div>
                <div className="bouton-recherche-city">
                  <button type="submit">Rechercher</button>
                </div>
              </div>
            )}
          ></Autocomplete>
        </div>
      </form>

      <MapContainer
        center={position}
        zoom={5}
        style={{ height: "55vh", width: "50vw" }}
      >
        {init ? <MarkerCity /> : <div></div>}
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
        {location !== null ? (
          <Marker position={[location.lat, location.lng]} icon={customIconUser}>
            <Popup>Votre position</Popup>
          </Marker>
        ) : (
          <div></div>
        )}
      </MapContainer>
    </div>
  );
};

export default CityMap;
