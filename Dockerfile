FROM cgr.dev/chainguard/nginx:latest@sha256:cd35918ef80082318a9215becdb351c964435193003f281ebb8d5de872562ccd

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3000
