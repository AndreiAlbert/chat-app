import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { jwtDecode } from "jwt-decode";
import { Alert, Button, Snackbar, SnackbarCloseReason } from "@mui/material";

export function TokenExpired() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { token, setToken } = useAuth();

  useEffect(() => {
    if (!token) return;

    const decoded = jwtDecode(token);
    if (!decoded.exp) return;
    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExp = (decoded.exp - currentTime) * 1000;

    if (timeUntilExp > 0) {
      const timeoutId = setTimeout(() => {
        setOpen(true);
        setToken(null);
      }, timeUntilExp);
      return () => clearTimeout(timeoutId);
    } else {
      setOpen(true);
    }
  }, [token]);

  const handleClose = (_: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  }

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert
        onClose={handleClose}
        severity="warning"
        sx={{ width: "100%", display: "flex", alignItems: "center" }}
        action={
          <Button
            color="inherit"
            size="small"
            onClick={handleLoginRedirect}
          >
            Go to the login page
          </Button>
        }
      >
        Your session has expired. Please login again
      </Alert>
    </Snackbar>
  )
}
