FROM mhart/alpine-node:latest

WORKDIR /app
ADD . .
RUN rm -r src/
RUN yarn install

EXPOSE 3000
CMD ["yarn", "start"]