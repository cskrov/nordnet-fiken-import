FROM cgr.dev/chainguard/nginx:latest@sha256:b66791d04723935f4c3fa436bc6c445eecece8b5136490b7dc976b4555d74fa9

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3000
