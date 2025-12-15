package edu.utn.alojamiento.reservation

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
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/reservations")
class ReservationController(
	private val reservationService: ReservationService
) {

	@GetMapping
	fun getReservations(
		@PageableDefault(size = 20) pageable: Pageable,
		@RequestParam(required = false) listingId: Long?,
		@RequestParam(required = false) guestId: String?
	): Page<ReservationResponse> = reservationService.findAll(
		pageable = pageable,
		filters = ReservationFilters(listingId = listingId, guestId = guestId)
	)

	@GetMapping("/{id}")
	fun getReservation(@PathVariable id: Long): ReservationResponse = reservationService.findById(id)

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	fun createReservation(@Valid @RequestBody request: ReservationRequest): ReservationResponse =
		reservationService.create(request)

	@PatchMapping("/{id}")
	fun updateReservation(
		@PathVariable id: Long,
		@Valid @RequestBody update: ReservationUpdate
	): ReservationResponse = reservationService.update(id, update)

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	fun deleteReservation(@PathVariable id: Long) {
		reservationService.delete(id)
	}
}
