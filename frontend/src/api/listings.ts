import { apiRequest } from './client'
import type { Listing, ListingRequest, ListingUpdate, Page } from '../types/listing'

export const fetchListings = (page = 0, size = 10) =>
  apiRequest<Page<Listing>>('/api/listings', { query: { page, size } })

export const fetchListing = (id: number) =>
  apiRequest<Listing>(`/api/listings/${id}`)

export const createListing = (payload: ListingRequest) =>
  apiRequest<Listing>('/api/listings', {
    method: 'POST',
    body: payload,
  })

export const updateListing = (id: number, payload: ListingUpdate) =>
  apiRequest<Listing>(`/api/listings/${id}`, {
    method: 'PATCH',
    body: payload,
  })

export const deleteListing = (id: number) =>
  apiRequest<void>(`/api/listings/${id}`, { method: 'DELETE' })
