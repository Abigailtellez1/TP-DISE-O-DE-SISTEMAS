# Project Context

This backend powers a minimal Airbnb-style platform where students can browse short-term listings and interact with hosts. The codebase currently exposes CRUD-like REST endpoints for managing property listings backed by Spring Boot 3, Kotlin, and Spring Data JPA. Listings are stored in PostgreSQL (with H2 for dev/tests) and exposed via `/api/listings` with DTOs for creation and patch updates plus pagination support.

We are extending the application with:

- User profiles tied to Google SSO identifiers, including a simple bedroom preference that downstream logic can use.
- Reviews authored by users on listings (rating + comment).
- An Observer-pattern-based notification system that notifies users when new/updated listings match their bedroom preferences, with notifications stored in memory and retrievable per user.

The new features require additional entities, repositories, services, controllers, and DTOs. They also add `ListingPublisher`/`ListingObserver` abstractions so `ListingService` can broadcast events, and a `UserNotificationService` that listens for events, performs bedroom matching, and keeps notifications per user accessible via an API.
