import * as React from 'react';
import Box from '@mui/material/Box';

// Define the potential types for the Box
type Content = string| JSX.Element | number | (() => React.ReactNode);
interface BoxProps<T> {
    content:T;
}
// FC React functional component.
const BoxBasic:React.FC<BoxProps<Content>> = ({content}) =>{
    return (
      <Box component="section" sx={{ 
        margin: "1vw",
        padding: "1vw", 
        border: '6px solid grey', 
        width: "95vw", 
        height: "80vh",
        overflowY: "scroll",
        whiteSpace: "wrap"
         }}>
         {typeof content === 'function' ? content() : content}
      </Box>
    );
  }

export default BoxBasic;
