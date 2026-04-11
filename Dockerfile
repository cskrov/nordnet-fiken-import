FROM cgr.dev/chainguard/nginx:latest@sha256:b2416a54b96f05e4c607fd2160f3bd8d4e3233fd37697ea4b466b890af73a4ff

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3000
