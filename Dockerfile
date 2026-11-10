FROM cgr.dev/chainguard/nginx:latest@sha256:1fae1bff8072a00f3de3dc5aa95af8b5587dde2297b08c72893dacf423ccbe6e

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3001
