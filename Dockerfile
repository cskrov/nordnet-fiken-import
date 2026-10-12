FROM cgr.dev/chainguard/nginx:latest@sha256:2e0963ea5cd69cf64af80c53890f414ea47b8b1ad2aeb9ec6651153261794790

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3001
