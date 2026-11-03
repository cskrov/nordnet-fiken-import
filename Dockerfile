FROM cgr.dev/chainguard/nginx:latest@sha256:b9debc2fbe5bf256b4c3980d0bbfda8187d46e35b4117c582ace66269dc1de28

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3001
