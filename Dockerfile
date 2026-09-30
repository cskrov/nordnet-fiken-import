FROM cgr.dev/chainguard/nginx:latest@sha256:98b92f87f0ceb43d45a63db62df6e7b6ec6e2efe1bcf09975a2af1ed7edfc438

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3001
