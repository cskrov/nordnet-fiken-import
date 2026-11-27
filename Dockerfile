FROM cgr.dev/chainguard/nginx:latest@sha256:7f1cc53f9c57ecfd182fa7a266f6178c5ba4b0a826421b87a753021db7d3d430

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3001
