<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AppLayout from '@/layouts/AppLayout.vue'
import { financeSettingsRepository } from '@/repositories/finance/financeSettings.repository'
import {
  Settings, Key, Globe, CheckCircle2, XCircle, Loader2,
  Eye, EyeOff, Zap, Save, RefreshCw, ShieldCheck
} from 'lucide-vue-next'

// ── State ──────────────────────────────────────────────────────────────────
const loading  = ref(true)
const saving   = ref(false)
const testing  = ref(false)
const saved    = ref(false)

const form = ref({
  'midtrans_iris.api_key':      '',
  'midtrans_iris.merchant_key': '',
  'midtrans_iris.base_url':     '',
})

interface SettingMeta {
  key: string
  label: string
  value: string | null
  is_secret: boolean
  is_set: boolean
}

const settingsMeta = ref<Record<string, SettingMeta>>({})
const showSecrets  = ref<Record<string, boolean>>({})
const testResult   = ref<{ success: boolean; message: string; raw?: any } | null>(null)
const saveError    = ref('')

// ── Lifecycle ──────────────────────────────────────────────────────────────
onMounted(async () => {
  await fetchSettings()
})

async function fetchSettings() {
  loading.value = true
  try {
    const res  = await financeSettingsRepository.getMidtransSettings()
    const data = res.data.data as Record<string, SettingMeta>
    settingsMeta.value = data

    // Pre-fill base_url if it's not secret and has a value
    const baseUrlMeta = data['midtrans_iris.base_url']
    if (baseUrlMeta?.value && !baseUrlMeta.is_secret) {
      form.value['midtrans_iris.base_url'] = baseUrlMeta.value
    }
  } catch (e: any) {
    saveError.value = e.message
  } finally {
    loading.value = false
  }
}

// ── Actions ────────────────────────────────────────────────────────────────
async function handleSave() {
  saving.value = true
  saveError.value = ''
  saved.value = false

  try {
    const payload: Record<string, string | null> = {}

    for (const key of Object.keys(form.value) as Array<keyof typeof form.value>) {
      const val = form.value[key]
      // only send if user typed something (not empty placeholder)
      if (val && val.trim() !== '') {
        payload[key] = val.trim()
      }
    }

    await financeSettingsRepository.saveMidtransSettings(payload)
    saved.value = true
    await fetchSettings()

    setTimeout(() => { saved.value = false }, 3000)
  } catch (e: any) {
    saveError.value = e.response?.data?.message || e.message
  } finally {
    saving.value = false
  }
}

async function handleTest() {
  testing.value  = true
  testResult.value = null

  try {
    const res  = await financeSettingsRepository.testMidtransConnection()
    testResult.value = {
      success: res.data.success,
      message: res.data.message,
      raw:     res.data.raw_response,
    }
  } catch (e: any) {
    testResult.value = { success: false, message: e.response?.data?.message || 'Connection error' }
  } finally {
    testing.value = false
  }
}

function toggleSecret(key: string) {
  showSecrets.value[key] = !showSecrets.value[key]
}

const FIELD_CONFIG = [
  {
    key:         'midtrans_iris.api_key',
    label:       'Iris API Key',
    placeholder: 'Paste your Midtrans Iris API Key…',
    icon:        'Key',
    isSecret:    true,
    hint:        'Dapatkan dari Midtrans Dashboard → Iris → Settings → API Key',
  },
  {
    key:         'midtrans_iris.merchant_key',
    label:       'Iris Merchant Key',
    placeholder: 'Paste your Merchant Key…',
    icon:        'ShieldCheck',
    isSecret:    true,
    hint:        'Digunakan untuk validasi webhook disbursement',
  },
  {
    key:         'midtrans_iris.base_url',
    label:       'Iris API Base URL',
    placeholder: 'https://app.sandbox.midtrans.com/iris/api/v1',
    icon:        'Globe',
    isSecret:    false,
    hint:        'Gunakan sandbox URL untuk testing, production URL untuk live',
  },
]
</script>

