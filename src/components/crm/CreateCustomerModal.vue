<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen px-2 py-4 sm:px-4 sm:py-0 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="close"></div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full max-w-full sm:max-w-4xl">
        <div class="bg-white px-3 py-4 sm:px-6 sm:py-6">
          <div class="sm:flex sm:items-start">
            <div class="text-left w-full">
              <h3 class="text-lg leading-6 font-bold text-gray-900 mb-6" id="modal-title">Create New Customer</h3>
              
              <div v-if="errorMessage" class="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm text-red-700">
                      {{ errorMessage }}
                    </p>
                  </div>
                </div>
              </div>

              <form @submit.prevent="handleSubmit">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- General Information -->
                  <div class="md:col-span-2">
                    <h4 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 border-b pb-2">General Information</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField label="Name" v-model="form.name" placeholder="e.g. PT Maju Jaya" required :error="errors?.name?.[0]" />
                      <FormField label="Email" type="email" v-model="form.email" placeholder="e.g. contact@majujaya.com" required :error="errors?.email?.[0]" />
                      <FormField label="Phone" v-model="form.phone" placeholder="e.g. +62 812 3456 7890" :error="errors?.phone?.[0]" />
                      <FormField label="Alt Phone" v-model="form.alt_phone" placeholder="e.g. +62 21 555 1234" :error="errors?.alt_phone?.[0]" />
                      <FormField label="Company Name" v-model="form.company_name" placeholder="e.g. PT Maju Jaya Sentosa" :error="errors?.company_name?.[0]" />
                      <FormField label="Website" type="url" v-model="form.website" placeholder="https://majujaya.com" :error="errors?.website?.[0]" />
                    </div>
                  </div>

                  <!-- Business Details -->
                  <div class="md:col-span-2">
                    <h4 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 border-b pb-2 mt-4">Business Details</h4>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <SelectField label="Customer Type" v-model="form.customer_type" placeholder="Select customer type" required :error="errors?.customer_type?.[0]">
                        <option value="corporate">Corporate</option>
                        <option value="individual">Individual</option>
                      </SelectField>
                      <FormField label="Industry" v-model="form.industry" placeholder="e.g. Manufacturing, Retail" :error="errors?.industry?.[0]" />
                      <FormField label="Segment" v-model="form.segment" placeholder="e.g. Enterprise, SMB" :error="errors?.segment?.[0]" />
                      <FormField label="Tax ID" v-model="form.tax_id" placeholder="NPWP / Tax Number" :error="errors?.tax_id?.[0]" />
                      <FormField label="Currency" v-model="form.currency" placeholder="e.g. IDR, USD" :error="errors?.currency?.[0]" />
                      <SelectField label="Status" v-model="form.status" placeholder="Select status" required :error="errors?.status?.[0]">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="blocked">Blocked</option>
                      </SelectField>
                    </div>
                  </div>

                  <!-- Address -->
                  <div class="md:col-span-2">
                    <h4 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 border-b pb-2 mt-4">Address</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div class="md:col-span-2">
                        <FormField label="Billing Address" v-model="form.billing_address" placeholder="Full billing address" :error="errors?.billing_address?.[0]" />
                      </div>
                      <div class="md:col-span-2">
                        <FormField label="Shipping Address" v-model="form.shipping_address" placeholder="Full shipping address" :error="errors?.shipping_address?.[0]" />
                      </div>
                      <FormField label="City" v-model="form.city" placeholder="City name" :error="errors?.city?.[0]" />
                      <FormField label="Province" v-model="form.province" placeholder="Province / State" :error="errors?.province?.[0]" />
                      <FormField label="Postal Code" v-model="form.postal_code" placeholder="Postal Code" :error="errors?.postal_code?.[0]" />
                      <FormField label="Country" v-model="form.country" placeholder="Country" :error="errors?.country?.[0]" />
                    </div>
                  </div>

                  <!-- Financial -->
                  <div class="md:col-span-2">
                    <h4 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 border-b pb-2 mt-4">Financial & Others</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField label="Credit Limit" type="number" v-model="form.credit_limit" placeholder="0" :error="errors?.credit_limit?.[0]" />
                      <FormField label="Payment Terms" v-model="form.payment_terms" placeholder="e.g. Net 30" :error="errors?.payment_terms?.[0]" />
                      <div class="md:col-span-2">
                         <FormField label="Department" v-model="form.department" placeholder="e.g. Procurement" :error="errors?.department?.[0]" />
                      </div>
                      <div class="md:col-span-2">
                         <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                         <textarea 
                           v-model="form.notes" 
                           rows="3" 
                           class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                           placeholder="Additional notes..."
                         ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </form>

            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-3 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-100">
          <button type="button" @click="handleSubmit" :disabled="isSubmitting" class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors">
            {{ isSubmitting ? 'Creating...' : 'Create Customer' }}
          </button>
          <button type="button" @click="close" class="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import type { CreateCustomerRequest } from '../../services';
import FormField from '../common/FormField.vue';
import SelectField from '../common/SelectField.vue';

defineProps<{
  isOpen: boolean;
  errors?: Record<string, string[]> | null;
  errorMessage?: string | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'submit', data: CreateCustomerRequest): void;
}>();

const isSubmitting = ref(false);

// Initialize form with all fields
const form = reactive<any>({
  name: '',
  email: '',
  phone: '',
  alt_phone: '',
  company_name: '',
  customer_type: '',
  tax_id: '',
  industry: '',
  website: '',
  department: '',
  billing_address: '',
  shipping_address: '',
  city: '',
  province: '',
  postal_code: '',
  country: '',
  credit_limit: '',
  payment_terms: '',
  currency: '',
  segment: '',
  status: '',
  notes: ''
});

const close = () => {
  emit('close');
};

const handleSubmit = async () => {
  if (!form.name || !form.email) return;

  isSubmitting.value = true;
  try {
    // Clean up empty strings to undefined or null if needed, 
    // but typically the API might accept empty strings. 
    // Types confirm optional string.
    emit('submit', { ...form });
    
    // Reset form manually or just close
    // In a real app, you might want to reset only on success, which parent handles via v-if or by not closing on error.
    // Ideally we reset when reopening. For now, simple reset.
    Object.keys(form).forEach(key => {
      form[key] = '';
    });
    
  } finally {
    isSubmitting.value = false;
  }
};
</script>
