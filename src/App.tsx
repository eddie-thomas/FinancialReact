import { type ChangeEvent, memo, useState } from "react";
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
  PageType,
  useContext,
  type ContextType,
} from "./utils/Context";

import TransactionPage from "./pages/TransactionPage";
import AccountPage from "./pages/AccountPage";
import LoginDialog from "./pages/LoginDialog";

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
            fontFamily: "Arsher, Cursive",
          },
          "& .MuiDivider-root": {
            margin: "15px 5px",
            backgroundColor: "#fff",
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-root": {
            backgroundColor: "rgba(255,255,255,0)",
            backdropFilter: "blur(10px)",
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
        <div>
          {/* Dialogs */}
          <LoginDialog
            open={context.loginDialogOpen}
            onClose={() =>
              setContext((prev) => ({ ...prev, loginDialogOpen: false }))
            }
          />
        </div>
        <div className="App">
          <PureBar />
          {context.user && <PureBody />}
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
    app.setBody(<AccountPage />, PageType.Account);
    handleMenuClose();
  };

  const handleTransactionsClick = () => {
    app.setBody(<TransactionPage />, PageType.Transaction);
    handleMenuClose();
  };

  const handleUploads = (event: ChangeEvent<HTMLInputElement>) => {
    const ele = event.target;
    const files = ele.files;

    Array.from(files || []).map((file) => {
      // Do something more here
      console.log(file.name);
    });
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
        <Typography
          variant="h5"
          sx={{
            display: { xs: "none", sm: "block" },
            color: "#FCCC44",
            textDecoration: "#D41C2C underline",
          }}
        >
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

            <IconButton size="large" component="label">
              <input
                hidden
                accept=".pdf"
                type="file"
                multiple
                onChange={handleUploads}
              />
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

            <IconButton
              sx={{
                borderRadius: 1,
                ...(app.bodyType &&
                  app.bodyType !== "upload" && {
                    borderBottom: "3px solid #fff",
                  }),
              }}
              onClick={handleProfileMenuOpen}
              size="large"
            >
              <AccountBoxIcon />
            </IconButton>
          </>
        ) : (
          <>
            <Button onClick={app.handleAttemptLogin}>Log in</Button>
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
