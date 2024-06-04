// Payload Type Interfaces
export interface PayloadInterface {
  parameters: string[];
  queries: PayloadQuery[];
}

export interface PayloadQuery {
  query: {
    query_string: string;
    type: string;
  };
  timerange: {
    from: number;
    type: string;
  };
  filters: string[];
  search_types: PayloadSearchType[];
  filter?: string | null;
  id?: string;
}

export interface PayloadSearchType {
  decorators: string[];
  fields: string[];
  filter: string | null;
  filters: string[];
  id?: string;
  limit: number;
  name?: string | null;
  offset: number;
  query?: string | null;
  sort: {
    field: string;
    order: string;
  }[];
  streams?: string[];
  timerange?: string | null;
  type?: string;
}

export interface LogTableRow {
  timestamp: string;
  host: string;
  level: string;
  text: string;
  application: string;
}

// API Response Interfaces

export interface LogData {
  execution: Execution;
  results: {
    [key: string]: Results;
  };
  id: string;
  owner: string;
  search_id: string;
}

export interface Execution {
  done: boolean;
  cancelled: boolean;
  completed_exceptionally: boolean;
}

export interface Results {
  query: Query;
  execution_stats: ExecutionStats;
  search_types: {
    [key: string]: SearchTypes;
  };
  errors: string[];
  state: string;
}

export interface Query {
  id: string;
  timerange: {
    from: number;
    type: string;
  };
  filter: Filter;
  filters: string[];
  query: QueryType;
  search_types: SearchType[];
}

export interface Filter {
  type: string;
  filters: {
    type: string;
    id: string;
  }[];
}
export interface QueryType {
  type: string;
  query_string: string;
}

export interface SearchType {
  timerange: string | null;
  query: string | null;
  streams: string[];
  id: string;
  name: string | null;
  limit: number;
  offset: number;
  sort: {
    field: string;
    order: string;
  }[];
  fields: string[];
  decorators: string[];
  type: string;
  filter: string | null;
  filters: string[];
}

export interface ExecutionStats {
  duration: number;
  timestamp: string;
  effective_timerange: EffectiveTimerange;
}

export interface EffectiveTimerange {
  from: string;
  to: string;
  type: string;
}

export interface SearchTypes {
  id: string;
  messages: Messages[];
  effective_timerange: EffectiveTimerange;
  total_results: number;
  type: string;
}

export interface Messages {
  effective_timerange: EffectiveTimerange;
  message: LogMessageApplication | LogMessageCluster;
  index: string;
  decoration_stats: string | null;
}

export interface LogMessageApplication {
  _id: string;
  application_name: string;
  beamline: string;
  full_message: string;
  gdaVersion: string;
  g12_accounted_message_size: number;
  g12_message_id: string;
  g12_remote_ip: string;
  g12_remote_port: number;
  g12_source_input: string;
  g12_source_node: string;
  jvmName?: string;
  level: number;
  loggerName: string;
  message: string;
  mode: string;
  source: string;
  streams: string[];
  threadName: string;
  timestamp: string;
  username: string;
}

export interface LogMessageCluster {
  _id: string;
  cluster_name: string;
  container_id: string;
  container_image: string;
  container_image_id?: string;
  container_name: string;
  facility: string;
  gl2_accounted_message_size: number;
  gl2_message_id: string;
  gl2_remote_ip: string;
  gl2_remote_port: number;
  gl2_source_input: string;
  gl2_source_node: string;
  kubernetes: string;
  level: number;
  logtag: string;
  master_url: string;
  message: string;
  namespace_id: string;
  namespace_name: string;
  node: string;
  pod_id: string;
  pod_ip: string;
  pod_labels: string;
  pod_name: string;
  protocol: string;
  source: string;
  stream: string;
  streams: string[];
  tag: string;
  time: string;
  timestamp: string;
}

// Type-Checker Functions for API Response
export function isLogMessageApplication(
  message: LogMessageApplication | LogMessageCluster,
): message is LogMessageApplication {
  return "application_name" in message;
}

export function isLogMessageCluster(
  message: LogMessageCluster | LogMessageApplication,
): message is LogMessageCluster {
  return "cluster_name" in message;
}
