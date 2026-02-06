import { apiClient } from '../api/ApiClient'
import type { Order } from './types'

export class OrderService {
  async getOrders(page: number = 1): Promise<Order[]> {
    const response = await apiClient.getClient().get<{ data: Order[] }>('/crm/orders', {
      params: { page },
    })
    return response.data.data
  }

  async getCustomerOrders(customerId: number): Promise<Order[]> {
    const response = await apiClient.getClient().get<{ data: Order[] }>(`/crm/customers/${customerId}/orders`)
    return response.data.data
  }
}

export const orderService = new OrderService()
