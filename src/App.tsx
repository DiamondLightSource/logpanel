// import { LogComponent } from './components/Card';
import LogTable from './components/Table';
import './App.css'
import {theme} from "./theme";
import { ThemeProvider } from '@emotion/react';
function App() {
  
  const data = "Garry"

    return (
      <ThemeProvider theme={theme}>
      <h1 className='Athena Logpanel'>
        <p>Hello World</p>
        <button className='square'>1</button>
        <label htmlFor='Log1'></label>
        {/* <LogComponent></LogComponent> */}
        <p> {data} </p>
        <LogTable></LogTable>
      </h1>
      </ThemeProvider>
      )
  }
  



export default App
