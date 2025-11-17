package edu.utn.alojamiento.listing

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ListingService(
	private val listingRepository: ListingRepository
) {

	@Transactional(readOnly = true)
	fun findAll(pageable: Pageable): Page<Listing> = listingRepository.findAll(pageable)

	@Transactional(readOnly = true)
	fun findById(id: Long): Listing =
		listingRepository.findById(id).orElseThrow { ListingNotFoundException(id) }

	@Transactional
	fun create(request: ListingRequest): Listing =
		listingRepository.save(
			Listing(
				title = request.title,
				description = request.description,
				nightlyPrice = request.nightlyPrice,
				city = request.city,
				maxGuests = request.maxGuests
			)
		)

	@Transactional
	fun update(id: Long, update: ListingUpdate): Listing {
		val existing = findById(id)
		update.title?.let { existing.title = it }
		update.description?.let { existing.description = it }
		update.nightlyPrice?.let { existing.nightlyPrice = it }
		update.city?.let { existing.city = it }
		update.maxGuests?.let { existing.maxGuests = it }
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
