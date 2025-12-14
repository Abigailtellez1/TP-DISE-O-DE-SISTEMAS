package edu.utn.alojamiento.reservation

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus

@ResponseStatus(HttpStatus.NOT_FOUND)
class ReservationNotFoundException(reservationId: Long) :
	RuntimeException("Reservation $reservationId not found")
