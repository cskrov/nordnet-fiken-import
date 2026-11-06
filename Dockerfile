FROM cgr.dev/chainguard/nginx:latest@sha256:5f1056de9a9fd549e9c2a45476375a886c85c8be2b1545e6ecd1bf8fa78c88aa

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3001
