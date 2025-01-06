# Use Node.js 18 base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all other project files
COPY . .

# Expose a port (optional, if your bot hosts a web server)
EXPOSE 3000

# Set the command to run your bot
CMD ["node", "bot.js"]