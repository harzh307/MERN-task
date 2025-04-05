#!/bin/bash

# Base URL
BASE_URL="http://localhost:3000/api"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "Testing API endpoints..."

# Test Register
echo -e "\n${GREEN}Testing Register${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }')
echo "Register Response: $REGISTER_RESPONSE"

# Extract token from register response
TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# Test Login
echo -e "\n${GREEN}Testing Login${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')
echo "Login Response: $LOGIN_RESPONSE"

# Test Create Category
echo -e "\n${GREEN}Testing Create Category${NC}"
CATEGORY_RESPONSE=$(curl -s -X POST "$BASE_URL/categories" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Test Category",
    "description": "Test Description"
  }')
echo "Create Category Response: $CATEGORY_RESPONSE"

# Extract category ID
CATEGORY_ID=$(echo $CATEGORY_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)

# Test Get Categories
echo -e "\n${GREEN}Testing Get Categories${NC}"
GET_CATEGORIES_RESPONSE=$(curl -s -X GET "$BASE_URL/categories" \
  -H "Authorization: Bearer $TOKEN")
echo "Get Categories Response: $GET_CATEGORIES_RESPONSE"

# Test Get Single Category
echo -e "\n${GREEN}Testing Get Single Category${NC}"
GET_CATEGORY_RESPONSE=$(curl -s -X GET "$BASE_URL/categories/$CATEGORY_ID" \
  -H "Authorization: Bearer $TOKEN")
echo "Get Single Category Response: $GET_CATEGORY_RESPONSE"

# Test Update Category
echo -e "\n${GREEN}Testing Update Category${NC}"
UPDATE_CATEGORY_RESPONSE=$(curl -s -X PUT "$BASE_URL/categories/$CATEGORY_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Updated Category",
    "description": "Updated Description"
  }')
echo "Update Category Response: $UPDATE_CATEGORY_RESPONSE"

# Test Delete Category
echo -e "\n${GREEN}Testing Delete Category${NC}"
DELETE_CATEGORY_RESPONSE=$(curl -s -X DELETE "$BASE_URL/categories/$CATEGORY_ID" \
  -H "Authorization: Bearer $TOKEN")
echo "Delete Category Response: $DELETE_CATEGORY_RESPONSE" 