package edu.utn.alojamiento.listing

import org.springframework.data.jpa.repository.JpaRepository

interface ListingRepository : JpaRepository<Listing, Long>
