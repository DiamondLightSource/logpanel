import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { allLogLevels } from "../schema/level";
import { Select, TextField } from "@mui/material";

interface Props {
  level: number;
  onLevelChange: (level: number) => void;
  beamline: string;
  onBeamlineChange: (beamline: string) => void;
  application: string;
  onApplicationChange: (application: string) => void;
}

const LogMenu: React.FC<Props> = (props: Props) => {
  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="log-filter-id">Minimum Log Level</InputLabel>
        <Select
          id="log-filter-label"
          value={props.level}
          label="Minimum Log Level"
          onChange={e =>
            props.onLevelChange(e.target.value as unknown as number)
          }
        >
          {allLogLevels().map(([level, num]) => (
            <MenuItem key={level} value={num}>
              {level}
            </MenuItem>
          ))}
        </Select>
        <TextField
          id="app-name"
          label="Application Name"
          variant="outlined"
          margin="normal"
          onChange={e => props.onApplicationChange(e.target.value)}
        >
          {props.application}
        </TextField>
        <TextField
          id="beamline"
          label="Beamline"
          variant="outlined"
          margin="normal"
          onChange={e => props.onBeamlineChange(e.target.value)}
        >
          {props.beamline}
        </TextField>
      </FormControl>
    </Box>
  );
};

export default LogMenu;
