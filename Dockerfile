FROM cgr.dev/chainguard/nginx:latest@sha256:51048009c0db8c584a3746a98368295fa2c13ad1b29e5c846a5d3da9dd9b35c4

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3001
