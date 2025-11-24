import { apiRequest } from './client'
import type { ReviewRequest, ReviewsPage, Review } from '../types/review'

export const fetchReviews = (listingId: number, page = 0, size = 10) =>
  apiRequest<ReviewsPage>(`/api/listings/${listingId}/reviews`, {
    query: { page, size },
  })

export const createReview = (listingId: number, payload: ReviewRequest) =>
  apiRequest<Review>(`/api/listings/${listingId}/reviews`, {
    method: 'POST',
    body: payload,
  })
