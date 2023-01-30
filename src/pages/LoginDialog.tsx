/**
 * @copyright Copyright © 2018 - 2023 by Edward K Thomas Jr
 * @license GNU GENERAL PUBLIC LICENSE https://www.gnu.org/licenses/gpl-3.0.en.html
 */

import { memo, useEffect, useState } from "react";
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

import { useContext, type User } from "../utils/Context";
import { blue } from "@mui/material/colors";
import { postData } from "../utils/post";

export default memo(LoginDialog);

function LoginDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [users, setUsers] = useState<Array<User>>();
  const app = useContext();

  const handleClose = () => {
    onClose();
  };

  const handleListItemClick = (user: {
    name: string;
    accounts: Array<string>;
  }) => {
    app.handleLogIn(user);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users_response = await postData<undefined, Array<User>>(
          "/users",
          { method: "GET" }
        );
        setUsers(users_response);
      } catch (error) {
        console.warn("Couldn't load user data");
        throw error;
      }
    };

    if (users === undefined) fetchUsers();
  }, []);

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Login to account</DialogTitle>
      <List sx={{ pt: 0 }}>
        {users?.map((user: User) => (
          <ListItem disableGutters key={JSON.stringify(user)}>
            <ListItemButton onClick={() => handleListItemClick(user)}>
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
