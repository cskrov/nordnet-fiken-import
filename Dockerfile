FROM cgr.dev/chainguard/nginx:latest@sha256:f801aa4ac908f6c3847efe81b577e4f34e1f237b5556dfbe698127ad464db269

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3001
