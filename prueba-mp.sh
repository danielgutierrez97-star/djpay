#!/bin/bash

source .env.local

curl -X POST https://api.mercadopago.com/checkout/preferences \
  -H "Authorization: Bearer $MERCADOPAGO_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "title": "Prueba DJPAY",
        "quantity": 1,
        "unit_price": 1000,
        "currency_id": "CLP"
      }
    ]
  }'
