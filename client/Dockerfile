FROM node:18-alpine as build
WORKDIR /app
COPY . .
RUN npm ci 
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
ENV NODE_ENV=production
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

