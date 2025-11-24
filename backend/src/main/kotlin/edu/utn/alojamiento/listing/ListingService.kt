package edu.utn.alojamiento.listing

import java.util.concurrent.CopyOnWriteArraySet
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.domain.Specification
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ListingService(
	private val listingRepository: ListingRepository
) : ListingPublisher {

	private val observers = CopyOnWriteArraySet<ListingObserver>()

	@Transactional(readOnly = true)
	fun findAll(pageable: Pageable, filters: ListingFilters): Page<Listing> =
		listingRepository.findAll(buildSpecification(filters), pageable)

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
				district = request.district,
				ownerId = request.ownerId,
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
		update.district?.let { existing.district = it }
		update.ownerId?.let { existing.ownerId = it }
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

	private fun buildSpecification(filters: ListingFilters): Specification<Listing> {
		var spec: Specification<Listing> = Specification.where(null)
		filters.ownerId?.let { owner ->
			spec = spec.and { root, _, cb -> cb.equal(root.get<String>("ownerId"), owner) }
		}
		filters.district?.let { district ->
			spec = spec.and { root, _, cb -> cb.equal(root.get<String>("district"), district) }
		}
		filters.city?.let { city ->
			spec = spec.and { root, _, cb -> cb.equal(cb.lower(root.get("city")), city.lowercase()) }
		}
		return spec
	}
}
