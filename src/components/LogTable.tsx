import BoxBasic from "./Box";
import {
  LogData,
  LogMessageApplication,
  LogMessageCluster,
  Messages,
  LogTableRow,
  isLogMessageApplication,
  isLogMessageCluster,
} from "../schema/interfaces.ts";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TableHead } from "@mui/material";
import { LogLevel } from "../schema/level.ts";

interface Props {
  data: LogData | undefined;
  error: string | undefined;
}

function LogTable(props: Props) {
  const colors: { [id: string]: string } = {
    WARN: "#d1a317",
    ERROR: "#990f0f",
    ALERT: "#990f0f",
    CRIT: "#990f0f",
    default: "",
  };

  function buildTable(data: LogData): LogTableRow[] {
    const logs: Messages[] = Object.values(
      Object.values(data.results)[0].search_types,
    )[0].messages;
    return logs.map(log => {
      const message: LogMessageApplication | LogMessageCluster = log.message;
      const timestamp = message.timestamp.replace(/[TZ]/g, " ");
      let application = "";
      let text = "";
      if (isLogMessageApplication(message)) {
        application = message.application_name;
        text = message.full_message;
      } else if (isLogMessageCluster(message)) {
        application = message.cluster_name;
        text = message.message;
      } else {
        throw new TypeError(
          "Graylog response not supported: " + JSON.stringify(message),
        );
      }
      return {
        id: message._id,
        timestamp: timestamp,
        host: message.source,
        level: LogLevel[message.level],
        text: text,
        application: application,
      };
    });
  }

  let logTable = undefined;
  if (props.data !== undefined) {
    logTable = buildTable(props.data);
  }

  return (
    <BoxBasic>
      {(() => {
        if (logTable !== undefined) {
          return (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <b>Timestamp</b>
                    </TableCell>
                    <TableCell>
                      <b>Level</b>
                    </TableCell>
                    <TableCell>
                      <b>Host</b>
                    </TableCell>
                    <TableCell>
                      <b>Application</b>
                    </TableCell>
                    <TableCell>
                      <b>Message</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {logTable.map(row => (
                    <TableRow
                      key={row.id}
                      sx={{
                        backgroundColor: colors[row.level] || colors.default,
                      }}
                    >
                      <TableCell>
                        <pre>{row.timestamp}</pre>
                      </TableCell>
                      <TableCell>
                        <pre>{row.level}</pre>
                      </TableCell>
                      <TableCell>
                        <pre>{row.host}</pre>
                      </TableCell>
                      <TableCell>
                        <pre>{row.application}</pre>
                      </TableCell>
                      <TableCell>{row.text}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          );
        } else if (props.error !== undefined) {
          return <p>{props.error}</p>;
        } else {
          return <p>No data from server</p>;
        }
      })()}
    </BoxBasic>
  );
}

export default LogTable;
