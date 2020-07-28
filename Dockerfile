FROM node:12.18.0-buster

ARG TINI_VERSION=v0.18.0

WORKDIR /app

ADD . .

RUN apt-get update && \
  apt-get install -y curl git && \
  rm -fr /var/lib/apt/lists/* && \
  curl -Lo /sbin/tini https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini && \
  chmod +x /sbin/tini && \
  yarn install --prod && \
  rm -fr /tmp/* /usr/local/share/.cache

EXPOSE 3000

ENTRYPOINT ["/sbin/tini", "--"]
