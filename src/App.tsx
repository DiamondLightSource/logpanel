import { ThemeProvider } from "@emotion/react";
import { useEffect, useState } from "react";
import { theme } from "./theme";
import BoxBasic from "./components/Box";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableHead } from "@mui/material";

type getMessageReturn = [string[],string[],string[],string[],number[]]

function App() {
  const [time, setTime] = useState<string[]>([]);
  const [source, setSource] = useState<string[]>([]);
  const [debug, setDebug] = useState<string[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [log_lvl, setLog_lvl] = useState<number[]>([]);

  useEffect(() => {
    async function fetchData(
      url: string,
      username: string,
      password: string,
      payload: object
    ): Promise<undefined> {
      try {
        // Creating a basic authentication header
        const headers = new Headers();
        headers.append(
          "Authorization",
          "Basic " + btoa(`${username}:${password}`)
        );
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
        const [timestamp,source,debug,message,log_level] = getMessage(logdata) ||  [["No logs found"],["No logs found"],["No logs found"],["No logs found"],[1]];
        setTime(timestamp);
        setSource(source);
        setDebug(debug);
        setLogs(message);
        setLog_lvl(log_level);
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
      }
    }

    const apiURL = "/api/views/search/sync";
    const password = "token";
    let username:string;

    // Add payload for the request
    const payload = {
      // id: "661626cbe7b8a27f59bd1175",
      parameters: [],
      queries: [
        {
          query: {
            type: "elasticsearch",
            query_string: "application_name:gda",
          },
          timerange: {
            from: 300,
            type: "relative",
          },
          filters: [],
          search_types: [
            {
              limit: 100,
              offset: 0,
              sort: [
                {
                  field: "timestamp",
                  order: "DESC",
                },
              ],
              fields: [],
              decorators: [],
              type: "messages",
              filter: null,
              filters: [],
            },
          ],
        },
      ],
    };

    // reads file from folder - add custom API key to this file
    (async () => {
      try {
        await readFile()
        .then((content) => {
          username = content;
          // Run API call using parameters
          (async () => {
            try {
              await fetchData(apiURL, username, password, payload);
            } catch (error) {
              console.error("Error:", error);
            }
          })();
        });
      } catch (error) {
        console.error("Error collecting password:", error);
      }
    })();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <h1>Athena Logpanel </h1>
      <BoxBasic>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell><b>Timestamp</b></TableCell>
                <TableCell><b>Debugging Level</b></TableCell>
                <TableCell><b>Source</b></TableCell>
                <TableCell><b>Log Messages</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map((log,index) => (
                <TableRow sx={{backgroundColor:getColor(log_lvl[index])}}>                  
                  <TableCell>{time[index]}</TableCell>
                  <TableCell>{debug[index]}</TableCell>
                  <TableCell>{source[index]}</TableCell>
                  <TableCell>{log}</TableCell>
                  {/* sx={{ '&:last-child td, &:last-child th': { border: 0 } }} */}
                </TableRow>
              ))}
            </TableBody>            
          </Table>
        </TableContainer>
      </BoxBasic>
    </ThemeProvider>
  );
}

function getMessage(logging: JSON): undefined | getMessageReturn {
  const data = JSON.parse(JSON.stringify(logging));
  for (const key in data.results) {
    if ("search_types" in data.results[key]) {
      const id = data.results[key].search_types;
      const message: string[] = [];
      const timestamp: string[] =[];
      const source: string[] =[];
      const debug: string[] =[];
      const log_level: number[] =[];
      for (const keys in id) {
        if ("messages" in id[keys]) {
          const logs = id[keys].messages;
          // populate different components of logged data and identifying log level
          for (const msg in logs) {
            const formattedTimestamp = logs[msg]["message"]["timestamp"].replace(/[TZ]/g, ' ')
            timestamp.push(
              `${formattedTimestamp}`
            );
            source.push(
              `${logs[msg]["message"]["source"]}`
            )
            const text = logs[msg]["message"]["message"];
            const [debug_level, log_message,level] = logLevel(text);
            debug.push(debug_level);
            message.push(log_message);
            log_level.push(level);

          }
          return [timestamp,source,debug,message,log_level];
        }
      }
    }
  }
}

function logLevel(text: string): [string, string, number] {
  const debug_levels: {[key: string]: number} = {
    "EMERG":0,
    "PANIC":0,
    "ALERT":1,
    "CRIT":2,
    "ERROR":3, 
    "WARN":4, 
    "NOTICE":5, 
    "INFO":6,
    "DEBUG":7,};
  const words = text.split(/\s+/);
  const firstWord = words[0] || '';  
  const restOfText = words.slice(2).join(' ');
  let debug = "";
  let message = "";
  let level_val:number = 0;
  if (firstWord in debug_levels) {
    debug = firstWord;
    message = restOfText;
    level_val = debug_levels[firstWord];
  } else {
    debug = "UNKNOWN";
    message = text;
    level_val = 7;
  }
  return [debug, message, level_val];
}
async function readFile(): Promise<string> {
  const filePath = "src/token.txt";
  const response =  await fetch(filePath) ;
  if (!response.ok){
    throw new Error(`Failed to read file: ${filePath}`);
  }
  return await response.text();
}

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
}

export default App;
