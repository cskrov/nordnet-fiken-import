FROM cgr.dev/chainguard/nginx:latest@sha256:fe77a7f4da2ed98d5629bab3f4f2a0cc40ab18b341cb46a62f05acce7a760c82

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3000
