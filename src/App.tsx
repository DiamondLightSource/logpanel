import { ThemeProvider } from "@emotion/react";
import FilterMenu from "./components/FilterMenu.tsx";
import { useEffect, useState } from "react";
import { theme } from "./theme";
import BoxBasic from "./components/Box";
import {
  LogData,
  LogMessageApplication,
  LogMessageCluster,
  Messages,
  LogTableRow,
  isLogMessageApplication,
  isLogMessageCluster,
} from "./schema/interfaces.ts";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TableHead } from "@mui/material";
import { LogLevel } from "./schema/level.ts";
import { buildSearchQuery, graylogSearch } from "./utils/api/search.ts";

function App() {
  // Init states
  const [logTable, setLogTable] = useState<LogTableRow[]>([]);
  const [logDisplayError, setLogDisplayError] = useState<string | undefined>(
    undefined,
  );
  const [logFilter, setLogfilter] = useState(7);
  const [applicationFilter, setApplicationFilter] = useState("*");
  const [beamlineFilter, setBeamlineFilter] = useState("*");

  useEffect(() => {
    // Calls file for auth and calls POST API call
    (async () => {
      try {
        const payload = buildSearchQuery(
          logFilter,
          applicationFilter,
          beamlineFilter,
        );
        const searchResults = await graylogSearch(payload);
        const table = buildTable(searchResults);
        setLogTable(table);
      } catch (error) {
        console.error(error);
        if (error instanceof Error) {
          setLogDisplayError(error.toString());
        } else {
          setLogDisplayError("Unknown error: see console");
        }
      }
    })();
  }, [logFilter, applicationFilter, beamlineFilter]);

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

  return (
    <ThemeProvider theme={theme}>
      <h1>Athena Logpanel </h1>
      <FilterMenu
        level={logFilter}
        onLevelChange={setLogfilter}
        beamline=""
        onBeamlineChange={beamline =>
          setBeamlineFilter(beamline === "" ? "*" : beamline)
        }
        application=""
        onApplicationChange={application =>
          setApplicationFilter(application == "" ? "*" : application)
        }
      />

      <BoxBasic>
        {(() => {
          if (logDisplayError === undefined) {
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
          } else {
            return <p>{logDisplayError}</p>;
          }
        })()}
      </BoxBasic>
    </ThemeProvider>
  );
}

export default App;
