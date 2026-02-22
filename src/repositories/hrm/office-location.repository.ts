import {
  officeLocationService,
  type OfficeLocationListResponse,
  type OfficeLocationResponse,
  type CreateOfficeLocationRequest,
  type UpdateOfficeLocationRequest,
} from '../../services/hrm/office-location'

export class OfficeLocationRepository {
  async getOfficeLocations(page: number = 1): Promise<OfficeLocationListResponse> {
    return await officeLocationService.getOfficeLocations(page)
  }

  async getOfficeLocationDetail(uuid: string): Promise<OfficeLocationResponse> {
    return await officeLocationService.getOfficeLocationDetail(uuid)
  }

  async createOfficeLocation(data: CreateOfficeLocationRequest): Promise<OfficeLocationResponse> {
    return await officeLocationService.createOfficeLocation(data)
  }

  async updateOfficeLocation(
    uuid: string,
    data: UpdateOfficeLocationRequest
  ): Promise<OfficeLocationResponse> {
    return await officeLocationService.updateOfficeLocation(uuid, data)
  }

  async deleteOfficeLocation(uuid: string): Promise<{ message: string }> {
    return await officeLocationService.deleteOfficeLocation(uuid)
  }
}

export const officeLocationRepository = new OfficeLocationRepository()
