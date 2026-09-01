<template>
  <AppLayout>
    <!-- Welcome Header Section -->
    <div class="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h2 class="text-3xl font-bold text-gray-900 tracking-tight">
          Selamat datang, {{ authStore.user?.name || 'Pengguna' }}! 👋
        </h2>
        <p class="text-gray-600 mt-1 text-sm md:text-base">
          {{ greeting }}
        </p>
      </div>
      <div class="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-gray-200 shadow-2xs self-start md:self-auto">
        <Globe class="h-4 w-4 text-blue-600" />
        <span class="text-xs font-bold text-gray-700 font-mono">{{ currentTimeString }}</span>
      </div>
    </div>

    <!-- Skeleton Loading State -->
    <div v-if="dashboardStore.isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card v-for="i in 4" :key="i">
        <Skeleton width="100%" height="5rem" borderRadius="0.75rem" />
      </Card>
    </div>

    <!-- Error State -->
    <Alert
      v-if="dashboardStore.error"
      :message="dashboardStore.error"
      @close="dashboardStore.clearError()"
      class="mb-6"
    />

    <!-- Main Dashboard Widgets Section -->
    <div v-else class="space-y-8 mb-8">
      <!-- Quick ERP Overview Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <div class="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Karyawan</span>
            <div class="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users class="h-4 w-4" />
            </div>
          </div>
          <p class="text-2xl font-extrabold text-gray-900">48</p>
          <p class="text-[11px] text-emerald-600 font-bold mt-1">↑ +3 bulan ini</p>
        </div>

        <div class="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Proyek Aktif</span>
            <div class="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Briefcase class="h-4 w-4" />
            </div>
          </div>
          <p class="text-2xl font-extrabold text-gray-900">12</p>
          <p class="text-[11px] text-blue-600 font-bold mt-1">8 dalam pengerjaan</p>
        </div>

        <div class="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Open PO</span>
            <div class="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShoppingBag class="h-4 w-4" />
            </div>
          </div>
          <p class="text-2xl font-extrabold text-gray-900">7</p>
          <p class="text-[11px] text-amber-600 font-bold mt-1">Menunggu barang datang</p>
        </div>

        <div class="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Persetujuan</span>
            <div class="h-9 w-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ShieldAlert class="h-4 w-4" />
            </div>
          </div>
          <p class="text-2xl font-extrabold text-gray-900">3</p>
          <p class="text-[11px] text-rose-600 font-bold mt-1">Butuh tindakan Anda</p>
        </div>
      </div>

      <!-- Live Widgets Grid (Weather & Currency) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Weather Widget (Cuaca) -->
        <div class="bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 text-white p-6 md:p-8 rounded-3xl shadow-xl shadow-blue-500/10 relative overflow-hidden flex flex-col justify-between min-h-[220px]">
          <!-- Decorative Shine Overlay -->
          <div class="absolute -right-12 -top-12 h-40 w-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

          <div class="flex items-start justify-between relative z-10">
            <div>
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-extrabold tracking-wider uppercase backdrop-blur-xs">
                  LIVE WEATHER
                </span>
                <span class="text-xs text-blue-100 font-medium">Jakarta, Indonesia</span>
              </div>
              <div class="mt-4 flex items-baseline gap-3">
                <span class="text-5xl md:text-6xl font-black tracking-tight">29°C</span>
                <span class="text-sm font-semibold text-blue-100">Cerah Berawan</span>
              </div>
            </div>

            <div class="h-16 w-16 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center shadow-inner border border-white/20">
              <CloudSun class="h-10 w-10 text-amber-300 drop-shadow-md" />
            </div>
          </div>

          <div class="grid grid-cols-3 gap-4 pt-6 border-t border-white/20 relative z-10 text-xs">
            <div class="flex items-center gap-2">
              <Droplets class="h-4 w-4 text-sky-200" />
              <div>
                <p class="text-[10px] text-blue-200 uppercase font-bold">Kelembapan</p>
                <p class="font-bold">74%</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <Wind class="h-4 w-4 text-sky-200" />
              <div>
                <p class="text-[10px] text-blue-200 uppercase font-bold">Angin</p>
                <p class="font-bold">12 km/h</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <Sun class="h-4 w-4 text-amber-300" />
              <div>
                <p class="text-[10px] text-blue-200 uppercase font-bold">Indeks UV</p>
                <p class="font-bold">Sedang (4)</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Currency Exchange Rates Widget (Kurs Mata Uang) -->
        <div class="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2.5">
              <div class="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Coins class="h-5 w-5" />
              </div>
              <div>
                <h3 class="font-bold text-gray-900 text-base">Kurs Mata Uang (IDR)</h3>
                <p class="text-xs text-gray-500">Nilai Tukar Rupiah Terkini</p>
              </div>
            </div>
            <button 
              @click="refreshRates"
              class="p-2 text-gray-400 hover:text-blue-600 hover:bg-gray-50 rounded-xl transition-colors"
              title="Perbarui Kurs"
            >
              <RefreshCw :class="{ 'animate-spin': isRefreshing }" class="h-4 w-4" />
            </button>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div v-for="rate in currencyRates" :key="rate.code" class="p-3.5 rounded-2xl bg-gray-50/80 border border-gray-100 flex items-center justify-between">
              <div>
                <div class="flex items-center gap-1.5">
                  <span class="text-xs font-bold text-gray-900 font-mono">{{ rate.code }}</span>
                  <span class="text-[10px] text-gray-400">/ IDR</span>
                </div>
                <p class="text-sm font-black text-gray-900 mt-0.5">Rp {{ rate.value.toLocaleString('id-ID') }}</p>
              </div>
              <span 
                class="text-[11px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-0.5"
                :class="rate.isUp ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'"
              >
                <TrendingUp v-if="rate.isUp" class="h-3 w-3" />
                <TrendingDown v-else class="h-3 w-3" />
                {{ rate.change }}
              </span>
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400 font-medium">
            <span>Sumber: Bank Indonesia (Dummy API)</span>
            <span>Diperbarui 5 menit lalu</span>
          </div>
        </div>
      </div>

      <!-- User Profile Info Summary Section -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div class="flex items-center gap-4">
            <div
              class="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-bold text-2xl shadow-md shadow-indigo-100 flex-shrink-0"
            >
              {{ authStore.user?.name?.charAt(0).toUpperCase() }}
            </div>
            <div class="min-w-0">
              <h3 class="text-lg font-bold text-gray-900 truncate">{{ authStore.user?.name }}</h3>
              <p class="text-sm text-gray-600 truncate">{{ authStore.user?.email }}</p>
              <p class="text-xs text-gray-400 mt-1 font-medium">
                Bergabung sejak {{ formatDate(authStore.user?.created_at) }}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="font-bold text-gray-900">Status Akun System</h3>
              <span class="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full uppercase tracking-wider">
                Aktif
              </span>
            </div>
            <div class="space-y-2.5 text-xs">
              <div class="flex justify-between items-center py-1 border-b border-gray-100">
                <span class="text-gray-500 font-medium">Verifikasi Email</span>
                <span v-if="authStore.user?.email_verified_at" class="text-emerald-600 font-bold"
                  >✓ Terverifikasi</span
                >
                <span v-else class="text-amber-600 font-bold">⚠ Belum Verifikasi</span>
              </div>
              <div class="flex justify-between items-center py-1">
                <span class="text-gray-500 font-medium">Terakhir Diperbarui</span>
                <span class="font-semibold text-gray-900">{{
                  formatDate(authStore.user?.updated_at)
                }}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useDashboardStore } from "@/stores/dashboard";
