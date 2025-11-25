package edu.utn.alojamiento.user

import jakarta.persistence.DiscriminatorValue
import jakarta.persistence.Entity

@Entity
@DiscriminatorValue("LANDLORD")
class LandlordUser(
	id: String,
	email: String,
	name: String
) : User(
	id = id,
	email = email,
	name = name,
	type = UserType.LANDLORD
)
