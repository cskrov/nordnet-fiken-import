FROM cgr.dev/chainguard/nginx:latest@sha256:aa1ad3cd86d52b85d86edb8d73b1d00698b74958af5928e5cae3b786f4263afb

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3001
