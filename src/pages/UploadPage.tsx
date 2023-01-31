/**
 * @copyright Copyright © 2018 - 2023 by Edward K Thomas Jr
 * @license GNU GENERAL PUBLIC LICENSE https://www.gnu.org/licenses/gpl-3.0.en.html
 */

import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import { type ChangeEvent, memo, useState } from "react";

import { StyledPaper } from "../components/TransactionTable";

import { postData } from "../utils/post";
import { useContext } from "../utils/Context";

export enum StatementType {
  Checking = "checking",
  Credit = "credit",
  Savings = "savings",
}
export enum Debug {
  Yes = "1",
  No = "0",
}
export interface UploadRequestBody {
  file_names: Array<string>;
  user_name: string;
  debug: Debug;
  statement_type?: StatementType;
}

export default memo(UploadPage);

function UploadPage() {
  const [files, setFiles] = useState<Array<string>>([]);
  const [debug, setDebug] = useState<boolean>(true);
  const [sending, setSending] = useState<boolean>(false);
  const [success, setSuccess] = useState<
    Array<[boolean, Array<string> | undefined]>
  >([]);

  const app = useContext();

  const handleUploads = (event: ChangeEvent<HTMLInputElement>) => {
    const ele = event.target;
    const eleFile = ele.files;

    const fileNames = Array.from(eleFile || []).map((file) => file.name);
    setFiles(fileNames);
  };

  const handleSubmit = async () => {
    if (app.user === undefined) return;
    try {
      setSending(true);
      const body: UploadRequestBody = {
        file_names: files,
        user_name: app.user?.name,
        debug: debug ? Debug.Yes : Debug.No,
      };

      const response = await postData<
        UploadRequestBody,
        { success: boolean; errors?: Array<string> }
      >("/upload", {
        data: body,
        method: "POST",
      });
      handleSuccess(response.success, response.errors);
    } catch (error) {
      handleSuccess(false);
      console.warn(error);
    } finally {
      setSending(false);
    }
  };

  const handleSuccess = (succeeded: boolean, errors?: Array<string>) => {
    setSuccess((prev) => [[succeeded, errors], ...prev]);
    setTimeout(
      () =>
        setSuccess((prev) => {
          const copy = Array.from(prev);
          copy.pop();
          return copy;
        }),
      1e4
    );
  };

  return (
    <StyledPaper>
      <Stack sx={{ m: 3 }}>
        <Typography variant="h5">Upload file(s)</Typography>
        <Box>
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
                <Typography fontFamily="Arsher">Upload statement(s)</Typography>
              }
            >
              <DriveFolderUploadIcon />
            </Tooltip>
          </IconButton>
        </Box>
        <Typography>
          Currently selected files:&nbsp;{`[${files.join()}]`}
        </Typography>
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Debug mode"
              onChange={(_, checked) => setDebug(checked)}
            />
          </FormGroup>
        </Box>
        <Button onClick={handleSubmit}>
          {sending ? <CircularProgress /> : "Upload file(s)"}
        </Button>
        {success.map((successArray) => {
          const [responseSuccess, errors] = successArray;
          return (
            <div key={Math.random() * 1e5}>
              {responseSuccess === true ? (
                <Alert severity="success">Successfully uploaded file(s)!</Alert>
              ) : responseSuccess === false ? (
                <Alert severity="error">
                  Failed to upload file(s)!
                  {errors !== undefined && (
                    <>
                      <br />
                      <br />
                      {`Error(s): ${errors}`}
                    </>
                  )}
                </Alert>
              ) : null}
            </div>
          );
        })}
      </Stack>
    </StyledPaper>
  );
}
