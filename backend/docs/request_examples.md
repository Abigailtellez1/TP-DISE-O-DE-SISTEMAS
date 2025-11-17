# Listing API Request Examples

All requests assume the application is running locally at `http://localhost:8080`.

## 1. Create a Listing

```bash
curl -X POST http://localhost:8080/api/listings \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Cozy Palermo Loft",
    "description": "Light-filled loft near the best coffee shops.",
    "nightlyPrice": 95.00,
    "city": "Buenos Aires",
    "maxGuests": 3
  }'
```

## 2. Update a Listing (PATCH specific fields)

```bash
curl -X PATCH http://localhost:8080/api/listings/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nightlyPrice": 110.00,
    "maxGuests": 4
  }'
```

## 3. View a Single Listing

```bash
curl http://localhost:8080/api/listings/1
```

## 4. View Listings with Pagination

```bash
curl "http://localhost:8080/api/listings?page=0&size=5"
```

## 5. Delete a Listing

```bash
curl -X DELETE http://localhost:8080/api/listings/1
```
