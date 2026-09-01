<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useProjectStore } from '@/stores/project';
import { X, Building2, Layers } from 'lucide-vue-next';
import Swal from 'sweetalert2';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(['close', 'saved']);
const projectStore = useProjectStore();

// ── Mode: 'prospect' | 'custom' ──────────────────────────────────────────
const mode = ref<'prospect' | 'custom'>('prospect');
const selectedProspectUuid = ref<string>('');

const defaultForm = () => ({
  name: '',
  client_name: '',
  start_date: '',
  end_date: '',
  status: 'pending_approval',
  priority: 'medium',
  value: 0,
  description: '',
});

const project = ref(defaultForm());
const isSubmitting = ref(false);

// Fetch won prospects when modal opens
watch(() => props.isOpen, async (open) => {
  if (open) {
    project.value = defaultForm();
    selectedProspectUuid.value = '';
    mode.value = 'prospect';
    await projectStore.fetchWonProspects();
  }
});

// Auto-fill form when a prospect is selected
watch(selectedProspectUuid, (uuid) => {
  if (!uuid) return;
  const prospect = projectStore.wonProspects.find(p => p.uuid === uuid);
  if (prospect) {
    project.value.name = prospect.title;
    project.value.client_name = prospect.client_name;
    project.value.value = prospect.expected_value || 0;
  }
});

const wonProspectsEmpty = computed(() => projectStore.wonProspects.length === 0);

