export interface UserProfile {
  id: string
  email: string
  name: string
  preferredBedrooms: number | null
  isLandlord: boolean
}

export interface UserProfileRequest {
  email: string
  name: string
  preferredBedrooms?: number | null
  isLandlord?: boolean
}

export interface ListingNotification {
  listingId: number
  listingTitle: string
  bedrooms: number
}
