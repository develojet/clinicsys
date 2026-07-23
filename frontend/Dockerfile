# --- Stage 1: Build Stage ---
FROM node:22-alpine AS build

WORKDIR /app

# Copy package metadata and install dependencies
COPY package*.json ./
RUN npm ci

# Copy application source files
COPY . .

# Build the static assets (outputs to /app/dist)
RUN npm run build

# --- Stage 2: Serve Stage ---
FROM nginx:alpine

# Copy built static files from Stage 1 to Nginx default folder
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration to handle SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]