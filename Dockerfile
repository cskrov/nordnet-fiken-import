FROM cgr.dev/chainguard/nginx:latest@sha256:73c0649f53c937be62ce535380edcafc730466ac9da62be85c8e325bc5347d1f

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3000
