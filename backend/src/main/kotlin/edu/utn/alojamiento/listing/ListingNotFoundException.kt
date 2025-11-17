package edu.utn.alojamiento.listing

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus

@ResponseStatus(HttpStatus.NOT_FOUND)
class ListingNotFoundException(listingId: Long) :
	RuntimeException("Listing $listingId not found")
