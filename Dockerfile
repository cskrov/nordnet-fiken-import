FROM cgr.dev/chainguard/nginx:latest@sha256:e4f42d79dba63fcc8e9f7d35ed51862eb9b8dd2c5750e5e5a973e1bcf042e31f

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3000
