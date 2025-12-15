package edu.utn.alojamiento.reservation

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor

interface ReservationRepository : JpaRepository<Reservation, Long>, JpaSpecificationExecutor<Reservation>
