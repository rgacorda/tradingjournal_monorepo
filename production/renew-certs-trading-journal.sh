#!/bin/bash
# Deploy to ~/production/renew-certs.sh
# Stops nginx briefly so certbot can use port 80
set -e
cd ~/production
docker compose stop nginx
certbot renew
docker compose start nginx
docker compose exec nginx nginx -s reload
