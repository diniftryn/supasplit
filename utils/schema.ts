export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      expenses: {
        Row: {
          id: number;
          description: string;
          amount: number;
          date: Date;
          payer_id: string;
        };
        Insert: {
          id?: number;
          description?: string;
          amount?: number;
          date?: Date;
          payer_id: string;
        };
        Update: {
          id?: number;
          description?: string;
          amount?: number;
          date?: Date;
          payer_id?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
