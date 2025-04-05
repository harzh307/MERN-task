# Use Node.js LTS version
FROM node:20-alpine

# Install Yarn
RUN corepack enable && corepack prepare yarn@4.4.0 --activate

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json yarn.lock ./
RUN yarn install --no-immutable

# Bundle app source
COPY . .

# Install TypeScript and build dependencies
RUN yarn add -D typescript @types/node ts-node

# Build TypeScript
RUN yarn tsc

# Expose port
EXPOSE 3000

# Start the app
CMD ["yarn", "start"] 