<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Employee Documents</h3>
      <button
        @click="$emit('upload')"
        class="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
      >
        <Upload class="h-4 w-4" />
        Upload Document
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-8">
      <Spinner />
    </div>

    <!-- Empty State -->
    <div v-else-if="documents.length === 0" class="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
      <FileText class="h-8 w-8 text-gray-400 mx-auto mb-2" />
      <p class="text-sm font-medium text-gray-900">No documents found</p>
      <p class="text-sm text-gray-500 mt-1">Upload necessary documents like KTP, NPWP, or Contracts.</p>
    </div>

    <!-- Document List -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div 
        v-for="doc in documents" 
        :key="doc.uuid"
        class="bg-white border text-left border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow relative group"
      >
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-3">
            <div :class="getTypeColor(doc.type)" class="p-2 rounded-lg flex-shrink-0">
              <FileText class="h-5 w-5" />
            </div>
            <div>
              <p class="font-medium text-gray-900 text-sm uppercase">{{ doc.type }}</p>
              <p class="text-xs text-gray-500 mt-0.5 truncate max-w-[150px]" :title="doc.description || 'No description'">
                {{ doc.description || 'No description' }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-1">
            <button 
              @click="handleView(doc)"
              class="p-1.5 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
              title="View Document"
            >
              <Eye class="h-4 w-4" />
            </button>
            <button 
              @click="handleDelete(doc.uuid)"
              class="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              title="Delete Document"
            >
              <Trash2 class="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div class="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <div class="flex items-center gap-1.5">
            <Calendar class="h-3.5 w-3.5" />
            <span>Added: {{ formatDate(doc.created_at) }}</span>
          </div>
          <div v-if="doc.expiry_date" class="flex items-center gap-1.5" :class="isExpired(doc.expiry_date) ? 'text-red-600 font-medium' : ''">
            <Clock class="h-3.5 w-3.5" />
            <span>Exp: {{ formatDate(doc.expiry_date) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Upload, FileText, Trash2, Calendar, Clock, Eye } from 'lucide-vue-next'
import Spinner from '../common/Spinner.vue'
import type { EmployeeDocument } from '../../services/hrm/types/employee-document.types'

interface Props {
  documents: EmployeeDocument[];
  loading?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'upload'): void
  (e: 'delete', uuid: string): void
}>();

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const isExpired = (dateString: string) => {
  return new Date(dateString) < new Date();
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'ktp': return 'bg-blue-100 text-blue-600';
    case 'npwp': return 'bg-purple-100 text-purple-600';
    case 'contract': return 'bg-emerald-100 text-emerald-600';
    case 'certificate': return 'bg-amber-100 text-amber-600';
    default: return 'bg-gray-100 text-gray-600';
  }
};

const handleView = (doc: EmployeeDocument) => {
  // Construct the file URL based on the backend storage URL.
  // Tries to derive the base URL from the current app or fallback to localhost.
  const apiBase = (window as any).__API_BASE__ || 
    (window.location.hostname === 'localhost' ? 'http://localhost:8000' : window.location.origin);
  const url = `${apiBase}/storage/${doc.file_path}`;
  
  window.open(url, '_blank');
};

const handleDelete = (uuid: string) => {
  emit('delete', uuid);
};
</script>
