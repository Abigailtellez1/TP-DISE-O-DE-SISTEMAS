package edu.utn.alojamiento.user

import jakarta.persistence.Column
import jakarta.persistence.DiscriminatorValue
import jakarta.persistence.Entity

@Entity
@DiscriminatorValue("STUDENT")
class StudentUser(
	id: String,
	email: String,
	name: String,
	@Column(nullable = true)
	var preferredBedrooms: Int? = null
) : User(
	id = id,
	email = email,
	name = name,
	type = UserType.STUDENT
)
