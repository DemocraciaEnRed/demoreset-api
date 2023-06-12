FROM node:14

# Set the working directory inside the container
WORKDIR /usr/demoreset-api

# Install Babel and necessary presets and plugins
RUN npm install --save-dev @babel/core @babel/cli @babel/preset-env

# Transpile the application code
RUN npx babel . --out-dir dist --ignore node_modules

# Copy the application source code to the container
COPY . .

# Install production dependencies
RUN npm install --production

# Expose a port if your application listens on a specific port
EXPOSE 4000

# Define the command to run your application
CMD [ "node", "dist/index.js" ]