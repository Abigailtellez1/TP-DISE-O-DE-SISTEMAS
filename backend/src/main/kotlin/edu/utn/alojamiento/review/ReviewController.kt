package edu.utn.alojamiento.review

import jakarta.validation.Valid
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.web.PageableDefault
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/listings/{listingId}/reviews")
class ReviewController(
	private val reviewService: ReviewService
) {

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	fun createReview(
		@PathVariable listingId: Long,
		@Valid @RequestBody request: ReviewRequest
	): ReviewResponse = reviewService.addReview(listingId, request)

	@GetMapping
	fun getReviews(
		@PathVariable listingId: Long,
		@PageableDefault(size = 10) pageable: Pageable
	): Page<ReviewResponse> = reviewService.getReviews(listingId, pageable)
}
