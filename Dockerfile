FROM cgr.dev/chainguard/nginx:latest@sha256:34d9edf274e639efbf2880fe29326710fa42d5c77106f9dd0d97bf3516354f03

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3000
