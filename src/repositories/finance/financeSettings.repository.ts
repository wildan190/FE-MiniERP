import { apiClient } from '@/services/api/ApiClient'

export const financeSettingsRepository = {
  getMidtransSettings() {
    return apiClient.getClient().get('/finance/settings/midtrans')
  },
  saveMidtransSettings(data: Record<string, string | null>) {
    return apiClient.getClient().post('/finance/settings/midtrans', data)
  },
  testMidtransConnection() {
    return apiClient.getClient().post('/finance/settings/midtrans/test')
  },
}
