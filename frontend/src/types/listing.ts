export interface Listing {
  id: number
  title: string
  description: string
  nightlyPrice: number
  bedrooms: number
  city: string
  maxGuests: number
}

export interface ListingRequest {
  title: string
  description: string
  nightlyPrice: number
  bedrooms: number
  city: string
  maxGuests: number
}

export type ListingUpdate = Partial<ListingRequest>

export interface Page<T> {
  content: T[]
  totalPages: number
  totalElements: number
  size: number
  number: number
}
