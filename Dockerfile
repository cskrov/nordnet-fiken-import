FROM cgr.dev/chainguard/nginx:latest@sha256:028368a7e271b3e0aed3bdc82195de6b38a2fee2bdd2a0b7ce1c4b944907098c

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3001
