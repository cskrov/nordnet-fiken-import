FROM cgr.dev/chainguard/nginx:latest@sha256:a57e76e6fc57826717c7696df82441f66a835205b3f09232a598840e2fac7786

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3001
