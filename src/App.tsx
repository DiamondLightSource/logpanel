import { ThemeProvider } from "@emotion/react";
import FilterMenu from "./components/FilterMenu.tsx";
import { useEffect, useState, useMemo } from "react";
import { theme } from "./theme";
import BoxBasic from "./components/Box";
import {
  LogRecord,
  LogData,
  LogMessageApplication,
  LogMessageCluster,
  Messages,
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
  // Initialize states
  const EmptyLogRecord = useMemo<LogRecord>(
    () => ({
      timestamp: [],
      host: [],
      log_level_str: [],
      log_message: [],
      log_level: [],
      app_name: [],
    }),
    [],
  );

  const [LogResponse, setlogResponse] = useState<LogRecord>(EmptyLogRecord);
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
        const messages = getMessage(searchResults);
        setlogResponse(messages);
      } catch (error) {
        console.error("Error:", error);
      }
    })();
  }, [logFilter, applicationFilter, beamlineFilter]);

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
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>Timestamp</b>
                </TableCell>
                <TableCell>
                  <b>Debugging Level</b>
                </TableCell>
                <TableCell>
                  <b>Host</b>
                </TableCell>
                <TableCell>
                  <b>App Name</b>
                </TableCell>
                <TableCell>
                  <b>Log Messages</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {LogResponse.timestamp.map((timestamp, index) => {
                return (
                  <TableRow
                    sx={{
                      backgroundColor: getColor(LogResponse.log_level[index]),
                    }}
                  >
                    <TableCell>
                      <pre>{timestamp}</pre>
                    </TableCell>
                    <TableCell>
                      <pre>{LogResponse.log_level_str[index]}</pre>
                    </TableCell>
                    <TableCell>
                      <pre>{LogResponse.host[index]}</pre>
                    </TableCell>
                    <TableCell>
                      <pre>{LogResponse.app_name[index]}</pre>
                    </TableCell>
                    <TableCell>{LogResponse.log_message[index]}</TableCell>
                    {/* sx={{ '&:last-child td, &:last-child th': { border: 0 } }} */}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </BoxBasic>
    </ThemeProvider>
  );
}

// Collecting relevant information based off of Response Type
function getMessage(data: LogData): LogRecord {
  const log_message: string[] = [];
  const timestamp: string[] = [];
  const host: string[] = [];
  const log_level_str: string[] = [];
  const log_level: number[] = [];
  const app_name: string[] = [];

  const logs: Messages[] = Object.values(
    Object.values(data.results)[0].search_types,
  )[0].messages;
  for (const msg of logs) {
    const message: LogMessageApplication | LogMessageCluster = msg.message;
    const formattedTimestamp = message.timestamp.replace(/[TZ]/g, " ");
    timestamp.push(`${formattedTimestamp}`);
    host.push(message.source);
    // Type Checking of API Response
    if (MessageType(message)) {
      app_name.push(message.application_name);
      const level_str = LogLevel[message.level] || "UNKNOWN";
      log_level_str.push(level_str);
      log_message.push(message.full_message);
      log_level.push(message.level);
    }
    if (isLogMessageCluster(message)) {
      app_name.push(message.cluster_name);
      const level_str = LogLevel[message.level] || "UNKNOWN";
      log_level_str.push(level_str);
      log_message.push(message.message);
      log_level.push(message.level);
      // some clusters have a different leveling systems and needs exploring
    }
  }
  return {
    timestamp,
    host,
    log_level_str,
    log_message,
    log_level,
    app_name,
  };
}

// Select colour of log row based off log level
const getColor = (level: number) => {
  // yellow = #d1a317
  // red = #990f0f
  if (level === 4) {
    return "#d1a317";
  } else if (level < 4) {
    return "#990f0f";
  } else {
    return "";
  }
};

// Type-Checker Functions for API Response
function MessageType(
  _message: LogMessageApplication | LogMessageCluster,
): _message is LogMessageApplication {
  return true;
}

function isLogMessageCluster(
  _message: LogMessageCluster | LogMessageApplication,
): _message is LogMessageCluster {
  return true;
}

export default App;
