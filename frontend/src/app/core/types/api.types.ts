import { API_ENDPOINTS } from "../constants/api-endpoints.constant";
import { STORAGE_KEYS } from "../constants/storage-keys.constant";

export type ApiEndpoint = typeof API_ENDPOINTS[keyof typeof API_ENDPOINTS];
export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];