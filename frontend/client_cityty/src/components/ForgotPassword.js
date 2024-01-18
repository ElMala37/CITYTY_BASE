import Button from "@mui/material/Button";
import { Card } from "react-bootstrap";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { TextField } from "@mui/material";
import React, { useState } from "react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  const GoToSignIn = () => {
    navigate("/signin");
  };

  const SendLink = async () => {
    let formField = new FormData();

    //same names as django database fields
    formField.append("email", email);

    //met le loader en route
    setIsLoading(true);

    try {
      await axios({
        method: "post",
        url: `http://127.0.0.1:8000/api/forgotpassword/`,
        data: formField,
      }).then((response) => {
        console.log(response.data);
        alert(`Un lien de réinitialisation a été envoyé à ${email}`);
        navigate("/signin");
      });
    } catch {
      alert("Cette adresse email n'appartient à aucun compte ou est invalide...");
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
            <h2 className="email-title">
              We will send a link by email to reset your password
            </h2>
            <TextField
              id="email"
              label="Enter your email"
              size="normal"
              variant="filled"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />
            {isLoading ? (
              <div className="loader">
                <CircularProgress color="success" />
              </div>
            ) : (
              <div className="container-button_form">
                <div className="button_form">
                  <Button
                    variant="contained"
                    margin="normal"
                    fullWidth
                    color="success"
                    onClick={() => SendLink()}
                  >
                    Send
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

export default ForgotPassword;
