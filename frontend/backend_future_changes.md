# Future Backend Changes (roles & landlord support)

1) User roles (guest student vs landlord)
   - Extend the `User` entity/DTO with a `role` field (enum: `GUEST`, `LANDLORD`).
   - Validate role on creation/update and expose it in responses.
   - Add basic input validation and default role (e.g., `GUEST`) for backwards compatibility.

2) Listings by landlord
   - Add a controller endpoint: `GET /api/users/{id}/listings` returning listings created by that user.
   - Extend the `Listing` entity to include an `ownerId` (FK to users) and propagate it through create/update DTOs.
   - For `POST /api/listings`, bind the authenticated landlord as owner; for now accept an `ownerId` field until auth is wired.

3) Access control groundwork
   - Once roles exist, restrict creation/update/delete of listings to `LANDLORD` users; guests remain read-only.
   - Consider soft validation for now (warn/log) to keep demos unblocked, but plan to enforce later.

4) DTO growth readiness
   - Keep DTOs centralized and mapped via factory methods (e.g., `ListingResponse.from`).
   - Anticipate adding 4–10 fields to Listing/User/Review DTOs; ensure validation annotations are in place and keep request/response models separate from entities.
   - Add pagination wrappers to new endpoints for consistency.
