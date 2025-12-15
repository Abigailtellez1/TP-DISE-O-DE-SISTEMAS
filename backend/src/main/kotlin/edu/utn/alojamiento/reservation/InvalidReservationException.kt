package edu.utn.alojamiento.reservation

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus

@ResponseStatus(HttpStatus.BAD_REQUEST)
class InvalidReservationException(message: String) : RuntimeException(message)
