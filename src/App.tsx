import { ThemeProvider } from '@emotion/react';
import { useEffect, useRef} from 'react'
import { theme } from './theme';
// import LogTable from './components/Table';
// import './App.css'
// import {theme} from "./theme";
// import { ThemeProvider } from '@emotion/react';

function App() {
  
  const data = useRef();
  useEffect(() => {
    async function fetchData(url: string, username: string, password: string): Promise<undefined> {
      try {
          // Creating a basic authentication header
          const headers = new Headers();
          headers.append('Authorization',"Basic " + btoa(`${username}:${password}`));

          // Making the fetch request
          const response = await fetch(url, {
              method: 'GET',
              headers: headers
          });

          // Checking if the response is OK
          if (!response.ok) {
              throw new Error('Failed to fetch data');
          }

          // Parsing the response as JSON
          const data1 = await response.json();
          return data1;
      } catch (error) {
          console.error('Error fetching data:', error);
          throw error;
      }
  }

    const apiURL = "/api/system/journal";
    const password = "token";

    (async () => {
        try {
            data.current = await fetchData(apiURL, username, password);
            console.log(data.current)
        } catch (error) {
            console.error('Error:', error);
        }
    })();
    },[])

    // return (
    //   <h3> {data.current}</h3>
    // )


    return (
      <ThemeProvider theme={theme}>
      <h1>Athena Logpanel Single Call</h1>
      <h2 className='Athena Logpanel'>
        <button className='square'>1</button>
        <label htmlFor='Log1'></label>
      </h2>
      <p> {JSON.stringify(data.current)} </p>
      </ThemeProvider>
      )
  }
  



export default App
