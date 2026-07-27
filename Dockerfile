FROM cgr.dev/chainguard/nginx:latest@sha256:e4ff957080737c90a9ecfeaa40e3d19ea9d687e9cacda2f2a031c75ffcdd72b7

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3001
