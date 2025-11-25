package edu.utn.alojamiento.user

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface UserRepository : JpaRepository<User, String> {
	@Query("select u from StudentUser u where u.preferredBedrooms = :bedrooms")
	fun findStudentsByPreferredBedrooms(bedrooms: Int): List<StudentUser>
}
