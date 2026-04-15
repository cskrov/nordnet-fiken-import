FROM cgr.dev/chainguard/nginx:latest@sha256:c3ca473ca3bd2881d48e6f678953f9669aba777134c48c4ae37f996285071768

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3000
