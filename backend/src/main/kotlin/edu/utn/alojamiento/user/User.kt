package edu.utn.alojamiento.user

import jakarta.persistence.Column
import jakarta.persistence.DiscriminatorColumn
import jakarta.persistence.DiscriminatorType
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Inheritance
import jakarta.persistence.InheritanceType
import jakarta.persistence.Table

@Entity
@Table(name = "users")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "user_type", discriminatorType = DiscriminatorType.STRING, length = 16)
abstract class User(
	@Id
	@Column(length = 64)
	open val id: String,
	@Column(nullable = false, unique = true)
	open var email: String,
	@Column(nullable = false)
	open var name: String,
	open val type: UserType
)
