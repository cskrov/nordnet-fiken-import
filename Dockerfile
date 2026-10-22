FROM cgr.dev/chainguard/nginx:latest@sha256:9d34c0a9f349eaf64ec75b3e8c09774fa234152a03cee94121e09e7220e2a560

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3001
