package edu.utn.alojamiento.user

import edu.utn.alojamiento.notification.UserNotificationService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/users")
class UserController(
	private val userService: UserService,
	private val userNotificationService: UserNotificationService
) {

	@GetMapping("/{id}")
	fun getUser(@PathVariable id: String): UserResponse = userService.getUser(id)

	@PutMapping("/{id}")
	@ResponseStatus(HttpStatus.OK)
	fun upsertUser(
		@PathVariable id: String,
		@Valid @RequestBody request: UserProfileRequest
	): UserResponse = userService.upsertUser(id, request)

	@GetMapping("/{id}/notifications")
	fun getNotifications(@PathVariable id: String) =
		userNotificationService.getNotificationsForUser(userService.findUser(id).id)
}
