import {
  List,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  ListItemButton,
} from "@mui/material";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";

interface Props {
  handleLogout: () => void
}
const SidebarCommonList = (props: Props) => {

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          marginLeft: "15px",
          height: "inherit",
          justifyContent: "space-between",
        }}
      >
        <Box style={{ paddingTop: "16px", paddingBottom: "16px" }}>
          <Typography variant="h6">
            <b>UMP</b>
          </Typography>
          <List>
            <ListItemButton>
              <ListItemIcon sx={{ minWidth: "36px" }}>
                <PeopleAltOutlinedIcon color="primary" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={"Users"} sx={{ fontSize: "14px" }} />
            </ListItemButton>
          </List>
        </Box>

        <List component="nav" aria-label="Device settings">
          <ListItemButton>
            <ListItemIcon sx={{ minWidth: "36px" }}>
              <ExitToAppOutlinedIcon color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={"Logout"}
              sx={{ fontSize: "14px" }}
              onClick={props.handleLogout}
            />
          </ListItemButton>
        </List>
      </Box>
    </>
  );
};

export default SidebarCommonList;
