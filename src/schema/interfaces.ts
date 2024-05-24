// Payload Type Interfaces
export interface PayloadInterface {
  parameters: string[];
  queries: Query[];
}

export interface Query {
  query: QueryDetails;
  timerange: Timerange;
  filters: string[];
  search_types: SearchType[];
}

export interface QueryDetails {
  type: string;
  query_string: string;
}

export interface Timerange {
  from: number;
  type: string;
}

export interface SearchType {
  limit: number;
  offset: number;
  sort: Sort[];
  fields: string[];
  decorators: string[];
  type: string;
  filter: string | null;
  filters: string[];
}

export interface Sort {
  field: string;
  order: string;
}

export interface ActionType {
  type: string;
  log_level?: number | 7;
  query_condition?: string | "";
}

export interface QueryString {
  app_name?: string | "*";
  beamline?: string | "*";
  filter?: string | "*";
}
