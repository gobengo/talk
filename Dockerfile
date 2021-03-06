FROM node:7

# Install yarn
RUN npm install -g yarn

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Setup the environment
ENV NODE_ENV production
ENV PATH /usr/src/app/bin:$PATH
ENV TALK_PORT 5000
EXPOSE 5000

# Install app dependencies
COPY package.json /usr/src/app/
RUN yarn install --production

# Bundle app source
COPY . /usr/src/app

CMD [ "yarn", "start" ]
