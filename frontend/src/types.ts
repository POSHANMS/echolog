export interface Entry {
  id: string;
  text: string;
  createdAt: string;
  flagged?: boolean;
}

export interface EntriesResponse {
  entries: Entry[];
}

export interface ApiError {
  error: string;
  matchedTerm?: string;
}