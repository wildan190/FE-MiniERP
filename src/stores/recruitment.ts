import { defineStore } from 'pinia'
import { ref } from 'vue'
import { recruitmentRepository } from '@/repositories/hrm/recruitment.repository'

export const useRecruitmentStore = defineStore('recruitment', () => {
  const jobPosts = ref<any[]>([])
  const applicants = ref<any[]>([])
  const interviews = ref<any[]>([])
  const offerings = ref<any[]>([])
  const interviewers = ref<any[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // 0. Interviewers
  async function fetchInterviewers() {
    try {
      const res = await recruitmentRepository.getInterviewers()
      interviewers.value = res.data.data || []
    } catch (err: any) {
      console.error('Failed to fetch interviewers:', err)
    }
  }

  // 1. Job Posts
  async function fetchJobPosts(params: { status?: string; search?: string } = {}) {
    isLoading.value = true
    try {
      const res = await recruitmentRepository.getJobPosts(params)
      jobPosts.value = res.data.data || []
    } catch (err: any) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  async function createJobPost(data: any) {
    const res = await recruitmentRepository.createJobPost(data)
    await fetchJobPosts()
    return res.data
  }

  async function updateJobPost(uuid: string, data: any) {
    const res = await recruitmentRepository.updateJobPost(uuid, data)
    await fetchJobPosts()
    return res.data
  }

  async function deleteJobPost(uuid: string) {
    await recruitmentRepository.deleteJobPost(uuid)
    await fetchJobPosts()
  }

  // 2. Applicants
  async function fetchApplicants(params: { stage?: string; job_post_id?: any; search?: string } = {}) {
    isLoading.value = true
    try {
      const res = await recruitmentRepository.getApplicants(params)
      applicants.value = res.data.data || []
    } catch (err: any) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  async function createApplicant(data: any) {
    const res = await recruitmentRepository.createApplicant(data)
    await fetchApplicants()
    return res.data
  }

  async function updateApplicantStage(uuid: string, stage: string, notes?: string) {
    const res = await recruitmentRepository.updateApplicantStage(uuid, stage, notes)
    await fetchApplicants()
    return res.data
  }

  async function deleteApplicant(uuid: string) {
    await recruitmentRepository.deleteApplicant(uuid)
    await fetchApplicants()
  }

  // 3. Interviews
  async function fetchInterviews(params: { status?: string } = {}) {
    isLoading.value = true
    try {
      const res = await recruitmentRepository.getInterviews(params)
      interviews.value = res.data.data || []
    } catch (err: any) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  async function createInterview(data: any) {
    const res = await recruitmentRepository.createInterview(data)
    await fetchInterviews()
    await fetchApplicants()
    return res.data
  }

  async function updateInterview(uuid: string, data: any) {
    const res = await recruitmentRepository.updateInterview(uuid, data)
    await fetchInterviews()
    return res.data
  }

  async function deleteInterview(uuid: string) {
    await recruitmentRepository.deleteInterview(uuid)
    await fetchInterviews()
  }

  async function submitEvaluation(interviewUuid: string, data: any) {
    const res = await recruitmentRepository.submitEvaluation(interviewUuid, data)
    await fetchInterviews()
    return res.data
  }

  // 4. Offerings
  async function fetchOfferings() {
    isLoading.value = true
    try {
      const res = await recruitmentRepository.getOfferingLetters()
      offerings.value = res.data.data || []
    } catch (err: any) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  async function createOffering(data: any) {
    const res = await recruitmentRepository.createOfferingLetter(data)
    await fetchOfferings()
    await fetchApplicants()
    return res.data
  }

  async function updateOfferingStatus(uuid: string, status: string) {
    const res = await recruitmentRepository.updateOfferingStatus(uuid, status)
    await fetchOfferings()
    await fetchApplicants()
    return res.data
  }

  // 5. Onboarding / Convert to Employee
  async function convertToEmployee(applicantUuid: string) {
    const res = await recruitmentRepository.convertToEmployee(applicantUuid)
    await fetchApplicants()
    return res.data
  }

  return {
    jobPosts,
    applicants,
    interviews,
    offerings,
    interviewers,
    isLoading,
    error,
    fetchInterviewers,
    fetchJobPosts,
    createJobPost,
    updateJobPost,
    deleteJobPost,
    fetchApplicants,
    createApplicant,
    updateApplicantStage,
    deleteApplicant,
    fetchInterviews,
    createInterview,
    updateInterview,
    deleteInterview,
    submitEvaluation,
    fetchOfferings,
    createOffering,
    updateOfferingStatus,
    convertToEmployee,
  }
})
