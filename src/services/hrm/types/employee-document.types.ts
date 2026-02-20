export interface EmployeeDocument {
  id: number;
  uuid: string;
  employee_id: number;
  type: 'ktp' | 'npwp' | 'contract' | 'certificate' | 'other';
  file_path: string;
  expiry_date: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface EmployeeDocumentListResponse {
  message: string;
  data: EmployeeDocument[];
}

export interface CreateEmployeeDocumentRequest {
  type: 'ktp' | 'npwp' | 'contract' | 'certificate' | 'other';
  file: File;
  expiry_date?: string | null;
  description?: string | null;
}

export interface CreateEmployeeDocumentResponse {
  message: string;
  data: EmployeeDocument;
}
