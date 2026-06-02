FROM cgr.dev/chainguard/nginx:latest@sha256:bfc999927013bd5d015c496342bd8fc1b43a94e740b61af1fa55734f66e94947

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3000
