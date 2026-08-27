FROM cgr.dev/chainguard/nginx:latest@sha256:38e202d0304b7bf0235ade6ef622c8bf0242fdd5c674bf301ca5cbbb378ff7df

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3001
