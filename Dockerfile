FROM cgr.dev/chainguard/nginx:latest@sha256:0352063c168740414d8caf7cbcc2b386506dba82ba3955cfaee2b8582a1a93a8

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3001
