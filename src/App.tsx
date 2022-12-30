import { memo, useState } from "react";
import {
  AppBar,
  Button,
  createTheme,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  ThemeProvider,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";

import AccountBoxIcon from "@mui/icons-material/AccountBox";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import LogoutIcon from "@mui/icons-material/Logout";

import "./App.css";

import {
  Context,
  defaultValue,
  useContext,
  type ContextType,
} from "./utils/Context";

import TransactionPage from "./pages/TransactionPage";
import AccountPage from "./pages/AccountPage";

const customTheme = createTheme({
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#3A4450",
          "& .MuiButtonBase-root": {
            color: "#fff",
            fontWeight: 500,
          },
          "& .MuiTypography-root": {
            fontFamily: "Arsher",
          },
          "& .MuiTypography-h4": {
            fontFamily: "Arsher, cursive",
          },
          "& .MuiDivider-root": {
            margin: "15px 5px",
            backgroundColor: "#fff",
          },
        },
      },
    },
  },
});

function App() {
  const [context, setContext] = useState<ContextType>(defaultValue);
  return (
    <Context.Provider value={[context, setContext]}>
      <ThemeProvider theme={customTheme}>
        <div className="App">
          <PureBar />
          <PureBody />
        </div>
      </ThemeProvider>
    </Context.Provider>
  );
}

function Bar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const app = useContext();

  const isMenuOpen = Boolean(anchorEl);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMeClick = () => {
    app.setBody(<AccountPage />);
    handleMenuClose();
  };

  const handleTransactionsClick = () => {
    app.setBody(<TransactionPage />);
    handleMenuClose();
  };

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleTransactionsClick}>View statements</MenuItem>
      <MenuItem onClick={handleMeClick}>My account</MenuItem>
    </Menu>
  );

  return (
    <AppBar component="nav">
      <Toolbar>
        <Typography variant="h5" sx={{ display: { xs: "none", sm: "block" } }}>
          WELLS
          <br />
          FARGO
        </Typography>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          financial react
        </Typography>

        {app.loggedIn ? (
          <>
            <IconButton onClick={app.handleLogOut} size="large">
              <Tooltip
                title={<Typography fontFamily="Arsher">Log out</Typography>}
              >
                <LogoutIcon />
              </Tooltip>
            </IconButton>

            <Divider flexItem orientation="vertical" />

            <IconButton size="large">
              <Tooltip
                title={
                  <Typography fontFamily="Arsher">
                    Upload statement(s)
                  </Typography>
                }
              >
                <DriveFolderUploadIcon />
              </Tooltip>
            </IconButton>

            <IconButton onClick={handleProfileMenuOpen} size="large">
              <AccountBoxIcon />
            </IconButton>
          </>
        ) : (
          <>
            <Button onClick={app.handleLogIn}>Log in</Button>
          </>
        )}
      </Toolbar>
      {renderMenu}
    </AppBar>
  );
}

function Body() {
  const app = useContext();

  return (
    <div
      style={{
        flexGrow: 1,
      }}
    >
      <Toolbar />
      {app.body}
    </div>
  );
}

const PureBar = memo(Bar);
const PureBody = memo(Body);

export default App;
