FROM cgr.dev/chainguard/nginx:latest@sha256:85293f79f17cf78792313ca87d316b2f5fa7d0fcff18a33c8e9597cafddb44f0

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3001
