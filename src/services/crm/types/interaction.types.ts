export interface Interaction {
  id: number
  customer_id: number
  type: string
  notes: string
  contacted_by?: string
  status?: string
  created_at: string
  updated_at: string
}
