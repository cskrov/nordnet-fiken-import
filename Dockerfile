FROM cgr.dev/chainguard/nginx:latest@sha256:d74ba9e5cf9f6b049807e27a5a14a8cd2550ac428143b7d15ea3dbad282f4ed1

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3001
