package edu.utn.alojamiento.listing

interface ListingObserver {
	fun onListingAvailable(listing: Listing)
}
