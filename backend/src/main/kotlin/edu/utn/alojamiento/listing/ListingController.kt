package edu.utn.alojamiento.listing

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
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
	fun getListings(): List<Listing> = listingService.findAll()

	@GetMapping("/{id}")
	fun getListing(@PathVariable id: Long): Listing = listingService.findById(id)

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	fun createListing(@RequestBody listing: Listing): Listing = listingService.create(listing)

	@PutMapping("/{id}")
	fun updateListing(@PathVariable id: Long, @RequestBody listing: Listing): Listing =
		listingService.update(id, listing)

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	fun deleteListing(@PathVariable id: Long) {
		listingService.delete(id)
	}
}
