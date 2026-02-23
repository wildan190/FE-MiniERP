import { shiftService } from '../../services/hrm/shift'
import type {
  CreateShiftRequest,
  UpdateShiftRequest,
} from '../../services/hrm/types/shift.types'

export class ShiftRepository {
  async getShifts(page: number = 1) {
    return await shiftService.getShifts(page)
  }

  async createShift(data: CreateShiftRequest) {
    return await shiftService.createShift(data)
  }

  async updateShift(uuid: string, data: UpdateShiftRequest) {
    return await shiftService.updateShift(uuid, data)
  }

  async deleteShift(uuid: string) {
    return await shiftService.deleteShift(uuid)
  }
}

export const shiftRepository = new ShiftRepository()
