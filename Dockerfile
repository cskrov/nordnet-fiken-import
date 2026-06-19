FROM cgr.dev/chainguard/nginx:latest@sha256:c6e528328cc6031ba1256c765db7a64b4acd180e9fc343eac23d9807d1cb37bf

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3000
