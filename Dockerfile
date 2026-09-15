FROM cgr.dev/chainguard/nginx:latest@sha256:dc9595d10f629d75a1e28e7879d512b48f079d39138b7f3721e9902220c69539

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3001
