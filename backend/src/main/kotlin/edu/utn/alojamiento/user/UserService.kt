package edu.utn.alojamiento.user

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class UserService(
	private val userRepository: UserRepository
) {

	@Transactional(readOnly = true)
	fun getUser(id: String): UserResponse = UserResponse.from(findUser(id))

	@Transactional
	fun upsertUser(id: String, request: UserProfileRequest): UserResponse {
		val user = userRepository.findById(id).orElseGet {
			User(
				id = id,
				email = request.email,
				name = request.name,
				preferredBedrooms = request.preferredBedrooms,
				isLandlord = request.isLandlord
			)
		}.apply {
			email = request.email
			name = request.name
			preferredBedrooms = request.preferredBedrooms
			isLandlord = request.isLandlord
		}
		return UserResponse.from(userRepository.save(user))
	}

	@Transactional(readOnly = true)
	fun findUser(id: String): User =
		userRepository.findById(id).orElseThrow { UserNotFoundException(id) }
}
