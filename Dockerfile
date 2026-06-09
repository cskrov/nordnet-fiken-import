FROM cgr.dev/chainguard/nginx:latest@sha256:68aeaafe779ad616e80a4e63f223f42b20d5d4673fd2014a69dbdcadc57a267d

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3000
