# Dockerfile extending the generic Node image with application files for a
# single application.
FROM node:8

ARG NODE=production

WORKDIR /app

# Since docker has an image cache, installing dependencies early speeds up most builds.
COPY package.json /app/

# This will only run when there is a change to package.json.
RUN npm install

# Copy the entire application
COPY . /app

# Use NODE as a cmd line arg - default is production
ENV NODE_ENV ${NODE}
RUN echo ${NODE_ENV}

EXPOSE 3000

# Move into app
WORKDIR /app

# Run the server
CMD npm start