import { memo, useState } from "react";
import { Button, Grid, Stack, TextField } from "@mui/material";
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { type Dayjs } from "dayjs";

import { useContext } from "../utils/Context";

import { StyledPaper } from "./TransactionTable";

import {
  aggregateAmounts,
  concatenateAccountTransactions,
} from "../utils/parse";

enum DateChoice {
  From = "from",
  To = "to",
}

export default memo(BalanceSheet);

function BalanceSheet() {
  const app = useContext();
  const { data } = concatenateAccountTransactions({
    account: app.user?.accounts || [],
  });
  const { balance, expense, revenue } = aggregateAmounts(data);

  return (
    <StyledPaper>
      <Grid
        container
        sx={{
          "& > *": { margin: (theme) => theme.spacing(3) },
          width: "100%",
          display: { xs: "unset", sm: "unset", md: "flex" },
        }}
      >
        <Grid item>
          <Grid container direction="column">
            <Grid item>
              <fieldset
                style={{ borderRadius: "5px", borderColor: "rgba(0,0,0,0.2)" }}
              >
                <legend style={{ margin: "5px" }}>Filter by date</legend>
                <DatePeriodSelector />
              </fieldset>
            </Grid>
            <Grid item>
              <fieldset
                style={{ borderRadius: "5px", borderColor: "rgba(0,0,0,0.2)" }}
              >
                <legend style={{ margin: "5px" }}>Filter by account</legend>
                <Button fullWidth>All accounts</Button>
              </fieldset>
            </Grid>
          </Grid>
        </Grid>
        <Grid item display="flex">
          <Grid container direction="column" fontFamily="Courier" sx={{ m: 3 }}>
            <Grid item display="flex" justifyContent="space-between">
              <div>
                <b style={{ color: "#79ea86", float: "right" }}>+</b>
                Total Revenue:
              </div>
              <>
                <b>{revenue}</b>
              </>
            </Grid>
            <Grid item display="flex" justifyContent="space-between">
              <div>
                <b style={{ color: "#e75757", float: "right" }}>-</b>
                Total Expense:
              </div>
              <>
                <b>{expense}</b>
              </>
            </Grid>

            <Grid item display="flex" justifyContent="space-between">
              Total Balance:
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
                {balance}
              </b>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </StyledPaper>
  );
}

export function DatePeriodSelector() {
  const [to, setTo] = useState<Dayjs | null>(dayjs(new Date()));
  const [from, setFrom] = useState<Dayjs | null>(
    dayjs(new Date(new Date().setMonth(new Date().getMonth() - 1)))
  );

  const handleChange = (newValue: Dayjs | null, when: DateChoice) => {
    if (when === DateChoice.From) {
      if (newValue?.isAfter(to)) setTo(newValue);
      setFrom(newValue);
    } else if (when === DateChoice.To) {
      if (newValue?.isBefore(from)) return;
      setTo(newValue);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={3}>
        <MobileDatePicker
          label="From Date"
          inputFormat="MM/DD/YYYY"
          value={from}
          onChange={(newValue: Dayjs | null) =>
            handleChange(newValue, DateChoice.From)
          }
          renderInput={(params) => <TextField {...params} />}
        />
        <MobileDatePicker
          label="To Date"
          inputFormat="MM/DD/YYYY"
          value={to}
          onChange={(newValue: Dayjs | null) =>
            handleChange(newValue, DateChoice.To)
          }
          renderInput={(params) => <TextField {...params} />}
        />
      </Stack>
    </LocalizationProvider>
  );
}
