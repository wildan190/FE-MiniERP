import { apiClient } from '../api/ApiClient'
import type { Customer, CustomersListResponse, CreateCustomerRequest, CreateCustomerResponse } from './types'

export class CustomerService {
  async getCustomers(page: number = 1): Promise<CustomersListResponse> {
    const response = await apiClient.getClient().get<CustomersListResponse>('/crm/customers', {
      params: { page },
    })
    return response.data
  }

  async getCustomerById(id: number): Promise<Customer> {
    const resp = await apiClient.getClient().get<{ data: Customer }>(`/crm/customers/${id}`)
    return resp.data.data
  }

  async createCustomer(data: CreateCustomerRequest): Promise<CreateCustomerResponse> {
    const response = await apiClient.getClient().post<CreateCustomerResponse>('/crm/customers', data)
    return response.data
  }
}

export const customerService = new CustomerService()
