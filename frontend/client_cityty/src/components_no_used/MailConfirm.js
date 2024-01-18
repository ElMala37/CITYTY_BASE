import Button from "@mui/material/Button";
import { Card } from "react-bootstrap";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { TextField } from "@mui/material";
import React, { useState } from "react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

const MailConfirm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [verification_code, setVerification_code] = useState("");

  const GoToSignUp = () => {
    navigate("/signup");
  };

  const GoToAccountPage = async () => {
    let formField = new FormData();

    //same names as django database fields
    formField.append("verification_code", verification_code);
    console.log(formField);

    //met le loader en route
    setIsLoading(true);

    try {
      await axios({
        method: "post",
        url: `http://127.0.0.1:8000/api/verification_code/`,
        data: formField,
      }).then((response) => {
        console.log(response.data);
        alert("Votre compte a été créer !");
      });
    } catch {
      alert("Code invalide");
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
              id="verification_code"
              label="Enter verification code"
              size="normal"
              variant="filled"
              fullWidth
              margin="normal"
              value={verification_code}
              onChange={(e) => setVerification_code(e.target.value)}
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
                    onClick={() => GoToAccountPage()}
                  >
                    Check
                  </Button >
                </div>

                <div className="button_form">
                  <Button
                    variant="contained"
                    margin="normal"
                    onClick={() => GoToSignUp()}
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

export default MailConfirm;
