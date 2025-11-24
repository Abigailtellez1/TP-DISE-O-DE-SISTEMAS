export interface Review {
  id: number
  listingId: number
  rating: number
  comment: string
  authorId: string
  authorName: string
  createdAt: string
}

export interface ReviewRequest {
  rating: number
  comment: string
  authorId: string
}

export interface ReviewsPage {
  content: Review[]
  totalPages: number
  totalElements: number
  size: number
  number: number
}