const handleSubmit = async () => {
  if (mode.value === 'prospect' && !selectedProspectUuid.value) {
    Swal.fire({ icon: 'warning', title: 'Select a Prospect', text: 'Please select a CRM won prospect to link this project to.', confirmButtonColor: '#4F46E5' });
    return;
  }

  isSubmitting.value = true;
  try {
    const payload: any = { ...project.value };
    if (mode.value === 'prospect') {
      payload.prospect_uuid = selectedProspectUuid.value;
    }
    await projectStore.createProject(payload);
    Swal.fire({ icon: 'success', title: 'Project Created!', text: `"${project.value.name}" has been onboarded successfully.`, confirmButtonColor: '#10B981', timer: 2500, timerProgressBar: true });
    emit('saved');
    emit('close');
    project.value = defaultForm();
    selectedProspectUuid.value = '';
  } catch (err: any) {
    Swal.fire({ icon: 'error', title: 'Failed to Create Project', text: err.response?.data?.message || err.message || 'Unknown error', confirmButtonColor: '#EF4444' });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl animate-scale-up">

          <!-- Header -->
          <div class="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-primary-50 to-indigo-50">
            <div>
              <h2 class="text-xl font-bold text-gray-900">Onboard New Project</h2>
              <p class="text-xs text-gray-500 mt-0.5">Link to a won CRM prospect or create a custom internal project</p>
            </div>
            <button @click="emit('close')" class="p-2 hover:bg-white/60 rounded-xl transition-colors">
              <X class="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <!-- Mode Switcher -->
          <div class="px-6 pt-5">
            <div class="flex rounded-2xl bg-gray-100 p-1 gap-1">
              <button
                @click="mode = 'prospect'"
                :class="[
                  'flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all',
                  mode === 'prospect'
                    ? 'bg-white text-primary-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                ]"
              >
                <Building2 class="h-4 w-4" />
                From CRM Prospect
              </button>
              <button
                @click="mode = 'custom'"
                :class="[
                  'flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all',
                  mode === 'custom'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                ]"
              >
                <Layers class="h-4 w-4" />
                Custom / Internal
              </button>
            </div>
          </div>

          <form @submit.prevent="handleSubmit" class="p-6 space-y-4">

            <!-- ── PROSPECT MODE ─────────────────────────────────────────── -->
            <template v-if="mode === 'prospect'">
              <div class="space-y-1.5">
                <label class="text-sm font-semibold text-gray-700">Select Won CRM Prospect *</label>
                <div v-if="wonProspectsEmpty" class="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium text-center">
                  No prospects with status <strong>"Won"</strong> found. Mark a prospect as won in CRM first, or use Custom mode.
                </div>
                <select
                  v-else
                  v-model="selectedProspectUuid"
                  required
                  class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                >
                  <option value="">-- Select a won prospect --</option>
                  <option v-for="p in projectStore.wonProspects" :key="p.uuid" :value="p.uuid">
                    {{ p.title }} — {{ p.client_name }}
                  </option>
                </select>
              </div>

              <!-- Auto-filled preview from selected prospect -->
              <div v-if="selectedProspectUuid" class="grid grid-cols-2 gap-4 p-4 bg-primary-50 rounded-2xl border border-primary-100">
                <div class="col-span-2">
                  <p class="text-xs font-bold text-primary-600 uppercase tracking-wider mb-0.5">Project Name (auto-filled)</p>
                  <input v-model="project.name" type="text" required class="w-full px-3 py-2 rounded-xl border border-primary-200 bg-white text-sm" />
                </div>
                <div>
                  <p class="text-xs font-bold text-primary-600 uppercase tracking-wider mb-0.5">Client Name</p>
                  <input v-model="project.client_name" type="text" class="w-full px-3 py-2 rounded-xl border border-primary-200 bg-white text-sm" />
                </div>
                <div>
                  <p class="text-xs font-bold text-primary-600 uppercase tracking-wider mb-0.5">Project Value (Rp)</p>
                  <input v-model.number="project.value" type="number" class="w-full px-3 py-2 rounded-xl border border-primary-200 bg-white text-sm" />
                </div>
              </div>
            </template>

            <!-- ── CUSTOM / INTERNAL MODE ───────────────────────────────── -->
            <template v-else>
              <div class="grid grid-cols-2 gap-4">
                <div class="col-span-2 space-y-1.5">
                  <label class="text-sm font-semibold text-gray-700">Project Name *</label>
                  <input v-model="project.name" type="text" required placeholder="e.g. Internal CRM Upgrade" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
                </div>
                <div class="space-y-1.5">
                  <label class="text-sm font-semibold text-gray-700">Client / Department</label>
                  <input v-model="project.client_name" type="text" placeholder="e.g. IT Dept / Internal" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
                </div>
                <div class="space-y-1.5">
                  <label class="text-sm font-semibold text-gray-700">Project Value (Rp)</label>
                  <input v-model.number="project.value" type="number" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
                </div>
              </div>
            </template>

            <!-- ── SHARED FIELDS ─────────────────────────────────────────── -->
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="text-sm font-semibold text-gray-700">Priority</label>
                <select v-model="project.priority" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div class="space-y-1.5">
                <label class="text-sm font-semibold text-gray-700">Start Date</label>
                <input v-model="project.start_date" type="date" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
              </div>
              <div class="space-y-1.5">
                <label class="text-sm font-semibold text-gray-700">End Date</label>
                <input v-model="project.end_date" type="date" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
              </div>
              <div class="space-y-1.5">
                <label class="text-sm font-semibold text-gray-700">Initial Status</label>
                <select v-model="project.status" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none">
                  <option value="pending_approval">Pending Approval</option>
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                </select>
              </div>
            </div>

            <div class="space-y-1.5">
              <label class="text-sm font-semibold text-gray-700">Description / Scope</label>
              <textarea v-model="project.description" rows="3" placeholder="Project scope, objectives..." class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none resize-none"></textarea>
            </div>

            <div class="flex gap-3 pt-2 border-t border-gray-100">
              <button type="button" @click="emit('close')" class="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition text-sm">
                Cancel
              </button>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="flex-1 px-4 py-2.5 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition shadow-sm disabled:opacity-50 text-sm flex items-center justify-center gap-2"
              >
                <span v-if="isSubmitting">Creating...</span>
                <span v-else>🚀 Onboard Project</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
