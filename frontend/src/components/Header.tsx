import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <AppBar position="static" sx={{ height: 48 }}>
      <Toolbar
        sx={{
          minHeight: 'auto',
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" component={Link} to="/" sx={{ fontSize: '0.875rem' }}>
            Home
          </Button>
          <Button color="inherit" component={Link} to="/login" sx={{ fontSize: '0.875rem' }}>
            Login
          </Button>
          <Button color="inherit" component={Link} to="/register" sx={{ fontSize: '0.875rem' }}>
            Register
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
