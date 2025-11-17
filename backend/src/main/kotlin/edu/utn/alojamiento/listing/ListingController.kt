package edu.utn.alojamiento.listing

import jakarta.validation.Valid
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.web.PageableDefault
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/listings")
class ListingController(
	private val listingService: ListingService
) {

	@GetMapping
	fun getListings(
		@PageableDefault(page = 0, size = 20) pageable: Pageable
	): Page<Listing> = listingService.findAll(pageable)

	@GetMapping("/{id}")
	fun getListing(@PathVariable id: Long): Listing = listingService.findById(id)

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	fun createListing(@Valid @RequestBody request: ListingRequest): Listing =
		listingService.create(request)

	@PatchMapping("/{id}")
	fun updateListing(@PathVariable id: Long, @Valid @RequestBody update: ListingUpdate): Listing =
		listingService.update(id, update)

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	fun deleteListing(@PathVariable id: Long) {
		listingService.delete(id)
	}
}
