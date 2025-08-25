#!/bin/sh

envsubst '$BACKEND_HOST' < /etc/nginx/conf.d/nginx.conf.template > /etc/nginx/conf.d/default.conf

cat <<EOF > /usr/share/nginx/html/config.js
window.runtimeConfig = {
  FIREBASE_APIKEY: "$FIREBASE_APIKEY",
  FIREBASE_APPID: "$FIREBASE_APPID",
  FIREBASE_ID: "$FIREBASE_ID",
  VITE_API_BASE: "$VITE_API_BASE"
};
EOF

nginx -g "daemon off;"
