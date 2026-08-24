FROM cgr.dev/chainguard/nginx:latest@sha256:b75e46f5101f5248c274ed1153b4fe9d9d3c25b2f4c22c0634d6c7394b25283d

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3001
