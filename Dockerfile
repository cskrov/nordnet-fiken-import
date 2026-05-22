FROM cgr.dev/chainguard/nginx:latest@sha256:344895094a6a0ce455c8400b9c5bc1f0d4c28941c2782f488f03bb724097a8cc

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3000
