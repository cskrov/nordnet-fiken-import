# The deploy workflow passes the base image pinned to the digest it resolved
ARG BASE_IMAGE=cgr.dev/chainguard/nginx:latest
FROM ${BASE_IMAGE}

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3001
