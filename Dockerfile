FROM cgr.dev/chainguard/nginx:latest@sha256:7a23d33c3678c21b673fee5eec76905c59090fd3b077bb6936b635c92b66cff4

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3000
