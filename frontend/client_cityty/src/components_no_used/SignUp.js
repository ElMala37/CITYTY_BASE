import React, { useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router";
import { Card } from "react-bootstrap";
import { motion } from "framer-motion";
import { TextField } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); //de base le loader est désactivé

  const GoToSignIn = () => {
    navigate("/");
  };

  const GoToConfirmMail = async () => {
    if (password === password2 && password !== "" && email !== "") {
      let formField = new FormData();

      //same names as django database fields
      formField.append("email", email);
      formField.append("password", password);
      console.log(formField);

      //met le loader en route
      setIsLoading(true);

      try {
        await axios({
          method: "post",
          url: `http://127.0.0.1:8000/api/inscription/`,
          data: formField,
        }).then((response) => {
          console.log(response.data);
          navigate("/mailconfirm");
        });
      } catch {
        alert("Adresse email invalide...");
      } finally {
        setIsLoading(false); //Desactive le loader
      }
    } else {
      alert("Les mots de passe ne correspondent pas...");
    }
  };

  return (
    <div className="background_signin">
      <motion.div
        initial={{ y: "5vh" }}
        animate={{ y: 0 }}
        transition={{ duration: 1, type: "spring", stiffness: 100 }}
      >
        <Card
          border="success"
          style={{ width: "24rem" }}
          className="card_signin"
        >
          <Card.Header className="cityty_style">Cityty</Card.Header>
          <Card.Body style={{ width: "18rem" }}>
            <TextField
              id="email"
              size="normal"
              label="Enter email"
              variant="filled"
              fullWidth
              margin="normal"
              value={email} // Utilisez la valeur de l'état pour l'e-mail
              onChange={(e) => setEmail(e.target.value)} // Mettez à jour l'état avec la valeur entrée
            />
            <TextField
              id="password"
              label="Enter password"
              size="normal"
              type="password"
              autoComplete="current-password"
              variant="filled"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              id="password2"
              label="Confirm password"
              size="normal"
              type="password"
              autoComplete="current-password"
              variant="filled"
              fullWidth
              margin="normal"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
            />
            {isLoading ? (
              <div className="loader" >
                <CircularProgress color="success"/>
              </div>
            ) : (
              <div className="container-button_form">
                <div className="button_form">
                  <Button
                    variant="contained"
                    margin="normal"
                    onClick={() => GoToConfirmMail()}
                    fullWidth
                    color="success"
                  >
                    Submit
                  </Button>
                </div>

                <div className="button_form">
                  <Button
                    variant="contained"
                    margin="normal"
                    onClick={() => GoToSignIn()}
                    fullWidth
                    color="secondary"
                  >
                    Back
                  </Button>
                </div>
              </div>
            )}
          </Card.Body>
        </Card>
      </motion.div>
    </div>
  );
};

export default SignUp;
