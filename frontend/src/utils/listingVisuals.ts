import type { Listing } from '../types/listing'

const listingImagePool = [
  'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1505692794400-121d9a70e6c1?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1470246973918-0296177d0a08?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=900&q=80',
]

const ratingPool = [4.2, 4.4, 4.6, 4.8, 5]

export const getListingVisuals = (listing: Listing) => {
  const idx = listing.id % listingImagePool.length
  const ratingIdx = listing.id % ratingPool.length
  const baseReviews = 24 + listing.id * 7
  return {
    imageUrl: listingImagePool[idx],
    rating: ratingPool[ratingIdx],
    reviews: (baseReviews % 90) + 5,
    badges: [listing.city, listing.district],
  }
}
