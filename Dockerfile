FROM cgr.dev/chainguard/nginx:latest@sha256:5311f138c0e13b6998168dd31f74a98fa0c324767c0fc16ef3f7a556a7f8e0d5

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3000
