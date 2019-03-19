FROM node:10.15.3-jessie-slim

ARG TINI_VERSION=v0.18.0

ADD . /deploy

RUN chown -R 1000:1000 /deploy && \
  curl -Lo /sbin/tini https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini && \
  chmod +x /sbin/tini

USER 1000:1000

WORKDIR /deploy

RUN yarn install --prod && \
  rm -fr /home/node/.cache /tmp/*

EXPOSE 8080

ENTRYPOINT ["/sbin/tini", "--"]

CMD ["yarn", "start", "-l", "tcp://0.0.0.0:8080"]
