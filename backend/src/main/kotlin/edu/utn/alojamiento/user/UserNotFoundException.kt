package edu.utn.alojamiento.user

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus

@ResponseStatus(HttpStatus.NOT_FOUND)
class UserNotFoundException(userId: String) : RuntimeException("User $userId not found")
