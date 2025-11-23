package edu.utn.alojamiento.listing

interface ListingPublisher {
	fun subscribe(observer: ListingObserver)
	fun unsubscribe(observer: ListingObserver)
	fun notifyObservers(listing: Listing)
}
