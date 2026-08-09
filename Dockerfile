FROM cgr.dev/chainguard/nginx:latest@sha256:b17c92a87d026be3e282a8fd0f5354e718680c2a317e0e403850d84dda59354e

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3001
