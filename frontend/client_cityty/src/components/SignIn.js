import React, { useState } from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router";
import { Card } from "react-bootstrap";
import { motion } from "framer-motion";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { CircularProgress } from "@mui/material";

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // Nouveau state pour stocker le jeton d'accès
  //const [token, setToken] = useState(null);

  const GoToSignUp = () => {
    navigate("/signup");
  };

  const GoToForgotPassword = () => {
    navigate("/forgotpassword");
  };

  const GoToMemberPage = async () => {
    let formField = new FormData();

    //same names as django database fields
    formField.append("email", email);
    formField.append("password", password);
    //console.log(formField);

    //met le loader en route
    setIsLoading(true);

    try {
      await axios({
        method: "post",
        url: `http://127.0.0.1:8000/api/signin/`,
        data: formField,
      }).then((response) => {
        console.log(response.data);
        // Stocker le jeton d'accès dans le stockage local
        localStorage.setItem("token", response.data.token);
        navigate("/");
      });
    } catch {
      alert("Erreur d'authentification...");
    } finally {
      setIsLoading(false); //Desactive le loader
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            {isLoading ? (
              <div className="loader">
                <CircularProgress color="success" />
              </div>
            ) : (
              <div className="container-button_form">
                <div className="button_form">
                  <Button
                    variant="text"
                    margin="normal"
                    fullWidth
                    onClick={() => GoToForgotPassword()}
                  >
                    Forgot Password ?
                  </Button>
                </div>
                <div className="button_form">
                  <Button
                    variant="contained"
                    margin="normal"
                    onClick={() => GoToMemberPage()}
                    fullWidth
                    color="success"
                  >
                    Sign In
                  </Button>
                </div>

                <div className="button_form">
                  <Button
                    variant="contained"
                    margin="normal"
                    onClick={() => GoToSignUp()}
                    fullWidth
                    color="info"
                  >
                    Sign Up
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

export default SignIn;
