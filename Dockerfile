FROM cgr.dev/chainguard/nginx:latest@sha256:c9b4886a227029de68781204ace0c221c36efbddddd82cc40baa5f510cb30a46

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3001
