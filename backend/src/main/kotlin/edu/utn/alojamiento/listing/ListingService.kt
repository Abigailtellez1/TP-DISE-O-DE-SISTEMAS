package edu.utn.alojamiento.listing

import java.util.concurrent.CopyOnWriteArraySet
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ListingService(
	private val listingRepository: ListingRepository
) : ListingPublisher {

	private val observers = CopyOnWriteArraySet<ListingObserver>()

	@Transactional(readOnly = true)
	fun findAll(pageable: Pageable): Page<Listing> = listingRepository.findAll(pageable)

	@Transactional(readOnly = true)
	fun findById(id: Long): Listing =
		listingRepository.findById(id).orElseThrow { ListingNotFoundException(id) }

	@Transactional
	fun create(request: ListingRequest): Listing {
		val listing = listingRepository.save(
			Listing(
				title = request.title,
				description = request.description,
				nightlyPrice = request.nightlyPrice,
				bedrooms = request.bedrooms,
				city = request.city,
				maxGuests = request.maxGuests
			)
		)
		notifyObservers(listing)
		return listing
	}

	@Transactional
	fun update(id: Long, update: ListingUpdate): Listing {
		val existing = findById(id)
		update.title?.let { existing.title = it }
		update.description?.let { existing.description = it }
		update.nightlyPrice?.let { existing.nightlyPrice = it }
		update.bedrooms?.let { existing.bedrooms = it }
		update.city?.let { existing.city = it }
		update.maxGuests?.let { existing.maxGuests = it }
		val saved = listingRepository.save(existing)
		notifyObservers(saved)
		return saved
	}

	@Transactional
	fun delete(id: Long) {
		if (!listingRepository.existsById(id)) {
			throw ListingNotFoundException(id)
		}
		listingRepository.deleteById(id)
	}

	override fun subscribe(observer: ListingObserver) {
		observers.add(observer)
	}

	override fun unsubscribe(observer: ListingObserver) {
		observers.remove(observer)
	}

	override fun notifyObservers(listing: Listing) {
		observers.forEach { it.onListingAvailable(listing) }
	}
}
