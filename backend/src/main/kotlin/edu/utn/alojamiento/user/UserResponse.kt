package edu.utn.alojamiento.user

data class UserResponse(
	val id: String,
	val email: String,
	val name: String,
	val preferredBedrooms: Int?
) {
	companion object {
		fun from(user: User) = UserResponse(
			id = user.id,
			email = user.email,
			name = user.name,
			preferredBedrooms = user.preferredBedrooms
		)
	}
}
