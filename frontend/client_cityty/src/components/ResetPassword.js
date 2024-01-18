import React, { useState } from "react";
import axios from "axios";
import { Button, CircularProgress, TextField } from "@mui/material";
import { Card } from "react-bootstrap";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { uid, token } = useParams();

  const resetPassword = async () => {
    if (password === password2) {
      let formField = new FormData();

      //same names as django database fields
      formField.append("new_password", password);
      formField.append("token", token);
      formField.append("uid", uid);
      console.log(formField);

      //met le loader en route
      setIsLoading(true);

      try {
        await axios({
          method: "post",
          url: `http://127.0.0.1:8000/api/resetpassword/`,
          data: formField,
        }).then((response) => {
          console.log(response.data);
          alert("Votre mot de passe a été modifié !");
          navigate("/signin");
        });
      } catch {
        alert("Le lien n'est plus valide...");
      } finally {
        setIsLoading(false); //Desactive le loader
      }
    } else {
      alert("Les deux mots de passe ne sont pas identiques !");
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
              id="password"
              label="Enter password"
              size="normal"
              type="password"
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
              variant="filled"
              fullWidth
              margin="normal"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
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
                    onClick={() => resetPassword()}
                    fullWidth
                    color="secondary"
                  >
                    Submit
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

export default ResetPassword;
