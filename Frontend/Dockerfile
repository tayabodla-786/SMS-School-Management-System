# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
CMD sh -c "sed -i 's/listen 80;/listen '"$PORT"';/' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"