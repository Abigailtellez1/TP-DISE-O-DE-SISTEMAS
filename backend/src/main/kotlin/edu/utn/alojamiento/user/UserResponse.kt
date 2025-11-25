package edu.utn.alojamiento.user

data class UserResponse(
	val id: String,
	val email: String,
	val name: String,
	val type: UserType,
	val preferredBedrooms: Int? = null
) {
	companion object {
		fun from(user: User): UserResponse = when (user) {
			is StudentUser -> UserResponse(
				id = user.id,
				email = user.email,
				name = user.name,
				type = UserType.STUDENT,
				preferredBedrooms = user.preferredBedrooms
			)

			is LandlordUser -> UserResponse(
				id = user.id,
				email = user.email,
				name = user.name,
				type = UserType.LANDLORD,
				preferredBedrooms = null
			)

			else -> UserResponse(
				id = user.id,
				email = user.email,
				name = user.name,
				type = user.type,
				preferredBedrooms = null
			)
		}
	}
}
