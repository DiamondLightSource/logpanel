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
