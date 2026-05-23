FROM cgr.dev/chainguard/nginx:latest@sha256:8c068cdde0c972ffcbfbb2954525f68d180c1be3ac16b3b7573cc7188cc87c96

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3000
