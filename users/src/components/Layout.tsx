import React from "react";
import { Box, Container, Drawer } from "@mui/material";
import Sidebar from "./Sidebar";

interface Props {
  children?: React.ReactElement;
}

const Layout = (props: Props) => {
  const { children } = props;

  return (
    <Box
      sx={{
        display: "flex",
        height: "inherit",
      }}
    >
      <Drawer
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
      >
        <Sidebar />
      </Drawer>
      <main style={{ flexGrow: 1, padding: "2rem" }}>
        <Container>
          <>{children && <Box className="children">{children}</Box>}</>
        </Container>
      </main>
    </Box>
  );
};

export default Layout;
