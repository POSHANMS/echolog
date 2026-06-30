export interface Entry {
  text: string;
  createdAt: FirebaseFirestore.Timestamp;
  flagged?: boolean;
}

export interface EntryResponse {
  id: string;
  text: string;
  createdAt: string; // ISO string for JSON transport
  flagged?: boolean;
}