<template>
  <AppLayout>
    <div class="p-6 max-w-3xl mx-auto space-y-6">

      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Settings class="h-6 w-6 text-primary-600" />
            Finance Settings
          </h1>
          <p class="text-gray-500 text-sm">Konfigurasi integrasi third-party Finance module</p>
        </div>
      </div>

      <!-- Midtrans Iris Card -->
      <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <!-- Card Header -->
        <div class="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-200">
              <Zap class="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 class="font-bold text-gray-900">Midtrans Iris Disbursement</h2>
              <p class="text-xs text-gray-400">Digunakan untuk pembayaran Account Payable ke vendor</p>
            </div>
          </div>

          <!-- Connection Status Badge -->
          <div v-if="!loading" class="flex items-center gap-2">
            <template v-if="settingsMeta['midtrans_iris.api_key']?.is_set">
              <span class="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
                <CheckCircle2 class="h-3.5 w-3.5" /> API Key Set
              </span>
            </template>
            <template v-else>
              <span class="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full">
                <XCircle class="h-3.5 w-3.5" /> Not Configured
              </span>
            </template>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="py-16 text-center text-gray-400">
          <Loader2 class="h-8 w-8 animate-spin mx-auto" />
        </div>

        <!-- Form -->
        <div v-else class="p-8 space-y-6">
          <div v-if="saveError" class="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-2xl">
            {{ saveError }}
          </div>

          <div v-for="field in FIELD_CONFIG" :key="field.key" class="space-y-1.5">
            <label class="block text-sm font-semibold text-gray-700">
              {{ field.label }}
              <span v-if="settingsMeta[field.key]?.is_set"
                class="ml-2 text-xs font-bold text-emerald-500">(saved)</span>
            </label>

            <div class="relative">
              <input
                v-model="form[field.key as keyof typeof form]"
                :type="field.isSecret && !showSecrets[field.key] ? 'password' : 'text'"
                :placeholder="settingsMeta[field.key]?.is_set ? '••••••••  (leave blank to keep current)' : field.placeholder"
                class="w-full px-4 py-3 pr-12 rounded-2xl border border-gray-200 text-sm font-mono bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-100 focus:border-primary-400 transition-all outline-none"
              />
              <button v-if="field.isSecret"
                @click="toggleSecret(field.key)"
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                <Eye v-if="!showSecrets[field.key]" class="h-4 w-4" />
                <EyeOff v-else class="h-4 w-4" />
              </button>
            </div>

            <p class="text-xs text-gray-400 pl-1">{{ field.hint }}</p>
          </div>

          <!-- Environment toggle hint -->
          <div class="p-4 bg-blue-50 border border-blue-100 rounded-2xl text-sm text-blue-700 space-y-1">
            <p class="font-bold">Sandbox vs Production</p>
            <p class="text-xs">
              Sandbox: <code class="bg-blue-100 px-1 rounded">https://app.sandbox.midtrans.com/iris/api/v1</code>
            </p>
            <p class="text-xs">
              Production: <code class="bg-blue-100 px-1 rounded">https://app.midtrans.com/iris/api/v1</code>
            </p>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-3 pt-2">
            <button
              @click="handleSave"
              :disabled="saving"
              class="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-2xl shadow-md shadow-primary-100 flex items-center gap-2 transition-all disabled:opacity-60">
              <Loader2 v-if="saving" class="h-4 w-4 animate-spin" />
              <Save v-else class="h-4 w-4" />
              {{ saving ? 'Saving…' : 'Save Settings' }}
            </button>

            <button
              @click="handleTest"
              :disabled="testing || !settingsMeta['midtrans_iris.api_key']?.is_set"
              class="px-5 py-2.5 border border-gray-200 text-gray-700 text-sm font-semibold rounded-2xl flex items-center gap-2 hover:bg-gray-50 transition-all disabled:opacity-40">
              <RefreshCw class="h-4 w-4" :class="testing ? 'animate-spin' : ''" />
              {{ testing ? 'Testing…' : 'Test Connection' }}
            </button>

            <!-- Save success badge -->
            <Transition name="fade">
              <span v-if="saved" class="flex items-center gap-1.5 text-sm font-bold text-emerald-600">
                <CheckCircle2 class="h-4 w-4" /> Saved!
              </span>
            </Transition>
          </div>

          <!-- Test Result -->
          <Transition name="slide">
            <div v-if="testResult" :class="[
              'p-4 rounded-2xl border text-sm space-y-2',
              testResult.success
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            ]">
              <div class="flex items-center gap-2 font-bold">
                <CheckCircle2 v-if="testResult.success" class="h-4 w-4" />
                <XCircle v-else class="h-4 w-4" />
                {{ testResult.message }}
              </div>
              <details v-if="testResult.raw" class="text-xs">
                <summary class="cursor-pointer font-semibold opacity-70">Raw response</summary>
                <pre class="mt-2 p-2 bg-white/50 rounded-xl overflow-x-auto">{{ JSON.stringify(testResult.raw, null, 2) }}</pre>
              </details>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Security Note -->
      <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 text-sm text-gray-500">
        <ShieldCheck class="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
        <p>
          API Key disimpan terenkripsi di database menggunakan <strong>AES-256-CBC</strong> (Laravel Crypt).
          Nilai asli tidak pernah ditampilkan kembali setelah disimpan.
        </p>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-enter-active, .slide-leave-active { transition: all 0.3s ease; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
