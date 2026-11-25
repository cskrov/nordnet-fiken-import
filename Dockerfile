FROM cgr.dev/chainguard/nginx:latest@sha256:858e682ca95e4bf1cc23ce871227315620a1d653423fe2dc98056d094c480562

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3001
