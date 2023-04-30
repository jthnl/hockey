FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . /app
RUN npm run build

FROM nginx:stable-alpine
COPY --from=0 /app/build /usr/share/nginx/html
EXPOSE 30091
CMD ["nginx", "-g", "daemon off;"]