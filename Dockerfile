FROM cgr.dev/chainguard/nginx:latest@sha256:df0a97604163fb49366d0853c34b238cde40122606f3c92940d47717689a0473

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3001
