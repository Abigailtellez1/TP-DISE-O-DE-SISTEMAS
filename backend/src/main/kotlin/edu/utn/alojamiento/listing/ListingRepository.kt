package edu.utn.alojamiento.listing

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor

interface ListingRepository : JpaRepository<Listing, Long>, JpaSpecificationExecutor<Listing>
