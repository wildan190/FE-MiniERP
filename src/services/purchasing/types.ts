export interface Supplier {
  id: number;
  uuid: string;
  name: string;
  pic?: string;
  contact?: string;
  address?: string;
  npwp?: string;
  category?: string;
  currency_code: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PurchaseRequestItem {
  uuid: string;
  item_name: string;
  qty: number;
  notes?: string;
}

export interface PurchaseRequest {
  id: number;
  uuid: string;
  number: string;
  date: string;
  requestor_id: number;
  department_uuid?: string;
  notes?: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  items: PurchaseRequestItem[];
}

export interface PurchaseOrder {
  id: number;
  uuid: string;
  number: string;
  supplier: Supplier;
  date: string;
  eta?: string;
  total_amount: number;
  status: 'draft' | 'approved' | 'partial' | 'completed' | 'cancelled';
  items: any[];
}

export interface GoodsReceipt {
  uuid: string;
  number: string;
  purchase_order_id: number;
  date: string;
  notes?: string;
}

export interface PurchaseInvoice {
  uuid: string;
  number: string;
  supplier: Supplier;
  date: string;
  due_date: string;
  total_amount: number;
  status: 'draft' | 'open' | 'paid' | 'cancelled';
}
