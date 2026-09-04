FROM cgr.dev/chainguard/nginx:latest@sha256:8a4981bd9d32dcf4406bbbac259565962f15c5c3cc235bf9df98fe2e5a9cea19

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3001
