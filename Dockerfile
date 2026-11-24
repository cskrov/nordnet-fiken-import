FROM cgr.dev/chainguard/nginx:latest@sha256:89bea6e2136cc4aaaf5f0ab3ca26372c82462d9b145e755eede6fc5ff96e7f74

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3001
