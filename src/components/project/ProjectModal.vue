<script setup lang="ts">
import { ref } from 'vue';
import { useProjectStore } from '@/stores/project';
import { X } from 'lucide-vue-next';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(['close', 'saved']);
const projectStore = useProjectStore();

const project = ref({
  name: '',
  client_name: '',
  start_date: '',
  end_date: '',
  status: 'active',
  priority: 'medium',
  value: 0,
  description: ''
});

const handleSubmit = async () => {
  await projectStore.createProject(project.value);
  emit('saved');
  emit('close');
  // Reset
  project.value = {
    name: '',
    client_name: '',
    start_date: '',
    end_date: '',
    status: 'active',
    priority: 'medium',
    value: 0,
    description: ''
  };
};
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl animate-scale-up">
          <div class="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <h2 class="text-xl font-bold text-gray-900">Create New Project</h2>
            <button @click="emit('close')" class="p-2 hover:bg-gray-200 rounded-xl transition-colors">
              <X class="h-5 w-5 text-gray-500" />
            </button>
          </div>
          
          <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="col-span-2 space-y-1.5">
                <label class="text-sm font-semibold text-gray-700">Project Name</label>
                <input v-model="project.name" type="text" required class="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
              </div>
              <div class="space-y-1.5">
                <label class="text-sm font-semibold text-gray-700">Client Name</label>
                <input v-model="project.client_name" type="text" class="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
              </div>
              <div class="space-y-1.5">
                <label class="text-sm font-semibold text-gray-700">Project Value (Rp)</label>
                <input v-model.number="project.value" type="number" class="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
              </div>
              <div class="space-y-1.5">
                <label class="text-sm font-semibold text-gray-700">Start Date</label>
                <input v-model="project.start_date" type="date" required class="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
              </div>
              <div class="space-y-1.5">
                <label class="text-sm font-semibold text-gray-700">End Date</label>
                <input v-model="project.end_date" type="date" class="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
              </div>
              <div class="col-span-2 space-y-1.5">
                <label class="text-sm font-semibold text-gray-700">Description</label>
                <textarea v-model="project.description" rows="3" class="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500"></textarea>
              </div>
            </div>

            <div class="pt-4 flex gap-3">
              <button type="button" @click="emit('close')" class="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50">Cancel</button>
              <button type="submit" class="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 shadow-lg shadow-primary-200">Create Project</button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@keyframes scaleUp {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-scale-up { animation: scaleUp 0.3s ease-out; }
</style>
