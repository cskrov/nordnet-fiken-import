FROM cgr.dev/chainguard/nginx:latest@sha256:8987b562107b4275bd594b9dcf2def36737720460b12fce90bb13c729353ca54

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3000
