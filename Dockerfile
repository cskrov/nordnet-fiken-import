FROM cgr.dev/chainguard/nginx:latest@sha256:d826cd7cff4e5a8f9477e685696cbddb47c33df1b8dc22c7d581e16ff70e44aa

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3001
