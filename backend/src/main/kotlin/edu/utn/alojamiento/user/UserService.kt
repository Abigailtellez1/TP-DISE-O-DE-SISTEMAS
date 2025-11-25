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
	fun upsertStudent(id: String, request: StudentProfileRequest): UserResponse {
		val user = userRepository.findById(id).orElseGet {
			StudentUser(
				id = id,
				email = request.email,
				name = request.name,
				preferredBedrooms = request.preferredBedrooms
			)
		}.apply {
			when (this) {
				is StudentUser -> {
					email = request.email
					name = request.name
					preferredBedrooms = request.preferredBedrooms
				}

				is LandlordUser -> {
					email = request.email
					name = request.name
				}

				else -> {
					email = request.email
					name = request.name
				}
			}
		}
		return UserResponse.from(userRepository.save(user))
	}

	@Transactional
	fun upsertLandlord(id: String, request: LandlordProfileRequest): UserResponse {
		val user = userRepository.findById(id).orElseGet {
			LandlordUser(
				id = id,
				email = request.email,
				name = request.name
			)
		}.apply {
			email = request.email
			name = request.name
		}
		return UserResponse.from(userRepository.save(user))
	}

	@Transactional(readOnly = true)
	fun findUser(id: String): User =
		userRepository.findById(id).orElseThrow { UserNotFoundException(id) }
}
