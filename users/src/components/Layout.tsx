import React from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";

interface Props {
  children?: React.ReactElement;
  handleLogout: () => void;
}

const Layout = (props: Props) => {
  const { children } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const handleLogout = () => {
    props.handleLogout()
    navigate('/login')
  }
  return (
    <Box
      sx={{
        display: "flex",
        height: "inherit",
        flexDirection: isMobile ? 'column': 'row'
      }}
    >
      {!isMobile ? (
        <Drawer
          sx={{
            width: 240,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: 240,
              boxSizing: "border-box",
            },
          }}
          variant="permanent"
        >
          <Sidebar handleLogout={handleLogout} />
        </Drawer>
      ) : (
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar style={{ alignSelf: 'flex-end'}}>
              <Button color="inherit" onClick={() => handleLogout()}>Logout</Button>
            </Toolbar>
          </AppBar>
        </Box>
      )}

      <main style={{ flexGrow: 1, padding: "2rem" }}>
        <Container>
          <>{children && <Box className="children">{children}</Box>}</>
        </Container>
      </main>
    </Box>
  );
};

export default Layout;
