FROM cgr.dev/chainguard/nginx:latest@sha256:71093c1127c31422838904b00b32287bd2bf58cd06e0abc3c85d96597d46a448

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3000
