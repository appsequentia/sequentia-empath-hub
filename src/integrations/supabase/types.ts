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
      profiles: {
        Row: {
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      therapist_education: {
        Row: {
          created_at: string
          degree: string
          description: string | null
          id: string
          institution: string
          therapist_id: string
          updated_at: string
          year: string
        }
        Insert: {
          created_at?: string
          degree: string
          description?: string | null
          id?: string
          institution: string
          therapist_id: string
          updated_at?: string
          year: string
        }
        Update: {
          created_at?: string
          degree?: string
          description?: string | null
          id?: string
          institution?: string
          therapist_id?: string
          updated_at?: string
          year?: string
        }
        Relationships: [
          {
            foreignKeyName: "therapist_education_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "therapist_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      therapist_experience: {
        Row: {
          company: string
          created_at: string
          current: boolean | null
          description: string | null
          end_date: string | null
          id: string
          position: string
          start_date: string
          therapist_id: string
          updated_at: string
        }
        Insert: {
          company: string
          created_at?: string
          current?: boolean | null
          description?: string | null
          end_date?: string | null
          id?: string
          position: string
          start_date: string
          therapist_id: string
          updated_at?: string
        }
        Update: {
          company?: string
          created_at?: string
          current?: boolean | null
          description?: string | null
          end_date?: string | null
          id?: string
          position?: string
          start_date?: string
          therapist_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "therapist_experience_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "therapist_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      therapist_plans: {
        Row: {
          created_at: string
          description: string | null
          id: string
          max_services: number
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          max_services: number
          name: string
          price: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          max_services?: number
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      therapist_profiles: {
        Row: {
          approach: string | null
          avatar: string | null
          bio: string | null
          cover: string | null
          created_at: string
          id: string
          is_approved: boolean
          name: string
          plan_active: boolean | null
          plan_id: string | null
          price: number
          rating: number | null
          reviews: number | null
          specialty: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          approach?: string | null
          avatar?: string | null
          bio?: string | null
          cover?: string | null
          created_at?: string
          id: string
          is_approved?: boolean
          name: string
          plan_active?: boolean | null
          plan_id?: string | null
          price?: number
          rating?: number | null
          reviews?: number | null
          specialty?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          approach?: string | null
          avatar?: string | null
          bio?: string | null
          cover?: string | null
          created_at?: string
          id?: string
          is_approved?: boolean
          name?: string
          plan_active?: boolean | null
          plan_id?: string | null
          price?: number
          rating?: number | null
          reviews?: number | null
          specialty?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "therapist_profiles_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "therapist_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      therapist_reviews: {
        Row: {
          client_id: string
          comment: string | null
          created_at: string
          id: string
          rating: number
          therapist_id: string
          updated_at: string
        }
        Insert: {
          client_id: string
          comment?: string | null
          created_at?: string
          id?: string
          rating: number
          therapist_id: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number
          therapist_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "therapist_reviews_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "therapist_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      therapist_services: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          duration: number
          id: string
          name: string
          price: number
          therapist_id: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          duration: number
          id?: string
          name: string
          price: number
          therapist_id: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          duration?: number
          id?: string
          name?: string
          price?: number
          therapist_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "therapist_services_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "therapist_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      therapist_specializations: {
        Row: {
          created_at: string
          id: string
          specialization: string
          therapist_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          specialization: string
          therapist_id: string
        }
        Update: {
          created_at?: string
          id?: string
          specialization?: string
          therapist_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "therapist_specializations_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "therapist_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
