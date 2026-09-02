FROM cgr.dev/chainguard/nginx:latest@sha256:2015f7fa3b514c1bb8de63ed0ebe769295e6d15c5a401fcafbbe555760d42e57

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3001
