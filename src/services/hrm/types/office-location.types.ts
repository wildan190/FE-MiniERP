import type { PaginationLink } from '../../types';

export interface OfficeLocation {
  uuid: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  radius: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateOfficeLocationRequest {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  radius?: number | null;
  is_active?: boolean;
}

export interface UpdateOfficeLocationRequest {
  name?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  radius?: number | null;
  is_active?: boolean;
}

export interface OfficeLocationListResponse {
  data: OfficeLocation[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: PaginationLink[];
  };
}

export interface OfficeLocationResponse {
  data: OfficeLocation;
  message?: string;
}
