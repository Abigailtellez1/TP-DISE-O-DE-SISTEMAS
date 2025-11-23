package edu.utn.alojamiento.notification

import edu.utn.alojamiento.listing.Listing
import edu.utn.alojamiento.listing.ListingObserver
import edu.utn.alojamiento.listing.ListingPublisher
import edu.utn.alojamiento.user.UserRepository
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.CopyOnWriteArrayList
import org.springframework.stereotype.Component

@Component
class UserNotificationService(
	private val userRepository: UserRepository,
	private val listingPublisher: ListingPublisher
) : ListingObserver {

	private val notifications: MutableMap<String, MutableList<ListingNotification>> = ConcurrentHashMap()

	init {
		listingPublisher.subscribe(this)
	}

	override fun onListingAvailable(listing: Listing) {
		val listingId = listing.id ?: return
		val matches = userRepository.findByPreferredBedrooms(listing.bedrooms)
		if (matches.isEmpty()) {
			return
		}
		val notification = ListingNotification(
			listingId = listingId,
			listingTitle = listing.title,
			bedrooms = listing.bedrooms
		)
		matches.forEach { user ->
			notifications.computeIfAbsent(user.id) { CopyOnWriteArrayList() }.add(notification)
		}
	}

	fun getNotificationsForUser(userId: String): List<ListingNotification> =
		notifications[userId]?.toList() ?: emptyList()
}
