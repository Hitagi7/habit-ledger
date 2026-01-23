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
            budgets: {
                Row: {
                    amount: number
                    category_id: string | null
                    created_at: string | null
                    id: string
                    period: string
                    start_date: string
                    updated_at: string | null
                    user_id: string
                }
                Insert: {
                    amount: number
                    category_id?: string | null
                    created_at?: string | null
                    id?: string
                    period: string
                    start_date?: string
                    updated_at?: string | null
                    user_id: string
                }
                Update: {
                    amount?: number
                    category_id?: string | null
                    created_at?: string | null
                    id?: string
                    period?: string
                    start_date?: string
                    updated_at?: string | null
                    user_id?: string
                }
            }
            categories: {
                Row: {
                    color: string | null
                    created_at: string | null
                    icon: string | null
                    id: string
                    name: string
                    type: string
                    updated_at: string | null
                    user_id: string
                }
                Insert: {
                    color?: string | null
                    created_at?: string | null
                    icon?: string | null
                    id?: string
                    name: string
                    type: string
                    updated_at?: string | null
                    user_id: string
                }
                Update: {
                    color?: string | null
                    created_at?: string | null
                    icon?: string | null
                    id?: string
                    name?: string
                    type?: string
                    updated_at?: string | null
                    user_id?: string
                }
            }
            habit_logs: {
                Row: {
                    completed: boolean | null
                    created_at: string | null
                    date: string
                    habit_id: string
                    id: string
                    notes: string | null
                    user_id: string
                }
                Insert: {
                    completed?: boolean | null
                    created_at?: string | null
                    date?: string
                    habit_id: string
                    id?: string
                    notes?: string | null
                    user_id: string
                }
                Update: {
                    completed?: boolean | null
                    created_at?: string | null
                    date?: string
                    habit_id?: string
                    id?: string
                    notes?: string | null
                    user_id?: string
                }
            }
            habits: {
                Row: {
                    color: string | null
                    created_at: string | null
                    description: string | null
                    frequency: string
                    icon: string | null
                    id: string
                    is_active: boolean | null
                    name: string
                    target_days: number[] | null
                    updated_at: string | null
                    user_id: string
                }
                Insert: {
                    color?: string | null
                    created_at?: string | null
                    description?: string | null
                    frequency: string
                    icon?: string | null
                    id?: string
                    is_active?: boolean | null
                    name: string
                    target_days?: number[] | null
                    updated_at?: string | null
                    user_id: string
                }
                Update: {
                    color?: string | null
                    created_at?: string | null
                    description?: string | null
                    frequency?: string
                    icon?: string | null
                    id?: string
                    is_active?: boolean | null
                    name?: string
                    target_days?: number[] | null
                    updated_at?: string | null
                    user_id?: string
                }
            }
            transactions: {
                Row: {
                    amount: number
                    category_id: string | null
                    created_at: string | null
                    date: string
                    description: string | null
                    id: string
                    tags: string[] | null
                    type: string
                    updated_at: string | null
                    user_id: string
                }
                Insert: {
                    amount: number
                    category_id?: string | null
                    created_at?: string | null
                    date?: string
                    description?: string | null
                    id?: string
                    tags?: string[] | null
                    type: string
                    updated_at?: string | null
                    user_id: string
                }
                Update: {
                    amount?: number
                    category_id?: string | null
                    created_at?: string | null
                    date?: string
                    description?: string | null
                    id?: string
                    tags?: string[] | null
                    type?: string
                    updated_at?: string | null
                    user_id?: string
                }
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
    }
}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
