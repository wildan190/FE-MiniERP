import { attendanceService } from '../../services/hrm/attendance'
import type {
  AttendanceFilters,
  ClockInRequest,
  ClockOutRequest,
} from '../../services/hrm/types/attendance.types'

export class AttendanceRepository {
  async getAttendances(filters: AttendanceFilters = {}, page: number = 1) {
    return attendanceService.getAttendances(filters, page)
  }

  async clockIn(data: ClockInRequest) {
    return attendanceService.clockIn(data)
  }

  async clockOut(data: ClockOutRequest) {
    return attendanceService.clockOut(data)
  }
}

export const attendanceRepository = new AttendanceRepository()
