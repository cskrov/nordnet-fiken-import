FROM cgr.dev/chainguard/nginx:latest@sha256:0b4de0f60ae2295fdc852564d178b5473109baf9fc826fa5eb38a59f930e218e

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3001
