FROM cgr.dev/chainguard/nginx:latest@sha256:c5b581989f162fca74cfdc54d7e868545599605b47873dfacffcbc247d8b6637

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3001
