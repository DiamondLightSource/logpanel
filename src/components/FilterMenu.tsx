import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { allLogLevels } from "../schema/level";
import { Grid, Select, TextField } from "@mui/material";

interface Props {
  level: number;
  onLevelChange: (level: number) => void;
  beamline: string;
  onBeamlineChange: (beamline: string) => void;
  application: string;
  onApplicationChange: (application: string) => void;
}

const FilterMenu: React.FC<Props> = (props: Props) => {
  return (
    <Box sx={{ padding: "1vw" }}>
      <Grid container spacing={2}>
        <Grid item xs={1}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="log-filter-id">Level</InputLabel>
            <Select
              id="log-filter-label"
              value={props.level}
              label="Level"
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
          </FormControl>
        </Grid>
        <Grid item xs>
          <TextField
            id="app-name"
            label="Application"
            variant="outlined"
            margin="normal"
            onChange={e => props.onApplicationChange(e.target.value)}
            fullWidth
          >
            {props.application}
          </TextField>
        </Grid>
        <Grid item xs>
          <TextField
            id="beamline"
            label="Beamline"
            variant="outlined"
            margin="normal"
            onChange={e => props.onBeamlineChange(e.target.value)}
            fullWidth
          >
            {props.beamline}
          </TextField>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FilterMenu;
