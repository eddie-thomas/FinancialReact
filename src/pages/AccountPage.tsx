/**
 * @copyright Copyright © 2018 - 2023 by Edward K Thomas Jr
 * @license GNU GENERAL PUBLIC LICENSE https://www.gnu.org/licenses/gpl-3.0.en.html
 */

// interface Props {}

import { memo } from "react";
import { Typography } from "@mui/material";

import { StyledPaper } from "../components/TransactionTable";
import { useContext } from "../utils/Context";

function AccountPage() {
  const app = useContext();
  return (
    <StyledPaper
      sx={{ height: "100%", "& > *": { margin: (theme) => theme.spacing(5) } }}
    >
      <Typography sx={{ display: "flex", justifyContent: "space-around" }}>
        Name:<b>{app.user?.name}</b>
      </Typography>
      <Typography sx={{ display: "flex", justifyContent: "space-around" }}>
        Accounts:<b>{app.user?.accounts.join(", ")}</b>
      </Typography>
    </StyledPaper>
  );
}

export default memo(AccountPage);
