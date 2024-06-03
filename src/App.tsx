import { ThemeProvider } from "@emotion/react";
import { useEffect, useState, useReducer, useMemo } from "react";
import Log_Menu from "./components/LogMenu.tsx";
import { theme } from "./theme";
import BoxBasic from "./components/Box";
import {
  PayloadInterface,
  ActionType,
  QueryString,
  LogRecord,
  LogData,
  LogMessageApplication,
  LogMessageCluster,
  Messages,
} from "./schema/interfaces.ts";
import { payload } from "./schema/payload.ts";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TableHead } from "@mui/material";
import { LogLevel } from "./schema/level.ts";

function App() {
  // Initialize information for Queries and Auth
  const apiURL = "/api/views/search/sync";
  const query: QueryString = {};

  // Hard-code Actions for Reducer Function
  const ACTIONS = {
    LOGFILTER: "level",
    BEAMLINE: "beamline",
    APP: "application",
  };

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
  const [logPayload, handlePayload] = useReducer(reducer, payload);
  const [logFilter, setLogfilter] = useState(7);

  // Payload Modifiers based off of Application Name or Beamline
  const handleBeamline = (beamline: string) => {
    if (beamline == "") {
      beamline = "*";
    }
    handlePayload({ type: ACTIONS.BEAMLINE, query_condition: beamline });
  };

  const handleAppName = (app_name: string) => {
    if (app_name == "") {
      app_name = "*";
    }
    handlePayload({ type: ACTIONS.APP, query_condition: app_name });
  };

  const handleLogFilterChange = (newLogFilterValue: number) => {
    setLogfilter(newLogFilterValue);
    handlePayload({ type: ACTIONS.LOGFILTER, log_level: newLogFilterValue });
  };

  // Reducer Function to modify Payload according to hard-coded action
  function reducer(payload: PayloadInterface, action: ActionType) {
    switch (action.type) {
      case ACTIONS.LOGFILTER:
        query.filter = `level: <=${action.log_level}`;
        break;
      case ACTIONS.BEAMLINE:
        query.beamline = `beamline: ${action.query_condition}`;
        break;
      case ACTIONS.APP:
        query.app_name = `application_name: ${action.query_condition}`;
        break;
    }
    const query_arr: string[] = Object.values(query);
    payload.queries[0].query.query_string = query_arr.join(" AND ");
    const newPayload = { ...payload };
    return newPayload;
  }

  useEffect(() => {
    // POSTS API Call at Stores Response For Front-End
    async function fetchData(url: string, payload: object): Promise<undefined> {
      try {
        // Adding required headers for API Call
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("X-Requested-By", "XMLHttpRequest");

        // Making the fetch request
        const response = await fetch(url, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(payload),
        });
        // Checking if the response is OK
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        // Parsing the response as JSON
        const logdata = await response.json();
        const ApiResponse: LogRecord = getMessage(logdata) || EmptyLogRecord;
        setlogResponse(ApiResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
      }
    }

    // Calls file for auth and calls POST API call
    (async () => {
      try {
        await fetchData(apiURL, payload);
      } catch (error) {
        console.error("Error:", error);
      }
    })();
  }, [logPayload, EmptyLogRecord]);

  return (
    <ThemeProvider theme={theme}>
      <h1>Athena Logpanel </h1>
      <Log_Menu
        level={logFilter}
        onLevelChange={handleLogFilterChange}
        beamline=""
        onBeamlineChange={handleBeamline}
        application=""
        onApplicationChange={handleAppName}
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
function getMessage(logging: JSON): LogRecord | undefined {
  const data: LogData = JSON.parse(JSON.stringify(logging));
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
