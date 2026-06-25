FROM cgr.dev/chainguard/nginx:latest@sha256:919245025f299eba38530d49a63f3799e4bbdf6c06106490c399710c4ba55023

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3000
