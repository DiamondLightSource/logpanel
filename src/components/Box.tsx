import * as React from "react";
import Box from "@mui/material/Box";
import { useEffect, useRef } from "react";

interface BoxProps {
  children?: React.ReactNode;
}

const BoxBasic = (props: BoxProps) => {
  const boxRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    boxRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [props.children]);

  return (
    <Box
      component="section"
      sx={{
        margin: "1vw",
        padding: "1vw",
        border: "6px solid grey",
        width: "95vw",
        height: "80vh",
        overflowY: "scroll",
        whiteSpace: "wrap",
      }}
    >
      {props.children}
    </Box>
  );
};

export default BoxBasic;
