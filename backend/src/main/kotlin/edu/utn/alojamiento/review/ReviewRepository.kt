package edu.utn.alojamiento.review

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository

interface ReviewRepository : JpaRepository<Review, Long> {
	fun findByListingId(listingId: Long, pageable: Pageable): Page<Review>
}
