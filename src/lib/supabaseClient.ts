import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for Supabase tables
export interface Database {
  public: {
    Tables: {
      buildings: {
        Row: {
          id: string;
          name: string;
          address: string;
          total_units: number;
          variables: Record<string, string>;
        };
        Insert: {
          id?: string;
          name: string;
          address: string;
          total_units: number;
          variables?: Record<string, string>;
        };
        Update: {
          id?: string;
          name?: string;
          address?: string;
          total_units?: number;
          variables?: Record<string, string>;
        };
      };
      members: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          unit: string;
          vote_weight: number;
          representative_id: string | null;
          building_id: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          unit: string;
          vote_weight: number;
          representative_id?: string | null;
          building_id: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          unit?: string;
          vote_weight?: number;
          representative_id?: string | null;
          building_id?: string;
        };
      };
      votes: {
        Row: {
          id: string;
          title: string;
          description: string;
          building_id: string;
          status: string;
          created_at: string;
          start_date: string | null;
          end_date: string | null;
          attachments: string[] | null;
          observers: string[] | null;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          building_id: string;
          status: string;
          created_at?: string;
          start_date?: string | null;
          end_date?: string | null;
          attachments?: string[] | null;
          observers?: string[] | null;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          building_id?: string;
          status?: string;
          created_at?: string;
          start_date?: string | null;
          end_date?: string | null;
          attachments?: string[] | null;
          observers?: string[] | null;
        };
      };
      questions: {
        Row: {
          id: string;
          vote_id: string;
          text: string;
          quorum_type: string;
          custom_quorum_numerator: number | null;
          custom_quorum_denominator: number | null;
        };
        Insert: {
          id?: string;
          vote_id: string;
          text: string;
          quorum_type: string;
          custom_quorum_numerator?: number | null;
          custom_quorum_denominator?: number | null;
        };
        Update: {
          id?: string;
          vote_id?: string;
          text?: string;
          quorum_type?: string;
          custom_quorum_numerator?: number | null;
          custom_quorum_denominator?: number | null;
        };
      };
      email_templates: {
        Row: {
          id: string;
          name: string;
          subject: string;
          body: string;
          building_id: string | null;
          is_global: boolean;
          custom_variables: any | null;
        };
        Insert: {
          id?: string;
          name: string;
          subject: string;
          body: string;
          building_id?: string | null;
          is_global: boolean;
          custom_variables?: any | null;
        };
        Update: {
          id?: string;
          name?: string;
          subject?: string;
          body?: string;
          building_id?: string | null;
          is_global?: boolean;
          custom_variables?: any | null;
        };
      };
      global_variables: {
        Row: {
          name: string;
          description: string;
          value: string;
          is_editable: boolean;
        };
        Insert: {
          name: string;
          description: string;
          value: string;
          is_editable?: boolean;
        };
        Update: {
          name?: string;
          description?: string;
          value?: string;
          is_editable?: boolean;
        };
      };
      building_variable_definitions: {
        Row: {
          name: string;
          description: string;
          type: string;
          options: string[] | null;
          required: boolean;
          placeholder: string | null;
        };
        Insert: {
          name: string;
          description: string;
          type: string;
          options?: string[] | null;
          required?: boolean;
          placeholder?: string | null;
        };
        Update: {
          name?: string;
          description?: string;
          type?: string;
          options?: string[] | null;
          required?: boolean;
          placeholder?: string | null;
        };
      };
      observers: {
        Row: {
          id: string;
          name: string;
          email: string;
          building_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          building_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          building_id?: string;
          created_at?: string;
        };
      };
      voting_tokens: {
        Row: {
          id: string;
          vote_id: string;
          member_id: string;
          token: string;
          verification_code: string;
          is_verified: boolean;
          is_used: boolean;
          expires_at: string;
          created_at: string;
          verified_at: string | null;
          used_at: string | null;
        };
        Insert: {
          id?: string;
          vote_id: string;
          member_id: string;
          token: string;
          verification_code: string;
          is_verified?: boolean;
          is_used?: boolean;
          expires_at: string;
          created_at?: string;
          verified_at?: string | null;
          used_at?: string | null;
        };
        Update: {
          id?: string;
          vote_id?: string;
          member_id?: string;
          token?: string;
          verification_code?: string;
          is_verified?: boolean;
          is_used?: boolean;
          expires_at?: string;
          created_at?: string;
          verified_at?: string | null;
          used_at?: string | null;
        };
      };
      member_votes: {
        Row: {
          id: string;
          vote_id: string;
          member_id: string;
          question_id: string;
          answer: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          vote_id: string;
          member_id: string;
          question_id: string;
          answer: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          vote_id?: string;
          member_id?: string;
          question_id?: string;
          answer?: string;
          created_at?: string;
        };
      };
      manual_vote_attachments: {
        Row: {
          id: string;
          vote_id: string;
          member_id: string;
          attachment_name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          vote_id: string;
          member_id: string;
          attachment_name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          vote_id?: string;
          member_id?: string;
          attachment_name?: string;
          created_at?: string;
        };
      };
      manual_vote_notes: {
        Row: {
          id: string;
          vote_id: string;
          member_id: string;
          note: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          vote_id: string;
          member_id: string;
          note: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          vote_id?: string;
          member_id?: string;
          note?: string;
          created_at?: string;
        };
      };
    };
  };
}