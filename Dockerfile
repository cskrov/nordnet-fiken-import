FROM cgr.dev/chainguard/nginx:latest@sha256:6fb27a4d173ed005c19cfd6229ca76d02c3ff84533c762327faa01027a7b7f0d

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3001
