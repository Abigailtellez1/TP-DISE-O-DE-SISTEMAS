package edu.utn.alojamiento.reservation

import edu.utn.alojamiento.listing.Listing
import edu.utn.alojamiento.listing.ListingNotFoundException
import edu.utn.alojamiento.listing.ListingRepository
import edu.utn.alojamiento.user.UserNotFoundException
import edu.utn.alojamiento.user.UserRepository
import java.time.LocalDate
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.domain.Specification
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ReservationService(
	private val listingRepository: ListingRepository,
	private val userRepository: UserRepository,
	private val reservationRepository: ReservationRepository
) {

	@Transactional(readOnly = true)
	fun findAll(pageable: Pageable, filters: ReservationFilters): Page<ReservationResponse> =
		reservationRepository.findAll(buildSpecification(filters), pageable)
			.map { ReservationResponse.from(it) }

	@Transactional(readOnly = true)
	fun findById(id: Long): ReservationResponse = ReservationResponse.from(findReservation(id))

	@Transactional
	fun create(request: ReservationRequest): ReservationResponse {
		val listing = listingRepository.findById(request.listingId)
			.orElseThrow { ListingNotFoundException(request.listingId) }
		val guest = userRepository.findById(request.guestId)
			.orElseThrow { UserNotFoundException(request.guestId) }
		val reservation = reservationRepository.save(
			Reservation(
				listing = listing,
				guest = guest,
				checkIn = request.checkIn,
				checkOut = request.checkOut,
				guests = request.guests
			)
		)
		return ReservationResponse.from(reservation)
	}

	@Transactional
	fun update(id: Long, update: ReservationUpdate): ReservationResponse {
		val reservation = findReservation(id)
		update.listingId?.let { listingId ->
			reservation.listing = listingRepository.findById(listingId)
				.orElseThrow { ListingNotFoundException(listingId) }
		}
		update.guestId?.let { guestId ->
			reservation.guest = userRepository.findById(guestId)
				.orElseThrow { UserNotFoundException(guestId) }
		}
		update.checkIn?.let { reservation.checkIn = it }
		update.checkOut?.let { reservation.checkOut = it }
		update.guests?.let { reservation.guests = it }
		return ReservationResponse.from(reservationRepository.save(reservation))
	}

	@Transactional
	fun delete(id: Long) {
		if (!reservationRepository.existsById(id)) {
			throw ReservationNotFoundException(id)
		}
		reservationRepository.deleteById(id)
	}

	private fun findReservation(id: Long): Reservation =
		reservationRepository.findById(id).orElseThrow { ReservationNotFoundException(id) }

	private fun buildSpecification(filters: ReservationFilters): Specification<Reservation> {
		var spec: Specification<Reservation> = Specification.where(null)
		filters.listingId?.let { listingId ->
			spec = spec.and { root, _, cb -> cb.equal(root.get<Any>("listing").get<Long>("id"), listingId) }
		}
		filters.guestId?.let { guestId ->
			spec = spec.and { root, _, cb -> cb.equal(root.get<Any>("guest").get<String>("id"), guestId) }
		}
		return spec
	}
}
