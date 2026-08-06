import { defineStore } from 'pinia'
import { ref } from 'vue'
import { approvalRepository } from '@/repositories/approval.repository'

export const useApprovalStore = defineStore('approval', () => {
  const chains = ref<any[]>([])
  const pendingRequests = ref<any[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchChains() {
    isLoading.value = true
    try {
      const res = await approvalRepository.getChains()
      chains.value = res.data.data || []
    } catch (e: any) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  async function fetchPendingRequests() {
    isLoading.value = true
    try {
      const res = await approvalRepository.getPendingRequests()
      pendingRequests.value = res.data.data || []
    } catch (e: any) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  async function createChain(data: any) {
    const res = await approvalRepository.createChain(data)
    await fetchChains()
    return res.data
  }

  async function approveRequest(uuid: string, comments?: string) {
    const res = await approvalRepository.approveRequest(uuid, comments)
    await fetchPendingRequests()
    return res.data
  }

  async function rejectRequest(uuid: string, reason: string) {
    const res = await approvalRepository.rejectRequest(uuid, reason)
    await fetchPendingRequests()
    return res.data
  }

  return {
    chains,
    pendingRequests,
    isLoading,
    error,
    fetchChains,
    fetchPendingRequests,
    createChain,
    approveRequest,
    rejectRequest,
  }
})
