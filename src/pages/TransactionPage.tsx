// interface Props {}

/**
 * @see https://www.google.com/search?q=what+does+a+basic+bank+website+look+like&client=firefox-b-1-d&source=lnms&tbm=isch&sa=X&ved=2ahUKEwiVx9Kd_qD8AhU3m2oFHSFOAVoQ_AUoAXoECAEQAw&biw=1173&bih=934&dpr=1#imgrc=rfMK4oDNtImSVM
 * for a cool design, use Mui tabs for toggling accounts
 */
import { memo, useState } from "react";
import {
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  styled,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material";
// import CreditCardIcon from "@mui/icons-material/CreditCard";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import { useContext } from "../utils/Context";
import { concatenateAccountTransactions } from "../utils/parse";

interface TransactionTableProps {
  account: string;
}

const StyledContainer = styled(Box)(() => ({
  flexGrow: 1,
  paddingTop: "10px",
  textAlign: "start",
  "& .MuiTypography-h6": {
    paddingLeft: "20%",
    fontFamily: "Arsher",
  },
  "& .MuiDivider-root": {
    marginLeft: "10%",
    marginRight: "10%",
  },
}));

const PureTransactionTable = memo(TransactionTable);

function TransactionPage() {
  const [account, setAccount] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [value, setValue] = useState<number>(0);
  const app = useContext();

  const isMenuOpen = Boolean(anchorEl);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleValueChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
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
      {app.user?.accounts.map((acc) => (
        <MenuItem
          key={acc}
          onClick={() => {
            setAccount(acc);
            handleMenuClose();
          }}
        >
          {acc}
        </MenuItem>
      ))}
    </Menu>
  );

  return (
    <StyledContainer>
      <Typography
        variant="h5"
        sx={{
          display: "flex",
          justifyContent: "space-around",
          maxWidth: "100vw",
        }}
      >
        Account:&nbsp;
        <Typography variant="caption" sx={{ fontSize: 18 }}>
          Ending in&nbsp;{account}
          <IconButton
            onClick={(event: React.MouseEvent<HTMLElement>) => {
              setAnchorEl(event.currentTarget);
            }}
          >
            <ArrowDropDownIcon />
          </IconButton>
        </Typography>
      </Typography>
      <Divider />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Tabs value={value} onChange={handleValueChange}>
          <Tab value={0} sx={{ flexGrow: 1 }} label="Transactions" />
          <Tab value={1} sx={{ flexGrow: 1 }} label="Balance Info" />
          <Tab value={2} sx={{ flexGrow: 1 }} label="Stats" />
        </Tabs>
      </Box>

      {value === 0 && <PureTransactionTable account={account} />}
      {value === 1 && <>Balance info.</>}
      {value === 2 && <>Stats.</>}
      {renderMenu}
    </StyledContainer>
  );
}

function TransactionTable({ account }: TransactionTableProps) {
  const { data, titles } = concatenateAccountTransactions({ account });

  return (
    <Paper
      sx={{
        overflow: "hidden",
        mx: { xs: "unset", sm: 5 },
        backgroundColor: "rgba(255,255,255,0)",
      }}
    >
      <TableContainer
        sx={{
          maxHeight: "50vh",
          maxWidth: "100vw",
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {titles.map((title) => (
                <TableCell
                  sx={{
                    textTransform: "capitalize",
                  }}
                  key={title}
                  align="right"
                >
                  {title}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => {
              return (
                <TableRow hover tabIndex={-1} key={JSON.stringify(row)}>
                  {titles.map((title) => {
                    const value = row[title];
                    // parseFloat(value.replace(/,/g, ''));
                    return (
                      <TableCell
                        key={`${Math.random()}-${value}`}
                        align="right"
                      >
                        {value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{
          margin: (theme) => theme.spacing(5),
          display: "flex",
          justifyContent: "right",
        }}
      >
        <Typography>Total</Typography>
      </Box>
    </Paper>
  );
}

export default memo(TransactionPage);
