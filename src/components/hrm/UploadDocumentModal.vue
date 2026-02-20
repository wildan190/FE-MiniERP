<template>
  <div v-if="isOpen" class="fixed inset-0 z-[60] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" aria-hidden="true" @click="handleClose"></div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div class="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
        <div>
          <div class="flex items-center justify-center w-12 h-12 mx-auto bg-primary-100 rounded-full">
            <Upload class="w-6 h-6 text-primary-600" aria-hidden="true" />
          </div>
          <div class="mt-3 text-center sm:mt-5">
            <h3 class="text-lg font-medium leading-6 text-gray-900" id="modal-title">
              Upload Document
            </h3>
            <div class="mt-2">
              <p class="text-sm text-gray-500">
                Please upload the employee document. Max size is 2MB. (PDF, JPG, PNG)
              </p>
            </div>
          </div>
        </div>

        <form @submit.prevent="handleSubmit" class="mt-5 space-y-4">
          <!-- Document Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Document Type <span class="text-red-500">*</span>
            </label>
            <select
              v-model="formData.type"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="" disabled>Select type</option>
              <option value="ktp">KTP</option>
              <option value="npwp">NPWP</option>
              <option value="contract">Contract</option>
              <option value="certificate">Certificate</option>
              <option value="other">Other</option>
            </select>
            <p v-if="errors?.type" class="mt-1 text-xs text-red-600">{{ errors.type[0] }}</p>
          </div>

          <!-- File Upload -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              File <span class="text-red-500">*</span>
            </label>
            <div 
              class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-primary-500 transition-colors"
              @click="triggerFileInput()"
              @dragover.prevent
              @drop.prevent="handleFileDrop"
            >
              <div class="space-y-1 text-center">
                <FileText v-if="selectedFileName" class="mx-auto h-12 w-12 text-primary-500" />
                <Upload v-else class="mx-auto h-12 w-12 text-gray-400" />
                <div class="flex text-sm text-gray-600 justify-center">
                  <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                    <span>{{ selectedFileName ? 'Change file' : 'Upload a file' }}</span>
                    <input 
                      id="file-upload" 
                      ref="fileInput" 
                      name="file-upload" 
                      type="file" 
                      class="sr-only" 
                      accept=".pdf,.jpg,.jpeg,.png"
                      @change="handleFileChange"
                    >
                  </label>
                  <p class="pl-1" v-if="!selectedFileName">or drag and drop</p>
                </div>
                <p class="text-xs text-gray-500" v-if="!selectedFileName">
                  PDF, PNG, JPG up to 2MB
                </p>
                <p class="text-sm font-medium text-gray-900" v-else>
                  {{ selectedFileName }}
                </p>
              </div>
            </div>
            <p v-if="errors?.file" class="mt-1 text-xs text-red-600">{{ errors.file[0] }}</p>
            <p v-if="fileError" class="mt-1 text-xs text-red-600">{{ fileError }}</p>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              v-model="formData.description"
              rows="2"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="E.g., KTP valid for lifetime"
            ></textarea>
            <p v-if="errors?.description" class="mt-1 text-xs text-red-600">{{ errors.description[0] }}</p>
          </div>

          <!-- Expiry Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Expiry Date (Optional)
            </label>
            <input
              v-model="formData.expiry_date"
              type="date"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <p v-if="errors?.expiry_date" class="mt-1 text-xs text-red-600">{{ errors.expiry_date[0] }}</p>
          </div>

          <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
            <button
              type="submit"
              :disabled="loading || !formData.type || !selectedFile || !!fileError"
              class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loading ? 'Uploading...' : 'Upload' }}
            </button>
            <button
              type="button"
              @click="handleClose"
              class="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Upload, FileText } from 'lucide-vue-next';

interface Props {
  isOpen: boolean;
  loading: boolean;
  errors?: Record<string, string[]> | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: FormData): void
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const selectedFileName = ref<string>('');
const fileError = ref<string>('');

const formData = ref({
  type: '',
  description: '',
  expiry_date: ''
});

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    formData.value = {
      type: '',
      description: '',
      expiry_date: ''
    };
    selectedFile.value = null;
    selectedFileName.value = '';
    fileError.value = '';
  }
});

const validateFile = (file: File) => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
  const maxSize = 2 * 1024 * 1024; // 2MB

  if (!allowedTypes.includes(file.type)) {
    fileError.value = 'Invalid file type. Only PDF, JPG, and PNG are allowed.';
    return false;
  }

  if (file.size > maxSize) {
    fileError.value = 'File is too large. Maximum size is 2MB.';
    return false;
  }

  fileError.value = '';
  return true;
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.item(0);
  if (file) {
    if (validateFile(file)) {
      selectedFile.value = file;
      selectedFileName.value = file.name;
    } else {
      selectedFile.value = null;
      selectedFileName.value = '';
      if (fileInput.value) fileInput.value.value = ''; // Reset input
    }
  }
};

const handleFileDrop = (e: DragEvent) => {
  const file = e.dataTransfer?.files?.item(0);
  if (file) {
    if (validateFile(file)) {
      selectedFile.value = file;
      selectedFileName.value = file.name;
    }
  }
};

const handleSubmit = () => {
  if (!selectedFile.value) return;

  const data = new FormData();
  data.append('type', formData.value.type);
  data.append('file', selectedFile.value);
  
  if (formData.value.description) {
    data.append('description', formData.value.description);
  }
  
  if (formData.value.expiry_date) {
    data.append('expiry_date', formData.value.expiry_date);
  }

  emit('submit', data);
};

const handleClose = () => {
  emit('close');
};
</script>
