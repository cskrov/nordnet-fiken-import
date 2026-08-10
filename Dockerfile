FROM cgr.dev/chainguard/nginx:latest@sha256:2189489ef3fa5b1e94a8463f98f9c148a4d8e7498d3f747069fc78de405742fc

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3001
