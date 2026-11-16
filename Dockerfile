FROM cgr.dev/chainguard/nginx:latest@sha256:ff2a257e03689363e7dabc3456030c58b790604c3a8f91902fe89a604ec05ce3

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3001
