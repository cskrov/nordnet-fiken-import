FROM cgr.dev/chainguard/nginx:latest@sha256:65ad444a372b9f69821ef15acb95c46e9cffdd520bbdc4f8a72d5d38d7c1ca92

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3000
