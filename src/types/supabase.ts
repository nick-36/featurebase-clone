export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      form_submission: {
        Row: {
          content: Json | null
          created_at: string
          form_id: string
          id: number
        }
        Insert: {
          content?: Json | null
          created_at?: string
          form_id?: string
          id?: number
        }
        Update: {
          content?: Json | null
          created_at?: string
          form_id?: string
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "form_submission_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["id"]
          },
        ]
      }
      forms: {
        Row: {
          content: Json | null
          created_at: string
          description: string | null
          id: string
          name: string | null
          published: boolean
          share_url: string | null
          submissions: number
          user_id: string
          visits: number
        }
        Insert: {
          content?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string | null
          published?: boolean
          share_url?: string | null
          submissions?: number
          user_id?: string
          visits?: number
        }
        Update: {
          content?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string | null
          published?: boolean
          share_url?: string | null
          submissions?: number
          user_id?: string
          visits?: number
        }
        Relationships: []
      }
      survey_responses: {
        Row: {
          created_at: string | null
          id: string
          question_id: string
          submission_id: string
          value: Json | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          question_id: string
          submission_id: string
          value?: Json | null
        }
        Update: {
          created_at?: string | null
          id?: string
          question_id?: string
          submission_id?: string
          value?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "survey_responses_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "survey_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      survey_submissions: {
        Row: {
          content: Json | null
          created_at: string | null
          id: string
          metadata: Json | null
          respondent_id: string | null
          survey_id: string
        }
        Insert: {
          content?: Json | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          respondent_id?: string | null
          survey_id: string
        }
        Update: {
          content?: Json | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          respondent_id?: string | null
          survey_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "survey_submissions_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "surveys"
            referencedColumns: ["id"]
          },
        ]
      }
      surveys: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_published: boolean | null
          pages: Json | null
          share_url: string | null
          submissions: number | null
          title: string
          updated_at: string | null
          user_id: string
          visits: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_published?: boolean | null
          pages?: Json | null
          share_url?: string | null
          submissions?: number | null
          title: string
          updated_at?: string | null
          user_id: string
          visits?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_published?: boolean | null
          pages?: Json | null
          share_url?: string | null
          submissions?: number | null
          title?: string
          updated_at?: string | null
          user_id?: string
          visits?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_dashboard_stats: {
        Args: { p_user_id: string }
        Returns: Json
      }
      get_submission_stats: {
        Args: { p_user_id: string }
        Returns: {
          submission_date: string
          submission_count: number
        }[]
      }
      get_user_survey_stats: {
        Args: { p_user_id: string }
        Returns: Json
      }
      increment_survey_visit_count: {
        Args: { survey_url: string }
        Returns: {
          id: string
          pages: Json
          visits: number
          is_published: boolean
          share_url: string
        }[]
      }
      increment_visit_count: {
        Args: { survey_url: string }
        Returns: {
          id: string
          content: Json
          visits: number
          published: boolean
          share_url: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
