import type {
  AuditRow,
  LeadRow,
} from "./types";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      audits: {
        Row: AuditRow;
        Insert: Omit<
          AuditRow,
          "id" | "created_at"
        >;
        Update: Partial<
          Omit<
            AuditRow,
            "id" | "created_at"
          >
        >;
        Relationships: [];
      };
      leads: {
        Row: LeadRow;
        Insert: Omit<
          LeadRow,
          "id" | "created_at"
        >;
        Update: Partial<
          Omit<
            LeadRow,
            "id" | "created_at"
          >
        >;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
