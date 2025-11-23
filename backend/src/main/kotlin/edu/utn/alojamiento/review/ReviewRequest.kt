package edu.utn.alojamiento.review

import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class ReviewRequest(
	@field:Min(1)
	@field:Max(5)
	val rating: Int,
	@field:NotBlank
	@field:Size(max = 2000)
	val comment: String,
	@field:NotBlank
	val authorId: String
)
