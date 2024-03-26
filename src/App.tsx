
import LogTable from './components/Table';
import './App.css'
import {theme} from "./theme";
import { ThemeProvider } from '@emotion/react';

function App() {
  
  const data = "Garry"

    return (
      <ThemeProvider theme={theme}>
      <p className='Athena Logpanel'>
        <h2>Hello World</h2>
        <button className='square'>1</button>
        <label htmlFor='Log1'></label>
        <LogTable></LogTable>
        <h3> {data} </h3>
      </p>
      </ThemeProvider>
      )
  }
  



export default App
