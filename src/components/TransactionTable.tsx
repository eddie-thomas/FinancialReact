/**
 * @copyright Copyright © 2018 - 2023 by Edward K Thomas Jr
 * @license GNU GENERAL PUBLIC LICENSE https://www.gnu.org/licenses/gpl-3.0.en.html
 */

import { ChangeEvent, memo, useEffect, useState } from "react";
import {
  Box,
  Collapse,
  Container,
  IconButton,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import {
  aggregateAmounts,
  concatenateAccountTransactions,
  type Transactions,
} from "../utils/parse";
import { postData } from "../utils/post";

export default memo(TransactionTable);

export const StyledPaper = styled(Paper)(({ theme }) => ({
  overflow: "hidden",
  [theme.breakpoints.down("sm")]: { margin: "unset" },
  [theme.breakpoints.up("sm")]: { margin: `0 ${theme.spacing(3)}` },
  backgroundColor: "rgba(255,255,255,0)",
}));

export interface TransactionTableProps {
  account: string;
}

const StyledFooterContainer = styled(Box)(({ theme }) => ({
  margin: theme.spacing(3),
  [theme.breakpoints.up("md")]: {
    justifyContent: "right",
    display: "flex",
  },
  [theme.breakpoints.down("md")]: {
    display: "grid",
    justifyContent: "center",
    "& .MuiTypography-root": {
      textAlign: "right",
    },
  },
  "& .MuiTypography-root": {
    borderRight: "1px solid #000",
    paddingRight: theme.spacing(1),
    marginRight: theme.spacing(1),
    fontFamily: "Courier",
  },
  "& .MuiBox-root": {
    display: "inline-flex",
    borderRight: "1px solid #000",
    paddingRight: theme.spacing(1),
    marginRight: theme.spacing(1),
    justifyContent: "right",
  },
  b: { whiteSpace: "pre", marginRight: theme.spacing(1) },
}));

function TransactionTable({ account }: TransactionTableProps) {
  const [data, setData] = useState<Transactions | undefined>();
  const [regex, setRegex] = useState<string>();

  const { data: concatTransactions, titles } = concatenateAccountTransactions({
    account,
    data: data || [],
  });
  const regExpFilterConcatenatedTransactions = concatTransactions.filter(
    (row) => {
      if (!regex) return true;
      const regexp = new RegExp(regex, "i");
      return titles.find((title) => {
        const value = row[title];
        return regexp.test(value);
      });
    }
  );
  const { balance, expense, revenue } = aggregateAmounts(
    regExpFilterConcatenatedTransactions
  );

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data_response = await postData<undefined, Transactions>("/data", {
          method: "GET",
        });
        setData(data_response);
      } catch (error) {
        console.warn("Couldn't load user data");
        throw error;
      }
    };

    if (data === undefined) fetchUsers();
  }, []);

  return (
    <StyledPaper>
      <StyledFooterContainer>
        <RegExpSearch onRegex={setRegex} />
        <Typography>
          Revenue:&nbsp;<b>{revenue.padStart(10, " ")}</b>
        </Typography>
        <Typography>
          Expense:&nbsp;<b>{expense.padStart(10, " ")}</b>
        </Typography>
        <Typography>
          Balance:&nbsp;
          <b
            style={{
              color:
                parseFloat(balance) === 0
                  ? "#649ff0"
                  : parseFloat(balance) > 0
                  ? "#79ea86"
                  : "#e75757",
            }}
          >
            {balance.padStart(10, " ")}
          </b>
        </Typography>
      </StyledFooterContainer>
      <TableContainer
        sx={{
          maxHeight: "70vh",
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
            {regExpFilterConcatenatedTransactions.map((row) => {
              return (
                <TableRow hover tabIndex={-1} key={JSON.stringify(row)}>
                  {titles.map((title) => {
                    const value = row[title];
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
    </StyledPaper>
  );
}

function RegExpSearch({
  onRegex,
}: {
  onRegex: React.Dispatch<React.SetStateAction<string | undefined>>;
}) {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const handleInChange = () => {
    setCollapsed((prev) => !prev);
  };

  const handleTextFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value || undefined;
    const regExp = value?.replaceAll("\\", "\\\\");
    try {
      regExp && new RegExp(regExp);
      onRegex(regExp);
      setError(false);
    } catch (err) {
      setError(true);
    }
  };

  return (
    <Box>
      <Collapse in={collapsed} orientation="horizontal">
        <TextField
          error={error}
          fullWidth
          placeholder="Enter RegExp for Filtering"
          variant="standard"
          onChange={handleTextFieldChange}
        />
      </Collapse>
      <IconButton onClick={handleInChange}>
        <ManageSearchIcon />
      </IconButton>
    </Box>
  );
}
