FROM cgr.dev/chainguard/nginx:latest@sha256:4a7323c4539d04a2d515f7b5f5f449b0d70d06e8128558585c2cabcc05ad2a76

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3000
