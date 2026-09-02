import { apiClient } from '@/services/api/ApiClient'

export const arRepository = {
  getDashboard() {
    return apiClient.getClient().get('/finance/ar/dashboard')
  },

  getCustomers() {
    return apiClient.getClient().get('/finance/ar/customers')
  },

  getInvoices(params: { page?: number; status?: string; search?: string; customer_uuid?: string; per_page?: number } = {}) {
    return apiClient.getClient().get('/finance/ar/invoices', { params })
  },

  getInvoice(uuid: string) {
    return apiClient.getClient().get(`/finance/ar/invoices/${uuid}`)
  },

  createInvoice(data: {
    customer_uuid?: string | null
    customer_name: string
    customer_email?: string
    reference?: string
    invoice_date: string
    due_date: string
    payment_terms: string
    tax_rate?: number
    discount_amount?: number
    notes?: string
    terms_and_conditions?: string
    items: Array<{
      item_name: string
      description?: string
      quantity: number
      unit?: string
      unit_price: number
      discount_rate?: number
    }>
  }) {
    return apiClient.getClient().post('/finance/ar/invoices', data)
  },

  sendInvoice(uuid: string) {
    return apiClient.getClient().post(`/finance/ar/invoices/${uuid}/send`)
  },

  cancelInvoice(uuid: string, reason: string) {
    return apiClient.getClient().post(`/finance/ar/invoices/${uuid}/cancel`, { reason })
  },

  recordPayment(invoiceUuid: string, data: {
    payment_date: string
    amount: number
    payment_method: string
    reference_number?: string
    bank_account?: string
    notes?: string
  }) {
    return apiClient.getClient().post(`/finance/ar/invoices/${invoiceUuid}/payments`, data)
  }
}
