import { ThemeProvider } from "@emotion/react";
import FilterMenu from "./components/FilterMenu.tsx";
import { useEffect, useState } from "react";
import { theme } from "./theme";
import { LogData } from "./schema/interfaces.ts";

import { buildSearchQuery, graylogSearch } from "./utils/api/search.ts";
import LogTable from "./components/LogTable.tsx";
import Disclaimer from "./components/Disclaimer.tsx";

function App() {
  // Init states
  const [logData, setlogData] = useState<LogData | undefined>(undefined);
  const [logDisplayError, setLogDisplayError] = useState<string | undefined>(
    undefined,
  );
  const [logFilter, setLogfilter] = useState(7);
  const [applicationFilter, setApplicationFilter] = useState("*");
  const [beamlineFilter, setBeamlineFilter] = useState("*");

  useEffect(() => {
    // Calls file for auth and calls POST API call
    (async () => {
      try {
        const payload = buildSearchQuery(
          logFilter,
          applicationFilter,
          beamlineFilter,
        );
        const searchResults = await graylogSearch(payload);
        setlogData(searchResults);
      } catch (error) {
        console.error(error);
        if (error instanceof Error) {
          setLogDisplayError(error.toString());
        } else {
          setLogDisplayError("Unknown error: see console");
        }
      }
    })();
  }, [logFilter, applicationFilter, beamlineFilter]);

  return (
    <ThemeProvider theme={theme}>
      <Disclaimer />
      <h1>Athena Logpanel </h1>
      <FilterMenu
        level={logFilter}
        onLevelChange={setLogfilter}
        beamline=""
        onBeamlineChange={beamline =>
          setBeamlineFilter(beamline === "" ? "*" : beamline)
        }
        application=""
        onApplicationChange={application =>
          setApplicationFilter(application == "" ? "*" : application)
        }
      />
      <LogTable data={logData} error={logDisplayError}></LogTable>
    </ThemeProvider>
  );
}

export default App;
