import { apiClient } from '../api/ApiClient'
import type {
  OfficeLocationListResponse,
  OfficeLocationResponse,
  CreateOfficeLocationRequest,
  UpdateOfficeLocationRequest,
} from './types/office-location.types'

export type {
  OfficeLocationListResponse,
  OfficeLocationResponse,
  CreateOfficeLocationRequest,
  UpdateOfficeLocationRequest,
}

export class OfficeLocationService {
  async getOfficeLocations(page: number = 1): Promise<OfficeLocationListResponse> {
    const response = await apiClient.getClient().get('/hrm/office-locations', {
      params: { page },
    })
    return response.data
  }

  async getOfficeLocationDetail(uuid: string): Promise<OfficeLocationResponse> {
    const response = await apiClient.getClient().get(`/hrm/office-locations/${uuid}`)
    return response.data
  }

  async createOfficeLocation(data: CreateOfficeLocationRequest): Promise<OfficeLocationResponse> {
    const response = await apiClient.getClient().post('/hrm/office-locations', data)
    return response.data
  }

  async updateOfficeLocation(
    uuid: string,
    data: UpdateOfficeLocationRequest
  ): Promise<OfficeLocationResponse> {
    const response = await apiClient.getClient().put(`/hrm/office-locations/${uuid}`, data)
    return response.data
  }

  async deleteOfficeLocation(uuid: string): Promise<{ message: string }> {
    const response = await apiClient.getClient().delete(`/hrm/office-locations/${uuid}`)
    return response.data
  }
}

export const officeLocationService = new OfficeLocationService()
