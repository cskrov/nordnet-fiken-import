FROM cgr.dev/chainguard/nginx:latest@sha256:2ce17f21e8f27635a53956609e27257b0a2d5bec233f800dd1f3d4b8757dd5fe

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3000
