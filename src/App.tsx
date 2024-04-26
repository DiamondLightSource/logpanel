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


function App() {
  const [time, setTime] = useState<string[]>([]);
  const [source, setSource] = useState<string[]>([]);
  const [debug, setDebug] = useState<string[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
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
        const [timestamp,source,debug,message] = getMessage(logdata) ||  [["No logs found"]];
        setTime(timestamp);
        setSource(source);
        setDebug(debug);
        setLogs(message);
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
                <TableCell>Timestamp</TableCell>
                <TableCell>Debugging Level</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Log Messages</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map((log,index) => (
                <TableRow>                  
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

function getMessage(logging: JSON): undefined | string[][] {
  const data = JSON.parse(JSON.stringify(logging));
  for (const key in data.results) {
    if ("search_types" in data.results[key]) {
      const id = data.results[key].search_types;
      const message: string[] = [];
      const timestamp: string[] =[];
      const source: string[] =[];
      const debug: string[] =[];
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
            const [debug_level, log_message] = logLevel(text);
            debug.push(debug_level);
            message.push(log_message);

          }
          return [timestamp,source,debug,message];
        }
      }
    }
  }
}

function logLevel(text: string): [string, string] {
  const debug_levels = {"INFO":1,"DEBUG":2,"WARN":3,"ERROR":4};
  const words = text.split(/\s+/);
  const firstWord = words[0] || '';  
  const restOfText = words.slice(2).join(' ');
  let debug = "";
  let message = "";
  if (firstWord in debug_levels) {
    debug = firstWord;
    message = restOfText;
  } else {
    debug = "UNKNOWN";
    message = text;
  }
  return [debug, message];
}
async function readFile(): Promise<string> {
  const filePath = "src/token.txt";
  const response =  await fetch(filePath) ;
  if (!response.ok){
    throw new Error(`Failed to read file: ${filePath}`);
  }
  return await response.text();
}

export default App;
