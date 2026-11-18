FROM cgr.dev/chainguard/nginx:latest@sha256:9708b6c879cb97b0641ce48891a0ced73e09624b717a256564710e6864a42a5f

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3001
