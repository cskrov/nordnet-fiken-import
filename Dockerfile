FROM cgr.dev/chainguard/nginx:latest@sha256:f5bfac85024ea2d7c16a28ac21e985c6d19a20a60ae74838f056297d44467525

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3001
