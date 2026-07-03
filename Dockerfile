FROM cgr.dev/chainguard/nginx:latest@sha256:c516cddebbf0613c8020a9bd9b44e54a9feafc9742a1f1a04cb8d08bf55ef212

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3000
