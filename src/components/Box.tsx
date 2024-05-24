import * as React from 'react'
import Box from '@mui/material/Box'

interface BoxProps {
  children?: React.ReactNode
}

const BoxBasic = (props: BoxProps) => {
  return (
    <Box
      component="section"
      sx={{
        margin: '1vw',
        padding: '1vw',
        border: '6px solid grey',
        width: '95vw',
        height: '80vh',
        overflowY: 'scroll',
        whiteSpace: 'wrap',
      }}
    >
      {props.children}
    </Box>
  )
}

export default BoxBasic
