FROM cgr.dev/chainguard/nginx:latest@sha256:fdd65ea225da60875e24a8b45d1e65501f9e4991b3b097ae65ed8a4c8f3782a3

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3000
