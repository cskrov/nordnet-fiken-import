FROM cgr.dev/chainguard/nginx:latest@sha256:2b9eb6994995f34e72ef24e2cc1924455198ccc4a3cff6f8839b0587681fc77b

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3000
