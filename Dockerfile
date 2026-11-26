FROM cgr.dev/chainguard/nginx:latest@sha256:9debcc9767ac653c2b302d74d1ce157a445da8bbcc1f2d48993d02f68fb2e964

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3001
