export interface UserProfile {
  id: string
  email: string
  name: string
  type: 'STUDENT' | 'LANDLORD'
  preferredBedrooms: number | null
}

export interface UserProfileRequest {
  email: string
  name: string
  preferredBedrooms?: number | null
  type?: 'STUDENT' | 'LANDLORD'
}

export interface ListingNotification {
  listingId: number
  listingTitle: string
  bedrooms: number
}
