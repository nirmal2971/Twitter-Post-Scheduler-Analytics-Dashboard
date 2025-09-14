import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Paper,
  Stack,
  Alert,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to right, #0f2027, #203a43, #2c5364)",

        overflow: "hidden",
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: 4,
          borderRadius: 2,
          background: "rgba(17, 24, 39, 0.95)",
          boxShadow: "0 8px 25px rgba(0, 229, 255, 0.2)",
          textAlign: "center",
          width: "100%",
          maxWidth: 420,
        }}
      >
        <Stack spacing={3}>
          <Typography variant="h5" fontWeight="bold" color="#00e5ff">
            Login
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="standard"
            InputLabelProps={{ style: { color: "#00e5ff" } }}
            InputProps={{ style: { color: "#fff" } }}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="standard"
            InputLabelProps={{ style: { color: "#00e5ff" } }}
            InputProps={{ style: { color: "#fff" } }}
          />

          <Button
            fullWidth
            onClick={handleLogin}
            sx={{
              border: "1px solid #00e5ff",
              color: "#00e5ff",
              letterSpacing: 2,
              fontWeight: "bold",
              "&:hover": {
                background: "rgba(0, 229, 255, 0.1)",
                boxShadow: "0 0 10px #00e5ff",
              },
            }}
          >
            SUBMIT
          </Button>

          <Button
            variant="text"
            sx={{ color: "#00e5ff" }}
            onClick={() => navigate("/register")}
          >
            Don’t have an account? Register
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Login;
