#!/bin/bash

TOKEN="APP_USR-4805836158291572-062714-a9298244acbf5c2b36f5c63c69db9faa-185285388"

curl -X GET \
https://api.mercadopago.com/users/me \
-H "Authorization: Bearer $TOKEN"
