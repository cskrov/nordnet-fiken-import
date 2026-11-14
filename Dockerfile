FROM cgr.dev/chainguard/nginx:latest@sha256:3efdf56b9730d56a9bc88edf268ab72ee965cbb7d116291a8679cd89ef67e0c5

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3001
