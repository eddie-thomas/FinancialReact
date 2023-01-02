import { memo } from "react";
import {
  Avatar,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";

import { useContext } from "../utils/Context";
import { blue } from "@mui/material/colors";

import users from "../json/users.json";

export default memo(LoginDialog);

function LoginDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const app = useContext();

  const handleClose = () => {
    onClose();
  };

  const handleListItemClick = (userIndex: number) => {
    app.handleLogIn(userIndex);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Login to account</DialogTitle>
      <List sx={{ pt: 0 }}>
        {users.map((user, userIndex) => (
          <ListItem disableGutters key={JSON.stringify(user)}>
            <ListItemButton onClick={() => handleListItemClick(userIndex)}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={user.name} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disableGutters>
          <ListItemButton
            autoFocus
            onClick={() => console.warn("Not implemented")}
          >
            <ListItemAvatar>
              <Avatar>
                <AddIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Add account" />
          </ListItemButton>
        </ListItem>
      </List>
    </Dialog>
  );
}
