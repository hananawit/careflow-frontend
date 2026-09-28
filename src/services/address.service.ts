import { apiRequest } from "./api";

export interface AddressPayload {
  personProfileId: string;
  country?: string;
  region?: string;
  city?: string;
  subCity?: string;
  woreda?: string;
  kebele?: string;
  street?: string;
  houseNumber?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
}

export interface Address {
  id: string;
  personProfileId?: string | null;
  hospitalId?: string | null;
  country?: string | null;
  region?: string | null;
  city?: string | null;
  subCity?: string | null;
  woreda?: string | null;
  kebele?: string | null;
  street?: string | null;
  houseNumber?: string | null;
  postalCode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Create an address for a person.
 */
export async function createAddress(
  data: AddressPayload,
): Promise<Address> {
  return apiRequest<Address>(
    "/address",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );
}

/**
 * Get an address by ID.
 */
export async function getAddress(
  id: string,
): Promise<Address> {
  return apiRequest<Address>(
    `/address/${id}`,
  );
}

/**
 * Get all addresses.
 */
export async function getAddresses(
  page = 1,
  limit = 100,
): Promise<Address[]> {
  return apiRequest<Address[]>(
    `/address?page=${page}&limit=${limit}`,
  );
}

/**
 * Update an address.
 */
export async function updateAddress(
  id: string,
  data: Partial<AddressPayload>,
): Promise<Address> {
  return apiRequest<Address>(
    `/address/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    },
  );
}

/**
 * Delete an address.
 */
export async function deleteAddress(
  id: string,
): Promise<void> {
  await apiRequest(
    `/address/${id}`,
    {
      method: "DELETE",
    },
  );
}