import AppLayout from "@/layouts/AppLayout.vue";
import Card from "@/components/common/Card.vue";
import Alert from "@/components/common/Alert.vue";
import Skeleton from "@/components/common/Skeleton.vue";
import { 
  Users, 
  Briefcase, 
  ShoppingBag, 
  ShieldAlert, 
  CloudSun, 
  Droplets, 
  Wind, 
  Sun, 
  Coins, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown, 
  Globe 
} from "lucide-vue-next";

const authStore = useAuthStore();
const dashboardStore = useDashboardStore();

const isRefreshing = ref(false);

const currencyRates = ref([
  { code: 'USD', value: 15850, change: '+0.35%', isUp: true },
  { code: 'EUR', value: 17220, change: '+0.12%', isUp: true },
  { code: 'SGD', value: 11910, change: '-0.08%', isUp: false },
  { code: 'JPY', value: 104.8, change: '+0.45%', isUp: true },
]);

const currentTimeString = computed(() => {
  return new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
});

const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return "Selamat pagi! Mulai hari yang produktif bersama MiniERP.";
  if (hour < 18) return "Selamat siang! Terus pantau kinerja operasional perusahaan Anda.";
  return "Selamat malam! Pantau ringkasan aktivitas ERP hari ini.";
});

const refreshRates = () => {
  isRefreshing.value = true;
  setTimeout(() => {
    currencyRates.value.forEach(r => {
      const delta = (Math.random() * 20 - 10);
      r.value = Math.round(r.value + delta);
    });
    isRefreshing.value = false;
  }, 600);
};

const formatDate = (date?: string) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

onMounted(async () => {
  await dashboardStore.fetchDashboard();
});
</script>
