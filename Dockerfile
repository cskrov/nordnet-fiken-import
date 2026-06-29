FROM cgr.dev/chainguard/nginx:latest@sha256:d166cfff80ac94040ccc52c6a42768486483514f7494ca641a68399655b4a053

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3000
