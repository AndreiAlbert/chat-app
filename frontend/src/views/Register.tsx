import { useState } from "react";
import { TextField, Button, Container, Typography, Box, Alert } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { isAxiosError } from "axios";
import axiosInstance from "../axios/axios";
import { useNavigate } from "react-router-dom";

export function Register() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { username, password } = formData;
    try {
      const response = await axiosInstance.post('/api/auth/register', { username, password });
      if (response.status !== 200) {
        throw new Error(`Unexpected response status: ${response.status}\n. Error message: ${response.statusText}`);
      }
      const { token } = response.data;
      localStorage.setItem("token", token);
      navigate("/");
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        console.log(error.response?.data);
      }
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Register
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            required
          />
          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{ marginTop: '16px' }}
          >
            Register
          </Button>
        </form>
        {token ? (
          <Alert severity="warning" action={<Button onClick={() => navigate("/")} color="inherit">Go to main page</Button>}>You are already logged in</Alert>)
          : <></>}
      </Box>
    </Container>
  );
}
