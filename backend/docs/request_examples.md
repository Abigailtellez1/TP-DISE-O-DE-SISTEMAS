# API Request Examples

All commands target `http://localhost:8080`. Replace placeholder IDs as needed.

## Listings (`/api/listings`)

### Create a listing

```bash
curl -X POST http://localhost:8080/api/listings \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Cozy Palermo Loft",
    "description": "Light-filled loft near the best coffee shops.",
    "nightlyPrice": 95.00,
    "bedrooms": 2,
    "city": "Buenos Aires",
    "district": "Palermo",
    "ownerId": "landlord-123",
    "maxGuests": 3
  }'
```

### Patch an existing listing

```bash
curl -X PATCH http://localhost:8080/api/listings/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nightlyPrice": 110.00,
    "maxGuests": 4
  }'
```

### Get a single listing

```bash
curl http://localhost:8080/api/listings/1
```

### Get listings with pagination (with optional filters)

```bash
curl "http://localhost:8080/api/listings?page=0&size=5&ownerId=landlord-123&district=Palermo"
```

### Delete a listing

```bash
curl -X DELETE http://localhost:8080/api/listings/1
```

## Users (`/api/users`)

### Upsert a user profile

```bash
curl -X PUT http://localhost:8080/api/users/user-123 \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user123@example.com",
    "name": "Casey Student",
    "preferredBedrooms": 2,
    "isLandlord": false
  }'
```

### Get a user profile

```bash
curl http://localhost:8080/api/users/user-123
```

### Fetch user notifications

```bash
curl http://localhost:8080/api/users/user-123/notifications
```

## Reviews (`/api/listings/{listingId}/reviews`)

### Create a review for a listing

```bash
curl -X POST http://localhost:8080/api/listings/1/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 5,
    "comment": "Great stay, super clean!",
    "authorId": "user-123"
  }'
```

### Get reviews for a listing (paginated)

```bash
curl "http://localhost:8080/api/listings/1/reviews?page=0&size=3"
```
