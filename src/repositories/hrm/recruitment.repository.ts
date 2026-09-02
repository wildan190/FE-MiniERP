import { apiClient } from '@/services/api/ApiClient'

export const recruitmentRepository = {
  // Job Posts
  getJobPosts(params: { status?: string; search?: string } = {}) {
    return apiClient.getClient().get('/hrm/recruitment/jobs', { params })
  },
  createJobPost(data: any) {
    return apiClient.getClient().post('/hrm/recruitment/jobs', data)
  },
  updateJobPost(uuid: string, data: any) {
    return apiClient.getClient().put(`/hrm/recruitment/jobs/${uuid}`, data)
  },
  deleteJobPost(uuid: string) {
    return apiClient.getClient().delete(`/hrm/recruitment/jobs/${uuid}`)
  },

  // Applicants
  getApplicants(params: { stage?: string; job_post_id?: any; search?: string } = {}) {
    return apiClient.getClient().get('/hrm/recruitment/applicants', { params })
  },
  createApplicant(data: any) {
    return apiClient.getClient().post('/hrm/recruitment/applicants', data)
  },
  updateApplicantStage(uuid: string, stage: string, notes?: string) {
    return apiClient.getClient().put(`/hrm/recruitment/applicants/${uuid}/stage`, { stage, notes })
  },
  deleteApplicant(uuid: string) {
    return apiClient.getClient().delete(`/hrm/recruitment/applicants/${uuid}`)
  },

  // Interviewers by HR Roles
  getInterviewers() {
    return apiClient.getClient().get('/hrm/recruitment/interviewers')
  },

  // Interviews
  getInterviews(params: { status?: string } = {}) {
    return apiClient.getClient().get('/hrm/recruitment/interviews', { params })
  },
  createInterview(data: any) {
    return apiClient.getClient().post('/hrm/recruitment/interviews', data)
  },
  updateInterview(uuid: string, data: any) {
    return apiClient.getClient().put(`/hrm/recruitment/interviews/${uuid}`, data)
  },
  deleteInterview(uuid: string) {
    return apiClient.getClient().delete(`/hrm/recruitment/interviews/${uuid}`)
  },
  submitEvaluation(interviewUuid: string, data: any) {
    return apiClient.getClient().post(`/hrm/recruitment/interviews/${interviewUuid}/evaluations`, data)
  },

  // Offerings
  getOfferingLetters() {
    return apiClient.getClient().get('/hrm/recruitment/offerings')
  },
  createOfferingLetter(data: any) {
    return apiClient.getClient().post('/hrm/recruitment/offerings', data)
  },
  updateOfferingStatus(uuid: string, status: string) {
    return apiClient.getClient().put(`/hrm/recruitment/offerings/${uuid}/status`, { status })
  },

  // Convert to Employee
  convertToEmployee(applicantUuid: string) {
    return apiClient.getClient().post(`/hrm/recruitment/applicants/${applicantUuid}/convert-employee`)
  }
}
