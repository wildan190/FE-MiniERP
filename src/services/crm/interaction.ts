import { apiClient } from '../api/ApiClient'
import type { Interaction } from './types'

export class InteractionService {
  async getCustomerInteractions(customerId: number): Promise<Interaction[]> {
    const response = await apiClient.getClient().get<{ data: Interaction[] }>(`/crm/customers/${customerId}/interactions`)
    return response.data.data
  }
}

export const interactionService = new InteractionService()
