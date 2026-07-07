FROM cgr.dev/chainguard/nginx:latest@sha256:f23fcc2d894e8711b25d88ca4d3ea50964c8268e67fc6e58b054c652f08f2ad5

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3000
