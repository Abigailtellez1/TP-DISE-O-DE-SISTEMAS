package edu.utn.alojamiento.listing

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ListingService(
	private val listingRepository: ListingRepository
) {

	@Transactional(readOnly = true)
	fun findAll(): List<Listing> = listingRepository.findAll()

	@Transactional(readOnly = true)
	fun findById(id: Long): Listing =
		listingRepository.findById(id).orElseThrow { ListingNotFoundException(id) }

	@Transactional
	fun create(listing: Listing): Listing = listingRepository.save(listing)

	@Transactional
	fun update(id: Long, updatedListing: Listing): Listing {
		val existing = findById(id)
		existing.title = updatedListing.title
		existing.description = updatedListing.description
		existing.nightlyPrice = updatedListing.nightlyPrice
		existing.city = updatedListing.city
		existing.maxGuests = updatedListing.maxGuests
		return listingRepository.save(existing)
	}

	@Transactional
	fun delete(id: Long) {
		if (!listingRepository.existsById(id)) {
			throw ListingNotFoundException(id)
		}
		listingRepository.deleteById(id)
	}
}
