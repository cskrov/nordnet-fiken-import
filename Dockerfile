FROM cgr.dev/chainguard/nginx:latest@sha256:a0ddb6f13562105c6a0b473d0e9ff8a6e2bf8aa3d2e17c08d170b2fef0f2a0e6

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3001
