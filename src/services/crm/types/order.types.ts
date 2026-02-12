export interface Order {
  id: number
  customer_id: number
  total_amount: number | string
  status: string
  created_at: string
  updated_at: string
}
