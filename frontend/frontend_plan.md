# Frontend Implementation Plan

Goal: Ship a React + TypeScript frontend that exercises all backend endpoints (localhost:8080) for users, listings, reviews, and notifications. Keep iterations small and testable.

## Stack / Conventions
- React + Vite + TypeScript; plain CSS for styling.
- Routing via React Router.
- Data fetching via small API wrappers (or TanStack Query later).
- API base URL from `VITE_API_BASE_URL` (defaults to http://localhost:8080).
- Types live in `src/types/*`; API calls in `src/api/*`.

## Feature Modules / Work Order
1) User Profile + Notifications (first)
   - Screens: user selector, load profile (`GET /api/users/{id}`), upsert form (`PUT /api/users/{id}`).
   - Notifications view: `GET /api/users/{id}/notifications`.
   - Feedback: loading/error states, success toast/message.

2) Listings CRUD with pagination
   - Screens: paginated list/table (`GET /api/listings?page&size`), create form (`POST`), edit form (`PATCH`), delete action (`DELETE`), view single (`GET /api/listings/{id}`).
   - Controls: page/size inputs, basic validation.

3) Reviews per listing
   - Screens: list reviews for a listing (`GET /api/listings/{listingId}/reviews?page&size`).
   - Form: create review (`POST`), fields rating 1–5, comment, authorId.

4) Polish / Shared UX
   - Shared layout/nav, buttons/inputs styles, loading/error components.
   - Confirm copy states and empty states; minimal responsive styles.

## File Structure (target)
```
src/
  api/
    client.ts
    listings.ts
    users.ts
    reviews.ts
  types/
    listing.ts
    user.ts
    review.ts
  components/
    layout/
    forms/
    feedback/
  pages/
    UserProfilePage.tsx
    NotificationsPage.tsx
    ListingsPage.tsx
    ReviewsPage.tsx
  router/
    AppRouter.tsx
```

## Iteration Checklist
- [ ] Env: copy `.env.example` to `.env` if needed; verify `VITE_API_BASE_URL`.
- [ ] Layout + router skeleton.
- [ ] User Profile page + notifications fetch.
- [ ] Listings CRUD + pagination controls.
- [ ] Reviews page + submission form.
- [ ] Manual test flow: create user -> set preferredBedrooms -> create listing with matching bedrooms -> see notification -> add review.
- [ ] Optional: add basic tests for API helpers/components.
