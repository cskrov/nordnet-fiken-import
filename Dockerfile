FROM cgr.dev/chainguard/nginx:latest@sha256:f6cbe96998972d87ebe30952ec1b6f3cff4103c33c889ffca7e13053e2036571

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3001
