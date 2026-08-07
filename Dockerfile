FROM cgr.dev/chainguard/nginx:latest@sha256:171bc52d7bb01604bfb107800e646a02915ec9f98fb145659bb859955d1d7f51

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3001
