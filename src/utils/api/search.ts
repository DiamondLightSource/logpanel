import { LogData, PayloadInterface } from "../../schema/interfaces";

export async function graylogSearch(
  payload: PayloadInterface,
): Promise<LogData> {
  const url = "/api/views/search/sync";

  // Adding required headers for API Call
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("X-Requested-By", "XMLHttpRequest");

  // Making the fetch request
  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(payload),
  });

  // Parsing the response as JSON
  return await response.json();
}

export function buildSearchQuery(
  minimumLevel: number | undefined = undefined,
  application: string | undefined = undefined,
  beamline: string | undefined = undefined,
): PayloadInterface {
  const searchQuery = [
    `level: <=${minimumLevel}`,
    `beamline: ${beamline}`,
    `application_name: ${application}`,
  ].join(" AND ");
  return {
    parameters: [],
    queries: [
      {
        query: {
          type: "elasticsearch",
          query_string: searchQuery,
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
}
