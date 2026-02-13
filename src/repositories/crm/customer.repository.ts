import { customerService, type CustomersListResponse, type CreateCustomerRequest, type CreateCustomerResponse } from '@/services'

export class CustomerRepository {
  async getCustomers(page: number = 1): Promise<CustomersListResponse> {
    return await customerService.getCustomers(page)
  }

  async createCustomer(data: CreateCustomerRequest): Promise<CreateCustomerResponse> {
    return await customerService.createCustomer(data)
  }
}

export const customerRepository = new CustomerRepository()
