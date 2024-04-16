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


function App() {

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
        const message = getMessage(logdata) || ["No logs found"];
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
            <TableBody>
              {logs.map((log) => (
                <TableRow
                  key={log}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {log}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </BoxBasic>
    </ThemeProvider>
  );
}

function getMessage(logging: JSON): undefined | string[] {
  const data = JSON.parse(JSON.stringify(logging));
  for (const key in data.results) {
    if ("search_types" in data.results[key]) {
      const id = data.results[key].search_types;
      const message: string[] = [];
      for (const keys in id) {
        if ("messages" in id[keys]) {
          const logs = id[keys].messages;
          for (const msg in logs) {
            message.push(
              `${logs[msg]["message"]["timestamp"]} ${logs[msg]["message"]["source"]} ${logs[msg]["message"]["message"]}`
            );
          }
          return message;
        }
      }
    }
  }
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
