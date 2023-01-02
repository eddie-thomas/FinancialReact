import { memo } from "react";
import {
  Box,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  aggregateAmounts,
  concatenateAccountTransactions,
} from "../utils/parse";

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
  b: { whiteSpace: "pre", marginRight: theme.spacing(1) },
}));

function TransactionTable({ account }: TransactionTableProps) {
  const { data, titles } = concatenateAccountTransactions({ account });
  const { balance, expense, revenue } = aggregateAmounts(data);

  return (
    <StyledPaper>
      <StyledFooterContainer>
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
            {data.map((row) => {
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
